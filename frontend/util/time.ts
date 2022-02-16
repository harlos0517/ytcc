export const roundTime = (time: number) =>
  Math.round(time * 100) / 100

export const getTimeString = (
  time: number,
  showHour = true,
  showDecimal = true,
) => {
  const rounded = roundTime(time)
  const hour = Math.floor(rounded / 3600)
  const min = Math.floor(rounded % 3600 / 60)
  const sec = showDecimal
    ? Math.floor(rounded % 60 * 100) / 100
    : Math.floor(rounded % 60)
  const hourString = showHour ? hour.toString() + ':' : ''
  const minString = (
    showHour ? min.toString().padStart(2, '0') : min.toString()
  ) + ':'
  const secString = showDecimal
    ? sec.toFixed(2).toString().padStart(5, '0')
    : sec.toString().padStart(2, '0')
  return hourString + minString + secString
}
