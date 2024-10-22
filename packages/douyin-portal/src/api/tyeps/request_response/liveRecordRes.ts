import type { IUser } from '../common/user'

export interface ILiveRecordRes {
  data: ILiveRecordItem[]
  extra: IExtra
  status_code: number
}

interface IAvatar {
  url_list: string[]
  uri: string
  height: number
  width: number
  avg_color: string
  image_type: number
  open_web_url: string
  is_animated: boolean
  flex_setting_list: any[]
  text_setting_list: any[]
}

interface IUserLiveRecord {
  user_id: number
  right_text: string
  under_name_text: string
  avatar: IAvatar
  nickname: string
  sec_uid: string
  scheduled_text: string
  videos: any[]
  announcement_content: string
  follow_status: number
  user_id_str: string
  secret: number
  req_follow: number
  open_id: string
  open_id_str: string
}

export interface ILiveRecordItem {
  type: number
  rid: string
  tags: string[]
  ad: string
  is_recommend_card: boolean
  tabs: any[]
  is_pseudo_living: boolean
  live_reason: string
  UserLiveRecord: IUserLiveRecord
  open_data_room: string
  placeholder: {
    msg: string
    type: number
  }
  live_status: number
  user_info: IUser
  is_live_explore: boolean
  is_ad: boolean
  skylight_biz_flag: number
  content_category: number
  live_recommend_info: string
  live_source: string
  latest_watch_time: number
  latest_watch_time_str: string
  camera_type: number
  item_pitaya_param: string
  user_id: number
  item_log_pb: string
  user_open_id: string
}

interface IExtra {
  aggregate_column_name: string
  banner: {
    banners: any[]
    banners_type: number
    switch_type: number
    title: string
    total: number
  }
  cost: number
  direct_sort: boolean
  follow_session_id: number
  forbid_interpose: boolean
  has_more: boolean
  is_backup: number
  log_pb: {
    impr_id: string
  }
  max_time: number
  max_time_str: string
  min_time: number
  now: number
  offset: number
  offset_type: number
  preview_card_area_title: string
  preview_card_content_category: number
  sati_param_for_pitaya: string
  search_offset: number
  style: number
  total: number
  unread_extra: string
  user_extra_info: string
}
