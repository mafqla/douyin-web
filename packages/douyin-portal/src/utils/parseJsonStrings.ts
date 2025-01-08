/**
 * @description: 解析 JSON 字符串，处理大整数问题
 * @param {Object} obj 待解析对象
 * @returns 解析后的对象
 */
export function parseJsonStrings(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === 'string') {
        try {
          // 尝试解析 JSON 字符串
          const parsed = JSON.parse(value)
          // 检查是否为数字并且超出了安全整数范围
          if (typeof parsed === 'number' && parsed >= Number.MAX_SAFE_INTEGER) {
            // 如果超出范围，则转换为字符串以保留精度
            obj[key] = value
          } else {
            // 否则，更新对象的值
            obj[key] = parsed
          }
          // 递归解析嵌套的 JSON 字符串
          parseJsonStrings(obj[key])
        } catch (error) {
          // 如果解析失败，则保留原始值
          // console.warn(`JSON.parse error: ${error}`);
          obj[key] = value
        }
      } else if (typeof value === 'object' && value !== null) {
        // 如果值是对象，则递归解析
        parseJsonStrings(value)
      }
    }
  }
}
