import type { ApiDefinition, ApiCategory, ApiParam, ResponseField } from '@/types/api'
import { apiRegistry } from '@/data/api-registry'

/**
 * Postman Collection 格式
 */
interface PostmanCollection {
  info: {
    name: string
    schema: string
    description?: string
  }
  item: PostmanItem[]
  variable?: Array<{
    key: string
    value: string
    type?: string
  }>
}

interface PostmanItem {
  name: string
  item?: PostmanItem[]
  request?: {
    method: string
    header: Array<{ key: string; value: string }>
    url: {
      raw: string
      host: string[]
      path: string[]
      query?: Array<{ key: string; value: string; description?: string }>
    }
    body?: {
      mode: string
      raw?: string
      options?: {
        raw: {
          language: string
        }
      }
    }
    description?: string
  }
}

/**
 * OpenAPI 3.0 格式
 */
interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
  }
  servers: Array<{ url: string; description?: string }>
  paths: Record<string, Record<string, OpenAPIOperation>>
  components?: {
    schemas?: Record<string, unknown>
  }
}

interface OpenAPIOperation {
  summary: string
  description?: string
  operationId: string
  tags?: string[]
  parameters?: OpenAPIParameter[]
  requestBody?: {
    content: {
      'application/json': {
        schema: unknown
      }
    }
  }
  responses: Record<string, {
    description: string
    content?: {
      'application/json': {
        schema: unknown
      }
    }
  }>
  deprecated?: boolean
}

interface OpenAPIParameter {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  description?: string
  required?: boolean
  deprecated?: boolean
  schema: {
    type: string
    enum?: unknown[]
    default?: unknown
    minimum?: number
    maximum?: number
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  example?: unknown
}

/**
 * 导出为 Postman Collection 格式
 */
export function exportToPostman(
  apis: ApiDefinition[] | ApiCategory[],
  options: {
    name?: string
    baseUrl?: string
  } = {}
): PostmanCollection {
  const { name = '抖音 API 文档', baseUrl = 'https://www.douyin.com' } = options

  // 判断输入是 ApiDefinition[] 还是 ApiCategory[]
  const isCategories = apis.length > 0 && 'apis' in apis[0]

  const collection: PostmanCollection = {
    info: {
      name,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      description: '抖音 API 接口文档'
    },
    item: [],
    variable: [
      { key: 'baseUrl', value: baseUrl, type: 'string' }
    ]
  }

  if (isCategories) {
    // 按分类导出
    (apis as ApiCategory[]).forEach(category => {
      const folderItem: PostmanItem = {
        name: category.name,
        item: category.apis.map(api => convertApiToPostmanItem(api))
      }
      collection.item.push(folderItem)
    })
  } else {
    // 直接导出 API 列表
    collection.item = (apis as ApiDefinition[]).map(api => convertApiToPostmanItem(api))
  }

  return collection
}

function convertApiToPostmanItem(api: ApiDefinition): PostmanItem {
  const item: PostmanItem = {
    name: api.name,
    request: {
      method: api.method,
      header: [
        { key: 'Content-Type', value: 'application/json' }
      ],
      url: {
        raw: `{{baseUrl}}${api.url}`,
        host: ['{{baseUrl}}'],
        path: api.url.split('/').filter(Boolean)
      },
      description: api.description
    }
  }

  // 添加查询参数
  if (api.method === 'GET' && api.params.length > 0) {
    item.request!.url.query = api.params.map(param => ({
      key: param.name,
      value: param.example || '',
      description: param.description
    }))
  }

  // POST 请求添加 body
  if (api.method === 'POST' && api.params.length > 0) {
    const bodyObj: Record<string, unknown> = {}
    api.params.forEach(param => {
      bodyObj[param.name] = param.example || getDefaultValue(param.type)
    })
    item.request!.body = {
      mode: 'raw',
      raw: JSON.stringify(bodyObj, null, 2),
      options: {
        raw: { language: 'json' }
      }
    }
  }

  // 添加自定义请求头
  if (api.headers) {
    Object.entries(api.headers).forEach(([key, value]) => {
      item.request!.header.push({ key, value })
    })
  }

  return item
}

/**
 * 导出为 OpenAPI 3.0 格式
 */
export function exportToOpenAPI(
  apis: ApiDefinition[] | ApiCategory[],
  options: {
    title?: string
    version?: string
    baseUrl?: string
  } = {}
): OpenAPISpec {
  const {
    title = '抖音 API 文档',
    version = '1.0.0',
    baseUrl = 'https://www.douyin.com'
  } = options

  // 判断输入是 ApiDefinition[] 还是 ApiCategory[]
  const isCategories = apis.length > 0 && 'apis' in apis[0]

  const spec: OpenAPISpec = {
    openapi: '3.0.0',
    info: {
      title,
      version,
      description: '抖音 Web API 接口文档'
    },
    servers: [
      { url: baseUrl, description: '生产环境' }
    ],
    paths: {},
    components: {
      schemas: {}
    }
  }

  const allApis: ApiDefinition[] = isCategories
    ? (apis as ApiCategory[]).flatMap(c => c.apis)
    : (apis as ApiDefinition[])

  allApis.forEach(api => {
    const path = api.url
    const method = api.method.toLowerCase()

    if (!spec.paths[path]) {
      spec.paths[path] = {}
    }

    const operation: OpenAPIOperation = {
      summary: api.name,
      description: api.description,
      operationId: api.id,
      tags: api.tags,
      parameters: [],
      responses: {
        '200': {
          description: '成功',
          content: {
            'application/json': {
              schema: convertResponseFieldsToSchema(api.responseFields)
            }
          }
        }
      },
      deprecated: api.deprecated
    }

    // 添加参数
    if (api.method === 'GET') {
      operation.parameters = api.params.map(param => convertParamToOpenAPI(param))
    } else if (api.params.length > 0) {
      operation.requestBody = {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: api.params.reduce((acc, param) => {
                acc[param.name] = convertParamTypeToSchema(param)
                return acc
              }, {} as Record<string, unknown>),
              required: api.params.filter(p => p.required).map(p => p.name)
            }
          }
        }
      }
    }

