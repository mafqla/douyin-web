import type { IAwemeInfo } from '../common/aweme'

export interface IRelatedVideoRes {
  aweme_list: IAwemeInfo[]
  has_more: boolean
  status_code: number
  filter_infos: string
  chime_video_list: string
}
