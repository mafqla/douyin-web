export default function formatTime(time: any): string {
  //2023-02-11T15:31:35.753Z
  const date = new Date(time)

  //转换为几秒前，几分钟前，几小时前，几天前，几月前，几年前
  const now = new Date().getTime()
  const diffValue = now - date.getTime()
  if (diffValue < 0) {
    return ''
  }
  const minuteC = diffValue / 1000 / 60
  const hourC = diffValue / 1000 / 3600
  const dayC = diffValue / 1000 / 3600 / 24
  const monthC = diffValue / 1000 / 3600 / 24 / 30
  const yearC = diffValue / 1000 / 3600 / 24 / 30 / 12

  // 返回刚刚，几秒前，几分钟前，几小时前，几天前，几月前，几年前
  if (yearC >= 1) {
    return `${Math.floor(yearC)}年前`
  } else if (monthC >= 1) {
    return `${Math.floor(monthC)}月前`
  } else if (dayC >= 1) {
    return `${Math.floor(dayC)}天前`
  } else if (hourC >= 1) {
    return `${Math.floor(hourC)}小时前`
  } else if (minuteC >= 1) {
    return `${Math.floor(minuteC)}分钟前`
  } else {
    return '刚刚'
  }
}