    spec.paths[path][method] = operation
  })

  return spec
}

function convertParamToOpenAPI(param: ApiParam): OpenAPIParameter {
  // OpenAPI 不支持 body 位置，body 参数应该使用 requestBody
  const location = param.location === 'body' ? 'query' : (param.location || 'query')

  return {
    name: param.name,
    in: location,
    description: param.description,
    required: param.required,
    deprecated: param.deprecated,
    schema: {
      type: param.type === 'array' ? 'array' : param.type === 'object' ? 'object' : param.type,
      enum: param.enum?.map(e => e.value),
      default: param.defaultValue,
      minimum: param.minimum,
      maximum: param.maximum,
      minLength: param.minLength,
      maxLength: param.maxLength,
      pattern: param.pattern
    },
    example: param.example
  }
}

function convertParamTypeToSchema(param: ApiParam): unknown {
  const schema: Record<string, unknown> = {
    type: param.type === 'array' ? 'array' : param.type === 'object' ? 'object' : param.type,
    description: param.description
  }

  if (param.enum) {
    schema.enum = param.enum.map(e => e.value)
  }
  if (param.defaultValue !== undefined) {
    schema.default = param.defaultValue
  }
  if (param.example) {
    schema.example = param.example
  }

  return schema
}

function convertResponseFieldsToSchema(fields: ResponseField[]): unknown {
  const properties: Record<string, unknown> = {}

  fields.forEach(field => {
    const prop: Record<string, unknown> = {
      type: field.type === 'array' ? 'array' : field.type === 'object' ? 'object' : 'string',
      description: field.description
    }

    if (field.example !== undefined) {
      prop.example = field.example
    }

    if (field.nullable) {
      prop.nullable = true
    }

    if (field.children && field.children.length > 0) {
      if (field.type === 'array') {
        prop.items = convertResponseFieldsToSchema(field.children)
      } else {
        prop.properties = {}
        field.children.forEach(child => {
          (prop.properties as Record<string, unknown>)[child.name] =
            convertResponseFieldsToSchema([child])
        })
      }
    }

    properties[field.name] = prop
  })

  return {
    type: 'object',
    properties
  }
}

function getDefaultValue(type: string): unknown {
  switch (type) {
    case 'number': return 0
    case 'boolean': return false
    case 'array': return []
    case 'object': return {}
    default: return ''
  }
}

/**
 * 从 Postman Collection 导入
 */
export function importFromPostman(collection: PostmanCollection): ApiCategory[] {
  const categories: ApiCategory[] = []

  function processItems(items: PostmanItem[], categoryName: string = '导入的接口'): void {
    const apis: ApiDefinition[] = []

    items.forEach(item => {
      if (item.item && item.item.length > 0) {
        // 这是一个文件夹，递归处理
        processItems(item.item, item.name)
      } else if (item.request) {
        // 这是一个请求
        const api = convertPostmanItemToApi(item)
        apis.push(api)
      }
    })

    if (apis.length > 0) {
      categories.push({
        id: `imported-${Date.now()}-${categories.length}`,
        name: categoryName,
        apis
      })
    }
  }

  processItems(collection.item)
  return categories
}

