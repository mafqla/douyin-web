import type { IAwemeInfo } from '../common/aweme'

/**
 * @description 搜索结果项
 */
export interface IUserHomeSearchItem {
  // 视频信息
  item: IAwemeInfo
  // 类型，1 表示视频
  type: number
}

/**
 * @description 用户主页搜索响应
 */
export interface IUserHomeSearchRes {
  // 视频列表
  aweme_list: IUserHomeSearchItem[]
  // 分页游标
  cursor: number
  // 额外信息
  extra: IUserHomeSearchExtra
  // 全局涂鸦配置（空结果提示等）
  global_doodle_config: IGlobalDoodleConfig
  // 是否有更多数据，0 表示没有，1 表示有
  has_more: number
  // 日志参数
  log_pb: ILogPb
  // 模拟召回路径
  mock_recall_path: string
  // 请求路径
  path: string
  // 搜索空结果信息
  search_nil_info?: ISearchNilInfo
  // 状态码，0 表示成功
  status_code: number
}

/**
 * @description 额外信息
 */
export interface IUserHomeSearchExtra {
  // 致命项 ID 列表
  fatal_item_ids: string[]
  // 日志 ID
  logid: string
  // 当前时间戳
  now: number
  // 场景信息
  scenes: null | string
  // 搜索请求 ID
  search_request_id: string
}

/**
 * @description 全局涂鸦配置
 */
export interface IGlobalDoodleConfig {
  // 空结果提示文案
  home_text: string
  // 是否跳转通用搜索，1 表示是
  jump_general: number
  // 搜索关键词
  keyword: string
}

/**
 * @description 日志参数
 */
export interface ILogPb {
  // 曝光 ID
  impr_id: string
}

/**
 * @description 搜索空结果信息
 */
export interface ISearchNilInfo {
  // 是否为加载更多，first_flush 表示首次加载
  is_load_more: string
  // 空结果项类型
  search_nil_item: string
  // 空结果类型
  search_nil_type: string
  // 文本类型
  text_type: number
}
