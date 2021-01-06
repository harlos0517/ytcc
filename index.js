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
		mousePosition: {x: 0, y: 0}
	},
	methods: {
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
				}
			}, true)
		},
		addSubtitle() {
			if (![1, 2, 3].includes(this.state)) return
			if (this.subtitles.filter(x=>x.active).length) return
			let newSub = {
				startTime: Math.max(0, this.getTime() - 1),
				endTime: this.getTime(),
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
					break
				}
			}
		},
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
		seek(time) {
			this.player.seekTo(time, true)
		},
		active(sub, time) {
			return (time >= sub.startTime && time < sub.endTime)
		},
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
			let width = document.querySelector('#timeline').getBoundingClientRect().width
			let ratio = width / this.getTimelineLength()
			return 0 - this.timelineStart / this.getTimelineLength()
		},
		getMaxScale() {
			return this.videoLength / 2
		},
		isCursorInView() {
			return this.cursor > this.timelineStart && this.cursor < this.getTimelineEnd()
		},
		timelineClick(e) {
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
		timelineScrollFix() {
			this.timelineStart = Math.max(this.timelineStart, 0)
			this.timelineStart = Math.min(this.timelineStart, this.videoLength - this.getTimelineLength())
		}
	},
	mounted: function() {
		let that = this
		that.videoId = (new URL(document.location.href)).searchParams.get('v')
		if (!that.videoId || !that.videoId.length) that.videoId = 'Jt-5wQroOXA'
		that.videoIdInput = that.videoId
		that.addKeyControl()
		window.onYouTubeIframeAPIReady = function () {
			video = document.querySelector('#iframe>iframe')
			that.player = new YT.Player(video, {
				events: {
					'onReady': e => {
						that.videoLength = that.player.getDuration()
						console.log('READY')
					},
					'onStateChange': e => {
						console.log(`STATE: ${e.data}`)
						that.state = e.data
					}
				}
			})
			window.requestAnimationFrame(update)
		}
		function update() {
			window.requestAnimationFrame(update)
			let newCursor = 0
			try { newCursor = that.player.getCurrentTime() }
			catch { return }

			// TODO : OPT ALGO
			that.subtitles.forEach(sub=>{
				sub.active = that.active(sub, newCursor)
			})
			// Yeah fuck the algo, brutal works la

			that.cursor = newCursor

			// auto scroll
			if (that.state === 1) {
				let ratio = 0.8
				if (!that.isCursorInView())
					that.timelineStart = that.cursor - that.getTimelineLength() * (1 - ratio)
				else if (that.cursor > that.timelineStart + that.getTimelineLength() * ratio) {
					let timelineStart = that.cursor - that.getTimelineLength() * ratio
					if (that.timelineStart + that.getTimelineLength() < that.videoLength)
						that.timelineStart = timelineStart
				}
				that.timelineScrollFix()
			}
		}
		window.addEventListener('mousemove', e => {
			that.mousePosition.x = e.x
			that.mousePosition.y = e.y
		}, true)
		document.querySelector('#timeline').addEventListener('wheel', e => {
			e.preventDefault()
			if (e.ctrlKey) {
				that.timelineZoom(e.deltaY)
			} else {
				that.timelineScroll(e.deltaY)
			}
		})
	}
})