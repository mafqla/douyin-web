import apiRequest from '../index'
import type { IDataType } from '../types'
import type {
  IAddUserRequest,
} from './types'

/**
 * 增加新用户
 * @param name
 *
 */
export function addUser(name: string) {
  return apiRequest.post<IDataType<IAddUserRequest>>({
    url: '/adduser',
    // body请求参数
    data: {
      name
    }
  })
}
