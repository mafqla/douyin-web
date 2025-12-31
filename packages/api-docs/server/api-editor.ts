/**
 * Vite 插件：开发模式下提供 API 编辑功能
 * 仅在开发模式下生效，允许修改 api-registry.ts 文件
 */
import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

interface ApiEditRequest {
  apiId: string
  field: 'params' | 'responseFields' | 'examples' | 'all'
  data: unknown
}

// 响应示例存储目录
const EXAMPLE_RESPONSES_DIR = path.resolve(__dirname, '../src/data/example-responses')

interface ApiAddRequest {
  categoryId: string
  api: {
    id: string
    name: string
    description: string
    url: string
    method: string
    params: unknown[]
    responseType: string
    responseFields: unknown[]
  }
}

interface ApiDeleteRequest {
  apiId: string
}

// 查找 API 在文件中的位置并更新
function updateApiInRegistry(
  content: string,
  apiId: string,
  field: string,
  newData: unknown
): string {
  // 查找 API 定义的开始位置
  const apiPattern = new RegExp(`(\\{[\\s\\S]*?id:\\s*['"\`]${apiId}['"\`])`, 'g')
  const match = apiPattern.exec(content)

  if (!match) {
    throw new Error(`API with id "${apiId}" not found`)
  }

  // 从匹配位置向后查找完整的对象
  let startIndex = match.index
  let braceCount = 0
  let endIndex = startIndex
  let inString = false
  let stringChar = ''

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i]
    const prevChar = i > 0 ? content[i - 1] : ''

    // 处理字符串
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
      }
    }

    if (!inString) {
      if (char === '{') braceCount++
      if (char === '}') {
        braceCount--
        if (braceCount === 0) {
          endIndex = i + 1
          break
        }
      }
    }
  }

  const apiObject = content.slice(startIndex, endIndex)

  // 根据字段类型更新
  let updatedApi: string

  if (field === 'all') {
    // 替换整个 API 对象
    updatedApi = formatApiObject(newData)
  } else {
    // 查找并替换特定字段
    const fieldPattern = new RegExp(`(${field}:\\s*)\\[[\\s\\S]*?\\]`, 'g')
    const fieldMatch = fieldPattern.exec(apiObject)

    if (fieldMatch) {
      const newFieldValue = formatValue(newData, 2)
      updatedApi = apiObject.replace(fieldPattern, `$1${newFieldValue}`)
    } else {
      // 字段不存在，在对象末尾添加
      const insertPos = apiObject.lastIndexOf('}')
      const newFieldValue = formatValue(newData, 2)
      updatedApi = apiObject.slice(0, insertPos) +
        `,\n    ${field}: ${newFieldValue}\n  ` +
        apiObject.slice(insertPos)
    }
  }

  return content.slice(0, startIndex) + updatedApi + content.slice(endIndex)
}

// 格式化值为 TypeScript 代码
function formatValue(value: unknown, indent: number = 0): string {
  const spaces = '  '.repeat(indent)
  const innerSpaces = '  '.repeat(indent + 1)

  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map(item => `${innerSpaces}${formatValue(item, indent + 1)}`).join(',\n')
    return `[\n${items}\n${spaces}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return '{}'
    const items = entries.map(([key, val]) => {
      const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`
      return `${innerSpaces}${formattedKey}: ${formatValue(val, indent + 1)}`
    }).join(',\n')
    return `{\n${items}\n${spaces}}`
  }

  return String(value)
}

// 格式化完整的 API 对象
function formatApiObject(api: unknown): string {
  return formatValue(api, 1)
}

// 在指定分类中添加新 API
function addApiToCategory(content: string, categoryId: string, api: unknown): string {
  // 查找分类
  const categoryPattern = new RegExp(`(\\{[\\s\\S]*?id:\\s*['"\`]${categoryId}['"\`][\\s\\S]*?apis:\\s*\\[)`, 'g')
  const match = categoryPattern.exec(content)

  if (!match) {
    throw new Error(`Category with id "${categoryId}" not found`)
  }

  // 在 apis 数组开头添加新 API
  const insertPos = match.index + match[0].length
  const formattedApi = formatValue(api, 2)

  // 检查数组是否为空
  const afterMatch = content.slice(insertPos).trimStart()
  if (afterMatch.startsWith(']')) {
    // 空数组
    return content.slice(0, insertPos) + '\n      ' + formattedApi + '\n    ' + content.slice(insertPos)
  } else {
    // 非空数组，在开头添加
    return content.slice(0, insertPos) + '\n      ' + formattedApi + ',' + content.slice(insertPos)
  }
}

