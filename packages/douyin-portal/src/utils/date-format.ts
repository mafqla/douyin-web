export default function formatTime(time: string | number): string {
  //2023-02-11T15:31:35.753Z | 1713259792
  //转换为时间戳
  if (typeof time === 'number') {
    if (time < 1e12) {
      time = time * 1000
    } else {
      time = time
    }
  }
  const date = new Date(time)

  //转换为几秒前，几分钟前，几小时前，几天前，几月前，几年前
  const now = new Date().getTime()
  const diffValue = now - date.getTime()
  if (diffValue < 0) {
    return ''
  }
  const seconds = diffValue / 1000
  const units = [
    { unit: '年', factor: 3600 * 24 * 30 * 12 },
    { unit: '月', factor: 3600 * 24 * 30 },
    { unit: '周', factor: 3600 * 24 * 7 },
    { unit: '天', factor: 3600 * 24 },
    { unit: '小时', factor: 3600 },
    { unit: '分钟', factor: 60 },
    { unit: '刚刚', factor: 1 }
  ]

  if (seconds / (3600 * 24 * 30 * 12) >= 1) {
    return `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
  for (const unitData of units) {
    const unitValue = seconds / unitData.factor
    if (unitValue >= 1) {
      return unitData.unit === '刚刚'
        ? unitData.unit
        : `${Math.floor(unitValue)}${unitData.unit}前`
    }
  }

  return '刚刚'
}

/**
 * 将秒数转换为时分秒格式字符串
 *
 * @param time 毫秒数
 * @returns 返回形如 "HH:mm:ss" 的字符串，不足两位的分钟和秒数前面会补零
 */
const formatMillisecondsToTime = (time: number) => {
  // 将毫秒转换为秒
  const totalSeconds = time / 1000
  // 计算小时、分钟和秒
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  // 构建时间字符串，如果小时数不为0，则包含小时，否则只包含分钟和秒
  const timeString =
    hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`

  return timeString
}

/**
 * @description 格式化时间 将时间戳转换为 2023-02-11 15:31:35 格式
 * @param {string | number} time 时间戳
 */
const formatTimeToYMDHMS = (time: string | number): string => {
  //2023-02-11T15:31:35.753Z | 1713259792
  //转换为时间戳
  if (typeof time === 'number') {
    if (time < 1e12) {
      time = time * 1000
    } else {
      time = time
    }
  }
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
export { formatMillisecondsToTime, formatTimeToYMDHMS }
