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
