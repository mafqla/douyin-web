/**
 * @description:解析 JSON 字符串
 * @param {Object} obj 待解析对象
 * @returns 解析后的对象
 */
export function parseJsonStrings(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === 'string') {
        try {
          obj[key] = JSON.parse(value)
          // 递归解析嵌套的 JSON 字符串
          parseJsonStrings(obj[key])
        } catch (error) {
          // 如果解析失败，则保留原始值
          // console.warn(`JSON.parse error: ${error}`)
          // 解析失败，则保留原始值
          obj[key] = value
        }
      } else if (typeof value === 'object' && value !== null) {
        // 如果值是对象，则递归解析
        parseJsonStrings(value)
      }
    }
  }
}
