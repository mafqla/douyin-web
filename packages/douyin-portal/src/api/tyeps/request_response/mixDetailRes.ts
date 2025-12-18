import type { IUser } from '../common/user'

export interface IMixDetailCoverUrl {
  height: number
  uri: string
  url_list: string[]
  width: number
}

export interface IMixDetailShareInfo {
  share_desc: string
  share_desc_info: string
  share_title: string
  share_title_myself: string
  share_title_other: string
  share_url: string
  share_weibo_desc: string
}

export interface IMixDetailStatis {
  collect_vv: number
  current_episode: number
  last_read_episode: number
  play_vv: number
  updated_to_episode: number
}

export interface IMixDetailStatus {
  is_collected: number
  status: number
}

export interface IMixDetailInfo {
  author: IUser
  cover_url: IMixDetailCoverUrl
  create_time: number
  desc: string
  extra: string
  ids: null
  is_iaa: number
  is_serial_mix: number
  mix_id: string
  mix_name: string
  mix_pic_type: number
  mix_type: number
  paid_episodes: null
  share_info: IMixDetailShareInfo
  statis: IMixDetailStatis
  status: IMixDetailStatus
  update_time: number
  watched_item: string
}

export interface IMixDetailRes {
  status_code: number
  status_msg: string
  mix_info: IMixDetailInfo
}
