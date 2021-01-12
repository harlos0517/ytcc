// alias
const getEle = sel => document.querySelector(sel)
const getRect = sel => getEle(sel).getBoundingClientRect()
const listen = window.addEventListener

let main = new Vue({
	el: '#main',
	data: {
		videoId: '',
		videoIdInput: '',
		subtitles: new Subtitles(),
		player: null,
		state: 5,
		curSub: 0,
		cursor: 0,
		videoLength: 0,
		timelineScale: 1,
		timelineStart: 0,
		subMinLength: 0.1,
		rulers: [.1, 1, 10, 60, 600, 3600],
		rulerThershold: 0.025,
		isTimelineDragging: false,
		mousePosition: {x: 0, y: 0},
		infoText: '',
		showHelp: false
	},
	methods: {
		// startup
		fetchVideoId() {
			this.videoId = (new URL(document.location.href)).searchParams.get('v')
			if (!this.videoId || !this.videoId.length) this.videoId = 'Jt-5wQroOXA'
			this.videoIdInput = this.videoId
		},
		listenPointer() {
			listen('mousemove', e => {
				this.mousePosition.x = e.x
				this.mousePosition.y = e.y
			}, true)
			listen('drag', e => {
				if (!e.x && !e.y) return
				this.mousePosition.x = e.x
				this.mousePosition.y = e.y
			}, true)
		},
		addKeyControl() {
			this.listenKey('Enter', true, this.addSubtitle)
			this.listenKey(' ', true, this.triggerPlay)
			this.listenKey('s', true, this.saveSubtitles)
			this.listenKey('e', true, this.exportSRT)
			this.listenKey('i', true, this.importSRT)
			this.listenKey('h', true, this.triggerHelp)
		},
		listenKey(key, ctrl, f) {
			listen('keydown', e => {
				if (e.key !== key) return
				if (ctrl !== e.ctrlKey) return
				e.preventDefault()
				f()
			})
		},
		triggerPlay() {
			try {
				if (this.state !== 1) this.player.playVideo()
				else this.player.pauseVideo()
			} catch {
				console.log('Player is still not ready.')
			}
		},
		startPlayer() {
			let that = this
			video = getEle('#iframe>iframe')
			that.player = new YT.Player(video, {
				events: {
					'onReady': e => {
						that.videoLength = that.player.getDuration()
						this.setInfoText('READY')
					},
					'onStateChange': e => {
						this.setInfoText(`STATE: ${e.data}`)
						that.state = e.data
					}
				}
			})
			window.requestAnimationFrame(this.update)
		},
		// update routine
		update() {
			window.requestAnimationFrame(this.update)
			this.updateCursor()
			this.setSubActive()
			this.autoScroll()
		},
		updateCursor() {
			try { this.cursor = this.getTime() }
			catch { return }
		},
		setSubActive() {
			// TODO : OPT ALGO
			this.subtitles.data.forEach(sub=>{
				sub.active = this.active(sub, this.cursor)
			})
			// Yeah fuck the algo, brutal works la
		},
		autoScroll() {
			if (this.state === 1) {
				let ratio = 0.8
				if (!this.isCursorInView())
					this.timelineStart = this.cursor - this.getTimelineLength() * (1 - ratio)
				else if (this.cursor > this.timelineStart + this.getTimelineLength() * ratio) {
					let timelineStart = this.cursor - this.getTimelineLength() * ratio
					if (this.timelineStart + this.getTimelineLength() < this.videoLength)
						this.timelineStart = timelineStart
				}
				this.timelineScrollFix()
			}
		},
		// time display utilities
		roundTime(time) {
			return Math.round(time*100)/100
		},
		getTime() {
			return this.roundTime(this.player.getCurrentTime())
		},
		getHour(time) {
			return Math.floor(time/3600).toString().padStart(2, '0')
		},
		getMin(time) {
			return Math.floor(time%3600/60).toString().padStart(2, '0')
		},
		getSec(time) {
			return (Math.floor(time%60*100)/100).toFixed(2).toString().padStart(5, '0')
		},
		active(sub, time) {
			return (time >= sub.start && time < sub.end)
		},
		// timeline utilities
		getPointerRatio() {
			let rect = getRect('#timeline')
			let x = this.mousePosition.x - rect.left //x position within the element.
			return x / rect.width
		},
		getTimelineLength() {
			return this.videoLength / this.timelineScale
		},
		getTimelineEnd() {
			return this.timelineStart + this.getTimelineLength()
		},
		getPointerTime() {
			return this.timelineStart + this.getPointerRatio() * this.getTimelineLength()
		},
		getTimelineLeft() {
			return 0 - this.timelineStart / this.getTimelineLength()
		},
		getMaxScale() {
			return this.videoLength / 2
		},
		isCursorInView() {
			return this.cursor > this.timelineStart && this.cursor < this.getTimelineEnd()
		},
		timelineScrollFix() {
			this.timelineStart = Math.max(this.timelineStart, 0)
			this.timelineStart = Math.min(this.timelineStart, this.videoLength - this.getTimelineLength())
		},
		getSubWidth(sub) {
			let width = getRect('#timeline').width
			let duration = sub.end - sub.start
			return width * duration / this.getTimelineLength()
		},
		seek(time) {
			this.player.seekTo(time, true)
		},
		isDragEnabled(sub) {
			return this.getSubWidth(sub) > 10
		},
		// timeline ruler
		getDensity() {
			let width = getRect('#timeline').width
			return this.getTimelineLength() / width
		},
		getRuler(type) {
			let density = this.getDensity()
			let ruler = 5
			for (let i = 0; i < this.rulers.length; i++) {
				if (density <= this.rulers[i] * this.rulerThershold) {
					ruler = i
					break
				}
			}
			return	(type === 'main') ? this.rulers[ruler] :
							(type === 'sub' ) ? (this.rulers[ruler - 1] || 0.01) :
							(this.rulers[ruler] / 2)
		},
		getRulerNum(type) {
			return Math.ceil(this.getTimelineLength() / this.getRuler(type)) + 1
		},
		getRulerTime(type, x) {
			return (
				Math.floor(this.timelineStart / this.getRuler(type)
			) + x - 1) * this.getRuler(type)
		},
		// timeline controls
		timelineWheel(e) {
			e.preventDefault()
			if (e.ctrlKey) {
				this.timelineZoom(e.deltaY)
			} else {
				this.timelineScroll(e.deltaY)
			}
		},
		timelineClick() {
			this.seek(this.getPointerTime())
		},
		timelineMapDrag() {
			this.dragPoint = this.dragPoint || this.getPointerRatio()
			let dr = (this.getPointerRatio() - this.dragPoint)
			let min = 0 - this.timelineStart / this.videoLength
			let max = 1 - (this.timelineStart + this.getTimelineLength()) / this.videoLength
			dr = Math.max(min, dr)
			dr = Math.min(max, dr)
			this.dragPoint = this.dragPoint + dr
			this.timelineStart = this.timelineStart + dr * this.videoLength
		},
		timelineMapDragPoint() {
			this.dragPoint = this.getPointerRatio()
			this.isTimelineDragging = true
		},
		timelineMapDragEnd() {
			this.isTimelineDragging = false
		},
		timelineZoom(delta) {
			let fixedTime = this.getPointerTime()

			this.timelineScale *= Math.pow(1.2, -delta/100)
			this.timelineScale = Math.max(1, this.timelineScale)
			this.timelineScale = Math.min(this.getMaxScale(), this.timelineScale)

			this.timelineStart = fixedTime - this.getTimelineLength() * this.getPointerRatio()
			this.timelineScrollFix()
		},
		timelineScroll(delta) {
			this.timelineStart = this.timelineStart + delta * this.getTimelineLength() / 1000
			this.timelineScrollFix()
		},
		// subtitle controls
		addSubtitle(sub) {
			if (![0, 1, 2, 3].includes(this.state)) return
			let newSub = sub || {
				start: Math.max(0, this.cursor - 1),
				end: this.cursor,
				text: '',
				active: false
			}
			this.subtitles.insert(newSub)
			this.setInfoText('ADDED SUBTITLE')
			this.saveSubtitles()
		},
		deleteSubtitle(sub) {
			this.subtitles.delete(sub)
			this.setInfoText('DELETED SUBTITLE')
			this.saveSubtitles()
		},
		dragSubtitle(sub, pos) {
			let min = (pos === 'start') ?
				(sub.prev ? sub.prev.end : 0) :
				(sub.start + this.subMinLength)
			let max = (pos === 'start') ?
				(sub.end - this.subMinLength) :
				(sub.next ? sub.next.start : this.videoLength)
			let time = this.getPointerTime()
			time = Math.max(min, time)
			time = Math.min(max, time)
			time = this.roundTime(time)
			if (pos === 'start') sub.start = time
			if (pos === 'end'  ) sub.end   = time
		},
		moveSubtitle(e, sub) {
			sub.dragPoint = sub.dragPoint || this.roundTime(this.getPointerTime())
			let dt = this.roundTime(this.getPointerTime() - sub.dragPoint)
			let min = (sub.prev ? sub.prev.end   : 0               ) - sub.start
			let max = (sub.next ? sub.next.start : this.videoLength) - sub.end
			dt = Math.max(min, dt)
			dt = Math.min(max, dt)
			dt = this.roundTime(dt)
			sub.dragPoint = this.roundTime(sub.dragPoint + dt)
			sub.start = this.roundTime(sub.start + dt)
			sub.end   = this.roundTime(sub.end   + dt)
		},
		setDragPoint(sub) {
			sub.dragPoint = this.roundTime(this.getPointerTime())
		},
		// saving controls
		loadSubtitles() {
			let cookie = document.cookie.split('; ')
				.find(row => row.startsWith(`${this.videoId}=`))
			if (!cookie) return
			let value = decodeURIComponent(cookie.split('=')[1])
			let obj = JSON.parse(value)
			this.subtitles = new Subtitles(obj)
		},
		saveSubtitles() {
			document.cookie = `${this.videoId}=${
				encodeURIComponent(JSON.stringify(this.subtitles.data.map(sub=>{
					return {
						s: sub.start,
						e: sub.end,
						t: sub.text
					}
				})))
			}`
			this.setInfoText('SAVED')
		},
		exportSRT() {
			this.setInfoText('EXPORTED')
			let that = this
			let getTimecode = function(time) {
				let hh = that.getHour(time)
				let mm = that.getMin(time)
				let ss = that.getSec(time).slice(0, 2)
				let ms = that.getSec(time).slice(3, 5) + '0'
				return `${hh}:${mm}:${ss},${ms}`
			}
			let srt = this.subtitles.data.filter(sub => 
				sub.text.replace('\n', '').length
			).map((sub, i) =>
				`${i+1}
${getTimecode(sub.start)} --> ${getTimecode(sub.end)}
${sub.text.split('\n').filter(x=>x.length).join('\n')}\n\n`
			).join('')

			// Solution on https://gist.github.com/danallison/3ec9d5314788b337b682
			let blob = new Blob([srt], { type: 'text/plain' })
			var ele = getEle('#export')
			ele.download = `Youtube_${this.videoId}.srt`
			ele.href = URL.createObjectURL(blob)
			ele.dataset.downloadurl = ['text/plain', ele.download, ele.href].join(':')
			ele.click()
			// setTimeout(function() { URL.revokeObjectURL(ele.href) }, 1500)
		},
		importSRT() {
			this.setInfoText('IMPORTING...')
			var ele = getEle('#import')
			ele.click()
		},
		async getSRT() {
			var ele = getEle('#import')
			if (!ele.files || !ele.files.length) return
			let srt = await ele.files[0].text()
			let subs = parseSRT(srt)
			this.subtitles = new Subtitles(subs)
			ele.value = ''
			this.setInfoText('IMPORTED')
		},
		// other
		setInfoText(text) {
			let target = getEle('#info-text')
			target.style.transition = ''
			target.style.opacity = 1
			this.infoText = text
			setTimeout(()=>{
				target.style.transition = 'opacity 1s'
				target.style.opacity = 0.5
			}, 100)
		},
		triggerHelp() {
			this.showHelp = !this.showHelp
		},
		debug(text) {
			console.log(text)
		}
	},
	mounted: function() {
		this.fetchVideoId()
		this.loadSubtitles()
		this.listenPointer()
		this.addKeyControl()
		window.onYouTubeIframeAPIReady = this.startPlayer
	}
})