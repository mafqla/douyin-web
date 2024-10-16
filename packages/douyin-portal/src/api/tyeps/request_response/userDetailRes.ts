import type { IUser } from '../common/user'

export interface IUserDetailRes {
  //状态码
  status_code: number
  //状态信息
  status_msg: string
  //返回数据
  user: IUser
  user_collect_count: {
    collect_count_list: collect_count_list[]
  }
}

interface collect_count_list {
  collect_count: number
  item_type: number
}
