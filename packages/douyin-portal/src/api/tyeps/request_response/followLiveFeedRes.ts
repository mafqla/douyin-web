/**
 * @description 关注直播列表响应
 */
export interface IFollowLiveFeedRes {
  data: {
    data: IFollowLiveItem[]
  }
}

/**
 * @description 关注直播项
 */
export interface IFollowLiveItem {
  room: ILiveRoom
  tag_name?: string
  uniq_id?: string
  web_rid: string
  is_recommend?: number
  title_type?: number
  cover_type?: number
}

/**
 * @description 直播间信息
 */
export interface ILiveRoom {
  id_str: string
  status: number
  status_str: string
  title: string
  user_count_str: string
  cover: ILiveCover
  stream_url?: ILiveStreamUrl
  owner: ILiveOwner
  stats?: ILiveStats
}

/**
 * @description 直播封面
 */
export interface ILiveCover {
  url_list: string[]
}

/**
 * @description 直播流地址
 */
export interface ILiveStreamUrl {
  flv_pull_url?: Record<string, string>
  hls_pull_url?: string
  hls_pull_url_map?: Record<string, string>
  default_resolution?: string
  stream_orientation?: number
}

/**
 * @description 直播间主播信息
 */
export interface ILiveOwner {
  id_str: string
  sec_uid: string
  nickname: string
  avatar_thumb: ILiveCover
  follow_info?: {
    follow_status: number
    follow_status_str: string
  }
}

/**
 * @description 直播间统计
 */
export interface ILiveStats {
  total_user_desp?: string
  like_count?: number
  total_user_str?: string
  user_count_str?: string
}
