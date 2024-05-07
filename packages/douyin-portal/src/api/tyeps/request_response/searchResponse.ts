import type { IAwemeInfo, SubCardList } from '../common/aweme'
import type { CardInfo } from '../common/card_info'

export type DataSearch = {
  /**
   * @description 视频类型
   * 1 - 视频
   * 996 - 包含侧边栏的视频
   * 997 - 无视频
   */
  type: number
  /**
   * @description 视频数据
   */
  aweme_info?: IAwemeInfo
  /**
   * @description 侧边栏列表
   */
  sub_card_list?: SubCardList[]
  /**
   * @description 卡片信息
   */
  card_info?: CardInfo
  /**
   * @description 卡片名
   * video - 视频
   * toutiao_web - 头条web
   * douyin_trending - 抖音热搜
   */
  card_unique_name?: string
}
/**
 * @description 搜索结果响应
 */

export type SearchResponse = {
  /**
   * @description 状态码
   */
  status_code: number
  data: DataSearch[]
  /**
   * @description 视频游标
   */
  cursor: number
  /**
   * @description 是否还有更多
   */
  has_more: boolean

  /**
   * @description url
   */
  path: string
}

export type searchSuggestResponse = {
  /**
   * @description 搜索建议
   */
  data: searchDataItem[]
  /**
   * @description 消息
   */
  msg: string
}

// 定义一个类型来表示额外信息的结构
interface ExtraInfo {
  mark: string
  rel_info: string // 相关性信息，具体结构未给出，这里用字符串表示
  rm_score: number
  roughsort_order: number
  recall_position: any // 召回位置，具体结构未给出，这里用any表示
  predict_utility_score: number
  ranking_rule_score: number
  ecom_ctr_score: number
  ctr_score: string
  predict_ecpm_score: number
  sar_pv_rate: number
  click_count: number
  predict_ctr_score: number
  ctr_bar: string
  sar_pv: number
  impr_count: number
  rel_score: string
  trend_sar_pv: number
  mm_query: string // 匹配查询，具体结构未给出，这里用字符串表示
  ecpm_boost_tag: boolean
  predict_cold_boost: number
  predict_order: number
  recall_triggers: any // 召回触发器，具体结构未给出，这里用any表示
  search_result_score: number
  ecom_cvr_score: number
  recall_score: any // 召回得分，具体结构未给出，这里用any表示
  ecom_gmv_score: number
  ecom_clkbuy_score: number
  ranking_labels: any // 排名标签，具体结构未给出，这里用any表示
  ctr_comment_top: string
  reason: string
  relevance_score: number
}

// 定义一个类型来表示单词的结构
export interface Word {
  id: string
  params: {
    extra_info: ExtraInfo
    from_gid: string
    reason: string
  }
  word: string
  words_type: string
}

// 定义一个类型来表示数据项的结构
interface searchDataItem {
  params: {
    extra_info: any // 额外信息，具体结构未给出，这里用any表示
    src_comment_id: string
    src_group_id: string
  }
  source: string
  type: string
  words: Word[]
}
