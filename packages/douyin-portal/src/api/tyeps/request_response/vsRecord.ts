export interface IVsRecordRes {
  has_more: boolean
  extra: IExtra
  log_pb: ILogPb
  status_code: number
  status_msg: string
  lvideo_history_list: ILVideoHistoryItem[]
  cursor: number
}

export interface IExtra {
  fatal_item_ids: string[]
  logid: string
  now: number
}

export interface ILogPb {
  impr_id: string
}

export interface ILVideoHistoryItem {
  title_before: string
  has_update: boolean
  label: number
  album_type: number
  episode_look_at: string
  seq: number
  title: string
  expired_time: number
  pay_info: {
    pay_status: boolean
    pay_type: number
  }
  episode_item_id: string
  episode_type: number
  msec: number
  scheme_url: string
  updated_episode: string
  album_item_id: string
  label_v2: number
  progress: number
  purchase_status: number
  title_after: string
  play_time: number
  album_id: string
  episode_id: string
  cover_url: string
}

