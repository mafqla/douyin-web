import type { IAwemeInfo } from '../common/aweme'

export interface IVideoRecordRes {
  aweme_date: Record<string, number>
  aweme_list: IAwemeInfo[]
  has_more: number
  max_cursor: number
  status_code: number
  status_msg: string
}
