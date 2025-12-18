import type { IImageResource } from '../common/user'

// 关注列表二级信息结构
export interface IFollowingListSecondaryInfo {
  secondary_information_priority: number
  secondary_information_text: string
  secondary_information_text_type: number
}

// 访客用户信息
export interface IVisitedUser {
  uid: string
  sec_uid: string
  short_id: string
  unique_id: string
  nickname: string
  signature: string
  avatar_thumb: IImageResource
  avatar_medium: IImageResource
  avatar_larger: IImageResource
  avatar_168x168: IImageResource
  avatar_300x300: IImageResource
  follow_status: number
  follower_status: number
  is_block: boolean
  is_gov_media_vip: boolean
  room_id: number
  room_id_str: string
  room_data?: string
  secret: number
  enterprise_verify_reason: string
  account_cert_info: string
  user_permissions: any | null
  visit_time: number
  not_seen_item_id_list_v2: string[] | null
  following_list_secondary_information_struct?: IFollowingListSecondaryInfo
  red_point?: boolean
}

// 额外信息
export interface IVisitedListExtra {
  fatal_item_ids: any[]
  logid: string
  now: number
}

// 日志信息
export interface IVisitedListLogPb {
  impr_id: string
}

// 用户访客列表响应
export interface IUserVisitedListRes {
  status_code: number
  has_more: boolean
  next_cursor: string
  freq_visit_user_list: IVisitedUser[]
  visit_user_list: IVisitedUser[]
  extra: IVisitedListExtra
  log_pb: IVisitedListLogPb
}
