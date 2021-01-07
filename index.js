let main = new Vue({
	el: '#main',
	data: {
		videoId: '',
		videoIdInput: '',
		subtitles: [],
		player: null,
		state: 5,
		curSub: 0,
		cursor: 0,
		videoLength: 0,
		timelineScale: 1,
		timelineStart: 0,
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
		addKeyControl() {
			let that = this
			window.addEventListener('keydown', e => {
				if (!e.ctrlKey) return
				switch (e.key) {
					case 'Enter':
						e.preventDefault()
						that.addSubtitle()
						break
					case ' ':
						e.preventDefault()
						if (that.state !== 1) {
							try { that.player.playVideo() }
							catch { break }
						} else  {
							try { that.player.pauseVideo() }
							catch { break }
						}
						break
					case 's':
						e.preventDefault()
						that.save()
						break
					case 'e':
						e.preventDefault()
						that.exportSRT()
						break
					case 'i':
						e.preventDefault()
						that.importSRT()
						break
					case 'h':
						e.preventDefault()
						that.triggerHelp()
						break
				}
			}, true)
		},
		addTimelineControl() {
			let that = this
			document.querySelector('#timeline').addEventListener('wheel', e => {
				e.preventDefault()
				if (e.ctrlKey) {
					that.timelineZoom(e.deltaY)
				} else {
					that.timelineScroll(e.deltaY)
				}
			})
		},
		getCookie() {
			let value = decodeURIComponent(
				document.cookie.split('; ')
					.find(row => row.startsWith(this.videoId))
					.split('=')[1]
			)
			let obj = JSON.parse(value)
			this.subtitles = obj.map(sub=>{
				return {
					startTime: sub.startTime,
					endTime: sub.endTime,
					text: sub.text,
					active: false
				}
			})
		},
		startPlayer() {
			let that = this
			video = document.querySelector('#iframe>iframe')
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
			this.updatePointer()
			this.updateCursor()
			this.setSubActive()
			this.autoScroll()
		},
		updatePointer() {
			let that = this
			window.addEventListener('mousemove', e => {
				that.mousePosition.x = e.x
				that.mousePosition.y = e.y
			}, true)
		},
		updateCursor() {
			try { this.cursor = this.getTime() }
			catch { return }
		},
		setSubActive() {
			// TODO : OPT ALGO
			this.subtitles.forEach(sub=>{
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
		getTime() {
			return Math.round(this.player.getCurrentTime()*100)/100
		},
		getHour(time) {
			return Math.round(time/3600).toString().padStart(2, '0')
		},
		getMin(time) {
			return Math.round(time%3600/60).toString().padStart(2, '0')
		},
		getSec(time) {
			return (Math.round(time%60*100)/100).toFixed(2).toString().padStart(5, '0')
		},
		active(sub, time) {
			return (time >= sub.startTime && time < sub.endTime)
		},
		// timeline utilities
		getPointerRatio() {
			let rect = document.querySelector('#timeline').getBoundingClientRect()
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
			let width = document.querySelector('#timeline').getBoundingClientRect().width
			let duration = sub.endTime - sub.startTime
			return width * duration / this.getTimelineLength()
		},
		seek(time) {
			this.player.seekTo(time, true)
		},
		isDragEnabled(sub) {
			return this.getSubWidth(sub) > 10
		},
		// timeline controls
		timelineClick() {
			this.seek(this.getPointerTime())
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
		addSubtitle() {
			if (![1, 2, 3].includes(this.state)) return
			if (this.subtitles.filter(x=>x.active).length) return
			let newSub = {
				startTime: Math.max(0, this.cursor - 1),
				endTime: this.cursor,
				text: '',
				active: false
			}
			for (let i = 0;; i++) {
				let thisSub = this.subtitles[i]
				if (!thisSub || thisSub.endTime > newSub.endTime) {
					let start = this.subtitles[i-1] ? this.subtitles[i-1].endTime : 0
					newSub.startTime = Math.max(start, newSub.startTime)
					if (newSub.endTime - newSub.startTime < 0.1) return
					this.subtitles.splice(i, 0, newSub)
					this.setInfoText('ADDED SUBTITLE')
					break
				}
			}
		},
		// saving controls
		save() {
			document.cookie = `${this.videoId}=${
				encodeURIComponent(JSON.stringify(this.subtitles.map(sub=>{
					return {
						startTime: sub.startTime,
						endTime: sub.endTime,
						text: sub.text
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
			let srt = this.subtitles.filter(sub => 
				sub.text.replace('\n', '').length
			).map((sub, i) =>
				`${i+1}
${getTimecode(sub.startTime)} --> ${getTimecode(sub.endTime)}
${sub.text.split('\n').filter(x=>x.length).join('\n')}\n\n`
			).join('')

			// Solution on https://gist.github.com/danallison/3ec9d5314788b337b682
			let blob = new Blob([srt], { type: 'text/plain' })
			var ele = document.querySelector('#export')
			ele.download = `Youtube_${this.videoId}.srt`
			ele.href = URL.createObjectURL(blob)
			ele.dataset.downloadurl = ['text/plain', ele.download, ele.href].join(':')
			ele.click()
			// setTimeout(function() { URL.revokeObjectURL(ele.href) }, 1500)
		},
		importSRT() {
			this.setInfoText('IMPORTING...')
			var ele = document.querySelector('#import')
			ele.click()
		},
		async getSRT() {
			var ele = document.querySelector('#import')
			if (!ele.files || !ele.files.length) return
			let srt = await ele.files[0].text()
			let subs = parseSRT(srt)
			this.subtitles = subs.map(sub => {
				return {
					startTime: sub.start,
					endTime: sub.end,
					text: sub.text,
					active: false
				}
			})
			ele.value = ''
			this.setInfoText('IMPORTED')
		},
		// other
		setInfoText(text) {
			let target = document.querySelector('#info-text')
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
		}
	},
	mounted: function() {
		this.fetchVideoId()
		this.getCookie()
		this.addKeyControl()
		this.addTimelineControl()
		window.onYouTubeIframeAPIReady = this.startPlayer
	}
})