/**
 * HTTP 请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 参数类型
 */
export type ParamType = 'string' | 'number' | 'boolean' | 'object' | 'array'

/**
 * 参数位置
 */
export type ParamLocation = 'query' | 'body' | 'path' | 'header'

/**
 * API 参数定义
 */
export interface ApiParam {
  /** 参数名称 */
  name: string
  /** 参数类型 */
  type: ParamType
  /** 是否必填 */
  required: boolean
  /** 参数描述 */
  description: string
  /** 默认值 */
  defaultValue?: unknown
  /** 示例值 */
  example?: string
  /** 枚举选项 */
  enum?: Array<{ label: string; value: string | number }>
  /** 参数位置 */
  location?: ParamLocation
  /** 备注信息 */
  remark?: string
  /** 最小值（number 类型） */
  minimum?: number
  /** 最大值（number 类型） */
  maximum?: number
  /** 最小长度（string 类型） */
  minLength?: number
  /** 最大长度（string 类型） */
  maxLength?: number
  /** 正则校验（string 类型） */
  pattern?: string
  /** 是否废弃 */
  deprecated?: boolean
}

/**
 * 响应字段定义
 */
export interface ResponseField {
  /** 字段名称 */
  name: string
  /** 字段类型 */
  type: string
  /** 字段描述 */
  description: string
  /** 嵌套子字段 */
  children?: ResponseField[]
  /** 示例值 */
  example?: unknown
  /** 是否可为空 */
  nullable?: boolean
  /** 备注信息 */
  remark?: string
  /** 是否废弃 */
  deprecated?: boolean
}

/**
 * 请求/响应示例
 */
export interface ApiExample {
  /** 示例名称 */
  name: string
  /** 示例描述 */
  description?: string
  /** 请求参数示例 */
  request?: Record<string, unknown>
  /** 响应数据示例 */
  response?: unknown
}

/**
 * API 定义
 */
export interface ApiDefinition {
  /** API 唯一标识 */
  id: string
  /** API 名称 */
  name: string
  /** API 描述 */
  description: string
  /** 请求 URL */
  url: string
  /** 请求方法 */
  method: HttpMethod
  /** 请求参数列表 */
  params: ApiParam[]
  /** 响应类型名称 */
  responseType: string
  /** 响应字段说明 */
  responseFields: ResponseField[]
  /** 请求/响应示例列表 */
  examples?: ApiExample[]
  /** 请求头 */
  headers?: Record<string, string>
  /** 备注说明 */
  remark?: string
  /** 是否废弃 */
  deprecated?: boolean
  /** 废弃说明 */
  deprecatedMessage?: string
  /** 权限要求 */
  auth?: 'none' | 'login' | 'admin'
  /** 标签 */
  tags?: string[]
}

/**
 * API 分类
 */
export interface ApiCategory {
  /** 分类唯一标识 */
  id: string
  /** 分类名称 */
  name: string
  /** 分类描述 */
  description?: string
  /** 分类图标 */
  icon?: string
  /** 分类下的 API 列表 */
  apis: ApiDefinition[]
}

/**
 * API 请求响应
 */
export interface ApiResponse {
  /** HTTP 状态码 */
  status: number
  /** 响应耗时（毫秒） */
  duration: number
  /** 响应数据 */
  data?: unknown
  /** 错误信息 */
  error?: string
  /** 响应头 */
  headers?: Record<string, string>
}

/**
 * 请求历史记录
 */
export interface RequestHistory {
  /** 记录 ID */
  id: string
  /** API ID */
  apiId: string
  /** 请求时间戳 */
  timestamp: number
  /** 请求参数 */
  params: Record<string, unknown>
  /** 响应结果 */
  response: ApiResponse
}
