/**
 * 搜索建议接口响应类型定义
 * URL: /aweme/v1/web/search/sug/
 * 请求参数: keyword
 */

/** 高亮位置信息 */
export interface IHighlightPos {
  /** 高亮开始位置 */
  begin: number
  /** 高亮结束位置 */
  end: number
}

/** 词条记录信息 */
export interface IWordRecord {
  /** 分组ID */
  group_id: string
  /** 词条位置 */
  words_position: number
  /** 词条内容 */
  words_content: string
  /** 词条来源 */
  words_source: string
}

/** 标签图标信息 */
export interface ITagIconInfo {
  /** 图标高度 */
  height: number
  /** 图标URI */
  uri: string
  /** 图标URL列表 */
  url_list: string[]
  /** 图标宽度 */
  width: number
}

/** 豁免规则信息 */
export interface IExemptions {
  /** 重要过滤规则 */
  importent_filter?: string
  /** 关键词过滤规则 */
  keywords_filter?: string
  /** NLP分类过滤规则 */
  nlp_category_filter?: string
  /** NLP过滤规则 */
  nlp_filter?: string
  /** 模式匹配过滤规则 */
  pattern_match_filter?: string
  /** 重写规则 */
  rewrite?: string
  /** 白名单过滤规则 */
  whitelist_filter?: string
}

/** 召回位置信息 */
export interface IRecallPosition {
  [key: string]: number
}

/** 召回分数信息 */
export interface IRecallScore {
  [key: string]: string
}

/** 排名标签信息 */
export interface IRankingLabels {
  [key: string]: string[]
}

/** 搜索建议项的额外信息 */
export interface ISugExtraInfo {
  /** CTR分数 */
  ctr_score: string
  /** 深度思考标记 */
  deep_think: number
  /** 电商CTR */
  ecom_ctr: number
  /** 电商CVR */
  ecom_cvr: number
  /** 电商GMV */
  ecom_gmv: number
  /** 电商相关商品数量 */
  ecom_rel_product_count: number
  /** 电商相关商品分数 */
  ecom_rel_product_score: number
  /** ECPM分数 */
  ecpm_score: number
  /** 豁免规则 */
  exemptions?: IExemptions
  /** 图标描述（如"热"） */
  icon_desc?: string
  /** 播放完成率 */
  play_finish_rate: number
  /** POI ID */
  poi_id: string
  /** POI位置召回日志ID */
  poi_location_recall_log_id: string
  /** POI用户行为召回日志ID */
  poi_ua_recall_log_id: string
  /** 预测CTR分数 */
  predict_ctr_score: number
  /** 预测排序 */
  predict_order: number
  /** 预测效用分数 */
  predict_utility_score: number
  /** 搜索推荐信息（JSON字符串） */
  qrec_for_search: string
  /** 查询评估标签 */
  query_assessment_tag?: string
  /** 排名标签 */
  ranking_labels: IRankingLabels
  /** 排名规则分数 */
  ranking_rule_score: number
  /** 召回原因 */
  reason: string
  /** 召回位置 */
  recall_position: IRecallPosition
  /** 召回分数 */
  recall_score: IRecallScore
  /** 相关性分数 */
  relevance_score: number
  /** 结果点击率 */
  res_click_rate: number
  /** 粗排序位置 */
  roughsort_order: number
  /** 粗排序分数 */
  roughsort_score: number
  /** 搜索参数（JSON字符串） */
  search_params: string
  /** 槽位效用分数 */
  slot_utility_scores: unknown[]
  /** 特殊类型（如"douyin_hot"） */
  special_type?: string
  /** 源查询 */
  sq: string
  /** 源查询是否为前缀 */
  src_query_is_prefix: number
  /** 建议进入类型 */
  sug_enter_type: string
  /** 建议标签图标信息 */
  sug_tag_icon_info?: ITagIconInfo
  /** 标签图标 */
  tag_icon?: ITagIconInfo
  /** 标签类型 */
  tag_type?: string
  /** 是否有用的查询 */
  is_useful_query?: string
}

/** 搜索建议项 */
export interface ISugItem {
  /** 高亮位置数组 */
  pos: IHighlightPos[]
  /** 建议内容 */
  content: string
  /** 建议类型 */
  sug_type: string
  /** 词条记录 */
  word_record: IWordRecord
  /** 额外信息 */
  extra_info: ISugExtraInfo
}

/** 词条查询记录 */
export interface IWordsQueryRecord {
  /** 信息（JSON字符串） */
  info: string
  /** 词条来源 */
  words_source: string
  /** 查询ID */
  query_id: string
}

/** 额外信息 */
export interface ISearchSugExtra {
  /** 当前时间戳 */
  now: number
  /** 日志ID */
  logid: string
  /** 致命项ID列表 */
  fatal_item_ids: unknown[]
  /** 搜索请求ID */
  search_request_id: string
}

/** 日志信息 */
export interface ILogPb {
  /** 曝光ID */
  impr_id: string
}

/** 缓存配置 */
export interface ICacheConf {
  /** 是否启用缓存 */
  enable: boolean
}

/** 搜索建议接口响应 */
export interface ISearchSugRes {
  /** 搜索建议列表 */
  sug_list: ISugItem[]
  /** 虚拟建议列表 */
  sug_virtual_list: unknown | null
  /** 状态码 */
  status_code: number
  /** 状态消息 */
  status_msg: string
  /** 请求ID */
  rid: string
  /** 词条查询记录 */
  words_query_record: IWordsQueryRecord
  /** 额外信息 */
  extra: ISearchSugExtra
  /** 日志信息 */
  log_pb: ILogPb
  /** 时间消耗 */
  time_cost: Record<string, unknown>
  /** 词条列表 */
  words_lists: unknown[]
  /** 缓存配置 */
  cache_conf: ICacheConf
}
