/**
 * @description 用户主页搜索请求参数
 */
export interface IUserHomeSearchParams {
  // 搜索频道，如 aweme_favorite_video（喜欢的视频）
  search_channel: string
  // 搜索来源，如 normal_search（普通搜索）
  search_source: string
  // 搜索场景，如 douyin_search（抖音搜索）
  search_scene: string
  // 排序类型，0 表示默认排序
  sort_type: number
  // 发布时间筛选，0 表示不限
  publish_time: number
  // 是否为筛选搜索，0 表示否
  is_filter_search: number
  // 查询校正类型
  query_correct_type: number
  // 搜索关键词
  keyword: string
  // 是否启用历史记录，1 表示启用
  enable_history: number
  // 搜索 ID（可选）
  search_id?: string
  // 分页偏移量
  offset: number
  // 每页数量
  count: number
  // 用户 ID
  from_user: string
}
