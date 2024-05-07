/**
 * @description: 点赞数量转换
 * @param {number} count
 * @return {*}
 */
export const useCount = (count: number) => {
  if (count < 10000) {
    return count % 1 === 0 ? count.toString() : count.toFixed(1)
  } else if (count < 100000000) {
    // 以万为单位处理
    const result = count / 10000
    return result % 1 === 0 ? result.toString() : result.toFixed(1) + '万'
  } else {
    // 以亿为单位处理
    const result = count / 100000000
    return result % 1 === 0 ? result.toString() : result.toFixed(1) + '亿'
  }
}
