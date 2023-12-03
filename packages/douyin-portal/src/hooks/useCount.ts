// 点赞数量转换

/**
 * @description: 点赞数量转换
 * @param {number} count
 * @return {*}
 */
export const useCount = (count: number) => {
  if (count < 10000) {
    return count
  } else if (count > 10000 && count < 100000000) {
    // 以万为单位处理
    return `${Math.floor(count / 10000)}万`
  } else {
    // 以亿为单位处理
    return `${Math.floor(count / 100000000)}亿`
  }
}
