import { Track } from '@api/track'

export type Sub = {
  _id?: string,
  startTime: number,
  endTime: number,
  text: string,
  next?: Sub | null,
  prev?: Sub | null,
}

export class Subtitles {
  data: Array<Sub>

  constructor(data?: Array<Sub>) {
    this.data = []
    if (data) this.insertMany(data)
  }

  insertMany(subs: Sub[]) {
    return subs.map(this.insert.bind(this))
  }

  insert(sub: Sub) {
    const { _id, startTime, endTime, text } = sub
    if (endTime === undefined) throw new TypeError('Invalid end time.')
    const newSub: Sub = { _id, startTime, endTime, text, next: null, prev: null }

    let prevSub: Sub | null = null
    let thisSub: Sub | null = this.data[0] || null
    let i = 0
    while (thisSub && thisSub.endTime <= newSub.endTime) {
      prevSub = thisSub
      thisSub = thisSub.next || null
      i++
    }

    if (thisSub) newSub.endTime = Math.min(newSub.endTime, thisSub.startTime)
    const start = prevSub ? prevSub.endTime : 0
    newSub.startTime = Math.max(start, newSub.startTime)
    if (newSub.endTime - newSub.startTime < 0.1) {
      // eslint-disable-next-line no-console
      console.error('Time segment too small.')
      return null
    }
    newSub.next = thisSub
    newSub.prev = prevSub
    if (prevSub) prevSub.next = newSub
    if (thisSub) thisSub.prev = newSub
    this.data.splice(i, 0, newSub)
    return newSub
  }

  delete(sub: Sub) {
    const i = this.data.findIndex(s => s._id === sub._id)
    if (i < 0) throw new Error('This sub does not exist on this Subtitles.')
    if (sub.next) sub.next.prev = sub.prev
    if (sub.prev) sub.prev.next = sub.next
    this.data.splice(i, 1)
  }

  setActive(time: number) {
    this.data.forEach((sub: any) => {
      sub.active = (time >= sub.start && time < sub.end)
    })
  }
}

export type SubTrack = Track & { _id: string, subs: Subtitles }
