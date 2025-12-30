import type { IAwemeInfo } from '../common/aweme'

export interface IhomeFeedRes {
  /**
   * @description 状态码
   */
  status_code: number
  /**
   * @description 状态信息
   */
  status_msg: string
  /**
   * @description 数据（旧版格式）
   */
  cards?: ICards[]
  /**
   * @description 视频列表（新版格式）
   */
  aweme_list?: IHomeFeedAweme[]
  /**
   * @description 是否还有更多
   */
  has_more: number
  /**
   * @description 最小游标
   */
  min_cursor?: number
  /**
   * @description 刷新清除标记
   */
  refresh_clear?: number
  /**
   * @description 首页模式
   */
  home_model?: number
  /**
   * @description 额外信息
   */
  extra?: {
    now: number
    logid: string | null
    fatal_item_ids: string[] | null
  }
  BaseResp?: {
    StatusMessage: string
    StatusCode: number
  }
}

export interface ICards {
  type: number
  aweme: IAwemeInfo
}

/**
 * @description 首页视频流中的视频信息
 */
export interface IHomeFeedAweme
  extends Omit<IAwemeInfo, 'statistics'> {
  /**
   * @description 视频统计数据
   */
  statistics: IHomeFeedStatistics
}

/**
 * @description 视频统计数据
 */
export interface IHomeFeedStatistics {
  /**
   * @description 评论数
   */
  comment_count: number
  /**
   * @description 点赞数
   */
  digg_count: number
  /**
   * @description 播放数
   */
  play_count: number
  /**
   * @description 收藏数
   */
  collect_count: number
  /**
   * @description 分享数
   */
  share_count: number
  /**
   * @description 下载数
   */
  download_count: number
  /**
   * @description 转发数
   */
  forward_count: number
  /**
   * @description 直播观看数
   */
  live_watch_count?: number
  /**
   * @description 推荐数
   */
  recommend_count?: number
  /**
   * @description 视频ID
   */
  aweme_id: string
  /**
   * @description 丢失评论数
   */
  lose_comment_count?: number
  /**
   * @description 丢失数
   */
  lose_count?: number
  /**
   * @description WhatsApp分享数
   */
  whatsapp_share_count?: number
  /**
   * @description 赞赏数
   */
  admire_count?: number | null
  /**
   * @description 互关好友点赞数
   */
  mutual_friend_digg_count?: number | null
  /**
   * @description 互关好友评论数
   */
  mutual_friend_comment_count?: number | null
  /**
   * @description 火焰发送数
   */
  flame_send_count?: number | null
  /**
   * @description 火焰金额简化字符串
   */
  flame_amount_simple_str?: string | null
  /**
   * @description 精选数
   */
  pick_count?: number | null
}
