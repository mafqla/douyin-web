/**
 * @description 搜索请求参数
 */

/**
 * 过滤参数的接口。
 */
type FilterParams = {
  /**
   * 指定排序方式。
   * 0 - 综合排序
   * 1 - 最新发布
   * 3 - 最多点赞
   */
  sort_type?: 0 | 1 | 3

  /**
   * 指定发布时间的范围。
   * 0 - 不限
   * 1 - 一天内
   * 7 - 一周内
   * 180 - 半年内
   */
  public_time?: 0 | 1 | 7 | 180

  /**
   * 指定视频时长的筛选条件。
   * "" - 不限
   * "0-1" - 1分钟以下
   * "1-5" - 1-5分钟
   * "5-10000" - 5分钟以上
   */
  filter_duration?: '' | '0-1' | '1-5' | '5-10000'

  /**
   * 指定搜索范围。
   * "0" - 不限
   * "3" - 关注的人
   * "1" - 最近看过
   * "2" - 还未看过
   */
  search_range?: '0' | '3' | '1' | '2'

  /**
   * 指定内容类型。
   * "0" - 不限
   * "1" - 视频
   * "2" - 图文
   */
  content_type?: '0' | '1' | '2'
}

export type searchParams = {
  keyword: string
  offset: number
  count: number
  filter_selected?: FilterParams
  channel?: string
  search_channel?: string
  search_source?: string
  is_filter_search?: string
  need_filter_settings?: string
  query_correct_type?: string
}

export type searchSuggestionsParams = {
  query: string
  business_id?: number
  aid?: number
  app_name?: string
  pd?: string
  pc_client_type?: number
}