// 从文件中删除指定 API
function deleteApiFromRegistry(content: string, apiId: string): string {
  // 查找 API 定义的开始位置
  const apiPattern = new RegExp(`(\\{[\\s\\S]*?id:\\s*['"\`]${apiId}['"\`])`, 'g')
  const match = apiPattern.exec(content)

  if (!match) {
    throw new Error(`API with id "${apiId}" not found`)
  }

  // 从匹配位置向后查找完整的对象
  let startIndex = match.index
  let braceCount = 0
  let endIndex = startIndex
  let inString = false
  let stringChar = ''

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i]
    const prevChar = i > 0 ? content[i - 1] : ''

    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
      }
    }

    if (!inString) {
      if (char === '{') braceCount++
      if (char === '}') {
        braceCount--
        if (braceCount === 0) {
          endIndex = i + 1
          break
        }
      }
    }
  }

  // 处理逗号和空白
  let deleteStart = startIndex
  let deleteEnd = endIndex

  // 向前查找空白和换行
  while (deleteStart > 0 && /\s/.test(content[deleteStart - 1])) {
    deleteStart--
  }

  // 向后查找逗号和空白
  while (deleteEnd < content.length && /[\s,]/.test(content[deleteEnd])) {
    if (content[deleteEnd] === ',') {
      deleteEnd++
      break
    }
    deleteEnd++
  }

  return content.slice(0, deleteStart) + content.slice(deleteEnd)
}

// 保存响应示例到 JSON 文件
function saveExampleResponse(apiId: string, data: unknown): void {
  // 确保目录存在
  if (!fs.existsSync(EXAMPLE_RESPONSES_DIR)) {
    fs.mkdirSync(EXAMPLE_RESPONSES_DIR, { recursive: true })
  }

  const filePath = path.join(EXAMPLE_RESPONSES_DIR, `${apiId}.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// 读取响应示例
function loadExampleResponse(apiId: string): unknown | null {
  const filePath = path.join(EXAMPLE_RESPONSES_DIR, `${apiId}.json`)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  }
  return null
}

export function apiEditorPlugin(): Plugin {
  return {
    name: 'api-editor',
    apply: 'serve', // 仅在开发模式下生效

    configureServer(server) {
      // 直接添加中间件，只处理 /__api-editor 开头的请求
      server.middlewares.use((req, res, next) => {
        // 只处理 /__api-editor 开头的请求，其他请求跳过
        if (!req.url?.startsWith('/__api-editor')) {
          next()
          return
        }

        if (req.url === '/__api-editor/save' && req.method === 'POST') {
          let body = ''

          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const { apiId, field, data } = JSON.parse(body) as ApiEditRequest

              // 响应示例保存到独立的 JSON 文件
              if (field === 'examples') {
                saveExampleResponse(apiId, data)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Example saved successfully' }))
                return
              }

              // 其他字段更新 api-registry.ts 文件
              const registryPath = path.resolve(__dirname, '../src/data/api-registry.ts')
              let content = fs.readFileSync(registryPath, 'utf-8')

              // 更新内容
              content = updateApiInRegistry(content, apiId, field, data)

              // 写回文件
              fs.writeFileSync(registryPath, content, 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'API updated successfully' }))
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              }))
            }
          })

          return
        }

        if (req.url === '/__api-editor/status' && req.method === 'GET') {
          // 返回编辑器状态（开发模式可用）
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            enabled: true,
            mode: 'development',
            message: '编辑功能已启用（仅开发模式）'
          }))
          return
        }

        // 获取响应示例
        if (req.url?.startsWith('/__api-editor/example/') && req.method === 'GET') {
          const apiId = req.url.replace('/__api-editor/example/', '')
          const example = loadExampleResponse(apiId)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, data: example }))
          return
        }

        // 新增 API
        if (req.url === '/__api-editor/add' && req.method === 'POST') {
          let body = ''

          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const { categoryId, api } = JSON.parse(body) as ApiAddRequest

              const registryPath = path.resolve(__dirname, '../src/data/api-registry.ts')
              let content = fs.readFileSync(registryPath, 'utf-8')

              content = addApiToCategory(content, categoryId, api)

              fs.writeFileSync(registryPath, content, 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'API added successfully' }))
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              }))
            }
          })

          return
        }

        // 删除 API
        if (req.url === '/__api-editor/delete' && req.method === 'POST') {
          let body = ''

          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const { apiId } = JSON.parse(body) as ApiDeleteRequest

              const registryPath = path.resolve(__dirname, '../src/data/api-registry.ts')
              let content = fs.readFileSync(registryPath, 'utf-8')

              content = deleteApiFromRegistry(content, apiId)

              fs.writeFileSync(registryPath, content, 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'API deleted successfully' }))
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              }))
            }
          })

          return
        }

        next()
      })
    }
  }
}
