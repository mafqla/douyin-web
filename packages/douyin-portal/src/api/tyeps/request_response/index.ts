export * from './followFeedRes'

/**
 * @description 基础响应结构
 */
export type BaseResponse<T = unknown> = {
  /**
   * @description 状态码
   */
  code: number
  /**
   * @description 消息
   */
  msg: string
  /**
   * @description 数据
   */
  data: T
  /**
   * @description 请求id
   */
  requestId: string
}
