import { Sub } from '@/util/subtitle'
import { roundTime } from '@/util/time'

export { parseSRT } from '@/util/parse-srt'

const getTimecode = (time: number) => {
  const rounded = roundTime(time)
  const hh = Math.floor(rounded / 3600).toString().padStart(2, '0')
  const mm = Math.floor(rounded % 3600 / 60).toString().padStart(2, '0')
  const ss = Math.floor(rounded % 60).toString().padStart(2, '0')
  const ms = Math.floor(rounded * 1000 % 1000).toString().padStart(3, '0')
  return `${hh}:${mm}:${ss},${ms}`
}

export const exportSRT = (subs: Sub[]) => {
  const srt = subs.filter(sub =>
    sub.text.replace('\n', '').length,
  ).map((sub, i) =>
    `${i + 1}
${getTimecode(sub.startTime)} --> ${getTimecode(sub.endTime)}
${sub.text.split('\n').filter(x => x.length).join('\n')}\n\n`,
  ).join('')
  return srt
}
