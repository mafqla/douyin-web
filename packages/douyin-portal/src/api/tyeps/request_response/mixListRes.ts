import type { IMixInfo } from '../common/mix'

export interface IMixListRes {
  cursor: string
  has_more: number
  min_cursor: string
  mix_infos: IMixInfo[]
  status_code: number
  status_msg: string
  total: number
}