function convertPostmanItemToApi(item: PostmanItem): ApiDefinition {
  const request = item.request!
  const url = request.url.path.join('/')

  const params: ApiParam[] = []

  // 从 query 参数中提取
  if (request.url.query) {
    request.url.query.forEach(q => {
      params.push({
        name: q.key,
        type: 'string',
        required: false,
        description: q.description || '',
        example: q.value
      })
    })
  }

  // 从 body 中提取
  if (request.body?.raw) {
    try {
      const body = JSON.parse(request.body.raw)
      Object.entries(body).forEach(([key, value]) => {
        params.push({
          name: key,
          type: typeof value === 'number' ? 'number' :
                typeof value === 'boolean' ? 'boolean' :
                Array.isArray(value) ? 'array' :
                typeof value === 'object' ? 'object' : 'string',
          required: false,
          description: '',
          example: String(value)
        })
      })
    } catch {
      // ignore parse error
    }
  }

  return {
    id: `imported-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: item.name,
    description: request.description || '',
    url: '/' + url,
    method: request.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    params,
    responseType: 'unknown',
    responseFields: []
  }
}

/**
 * 从 OpenAPI 导入
 */
export function importFromOpenAPI(spec: OpenAPISpec): ApiCategory[] {
  const apis: ApiDefinition[] = []

  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      const params: ApiParam[] = []

      // 从 parameters 提取
      if (operation.parameters) {
        operation.parameters.forEach(param => {
          params.push({
            name: param.name,
            type: param.schema.type as ApiParam['type'],
            required: param.required || false,
            description: param.description || '',
            example: param.example ? String(param.example) : undefined,
            enum: param.schema.enum?.map((v) => ({ label: String(v), value: v as string | number })),
            minimum: param.schema.minimum,
            maximum: param.schema.maximum,
            minLength: param.schema.minLength,
            maxLength: param.schema.maxLength,
            pattern: param.schema.pattern,
            deprecated: param.deprecated
          })
        })
      }

      // 从 requestBody 提取
      if (operation.requestBody?.content?.['application/json']?.schema) {
        const schema = operation.requestBody.content['application/json'].schema as {
          properties?: Record<string, { type?: string; description?: string; example?: unknown }>
          required?: string[]
        }
        if (schema.properties) {
          Object.entries(schema.properties).forEach(([name, prop]) => {
            params.push({
              name,
              type: (prop.type || 'string') as ApiParam['type'],
              required: schema.required?.includes(name) || false,
              description: prop.description || '',
              example: prop.example ? String(prop.example) : undefined
            })
          })
        }
      }

      apis.push({
        id: operation.operationId || `${method}-${path.replace(/\//g, '-')}`,
        name: operation.summary,
        description: operation.description || '',
        url: path,
        method: method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        params,
        responseType: 'unknown',
        responseFields: [],
        tags: operation.tags,
        deprecated: operation.deprecated
      })
    })
  })

  // 按 tags 分组
  const tagMap = new Map<string, ApiDefinition[]>()

  apis.forEach(api => {
    const tag = api.tags?.[0] || '未分类'
    if (!tagMap.has(tag)) {
      tagMap.set(tag, [])
    }
    tagMap.get(tag)!.push(api)
  })

  return Array.from(tagMap.entries()).map(([name, apis], index) => ({
    id: `imported-${Date.now()}-${index}`,
    name,
    apis
  }))
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, type: string = 'application/json') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 导出当前所有 API
 */
export function exportAllApis(format: 'postman' | 'openapi', baseUrl?: string) {
  if (format === 'postman') {
    const collection = exportToPostman(apiRegistry, { baseUrl })
    downloadFile(JSON.stringify(collection, null, 2), 'douyin-api-collection.json')
  } else {
    const spec = exportToOpenAPI(apiRegistry, { baseUrl })
    downloadFile(JSON.stringify(spec, null, 2), 'douyin-api-openapi.json')
  }
}

/**
 * 导出单个 API
 */
export function exportSingleApi(api: ApiDefinition, format: 'postman' | 'openapi', baseUrl?: string) {
  if (format === 'postman') {
    const collection = exportToPostman([api], { name: api.name, baseUrl })
    downloadFile(JSON.stringify(collection, null, 2), `${api.id}-collection.json`)
  } else {
    const spec = exportToOpenAPI([api], { title: api.name, baseUrl })
    downloadFile(JSON.stringify(spec, null, 2), `${api.id}-openapi.json`)
  }
}
