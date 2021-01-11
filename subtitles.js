class Subtitles {
	constructor(data) {
		this.data = []
		if (data && !Array.isArray(data))
			throw TypeError('Subtitle Data must be an array.')
		if (data) data.forEach(this.insert.bind(this))
	}

	insert(sub) {
		if (!sub) throw Error('Inserting empty data.')
		let newSub = {
			start: sub.startTime || sub.start || sub.s,
			end:   sub.endTime   || sub.end   || sub.e,
			text:  sub.text      || sub.txt   || sub.t || '',
		}
		if (isNaN(newSub.start)) throw TypeError('Invalid start time.')
		if (isNaN(newSub.end)) throw TypeError('Invalid end time.')
		if (typeof newSub.text !== 'string') throw TypeError('Invalid text.')

		let prevSub = null
		let thisSub = this.data[0] || null
		let i = 0
		while (thisSub && thisSub.end <= newSub.end) {
			prevSub = thisSub
			thisSub = thisSub.next
			i++
		}

		if (thisSub) newSub.end = Math.min(newSub.end, thisSub.start)
		let start = prevSub ? prevSub.end : 0
		newSub.start = Math.max(start, newSub.start)
		if (newSub.end - newSub.start < 0.1)
			throw Error('Time segment too small.')

		newSub.next = thisSub
		newSub.prev = prevSub
		if (prevSub) prevSub.next = newSub
		if (thisSub) thisSub.prev = newSub
		this.data.splice(i, 0, newSub)
	}

	delete(sub) {
		let i = this.data.findIndex(s => s === sub)
		if (i < 0) throw Error('This sub does not exist on this Subtitles.')
		if (sub.next) sub.next.prev = sub.prev
		if (sub.prev) sub.prev.next = sub.next
		this.data.splice(i, 1)
	}
}