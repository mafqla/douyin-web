/**
 * IM关系列表（分享好友列表）请求参数
 * 接口: /aweme/v1/web/im/spotlight/relation/
 */
export interface IImRelationParams {
  /** 数量 默认50 */
  count?: number
  /** 最大时间戳（毫秒） */
  max_time?: number
  /** 最小时间戳（毫秒） */
  min_time?: number
}
