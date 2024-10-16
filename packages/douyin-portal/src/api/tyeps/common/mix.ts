import type { IShareInfo } from './aweme'
import type { IUser } from './user'

export interface IMixInfo {
  author: IUser
  create_time: number | string
  update_time: number | string
  desc: string
  cover_url: {
    height: number
    uri: string
    url_list: string[]
    width: number
  }
  share_info: IShareInfo
  statis: {
    collect_vv: number
    current_episode: number
    play_vv: number
    updated_to_episode: number
  }
  status: {
    is_collected: number
    status: number
  }

  mix_id: string
  mix_name: string
  mix_type: number
}
