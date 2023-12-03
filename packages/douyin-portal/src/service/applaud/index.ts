import apiRequest from '..'
import type { IDataType } from '../types'

enum ApplaudApi {
  applaud = '/applaud/toggleApplaud'
}

/**
 * @description: 点赞或取消点赞
 * @param {number} applaudId 点赞的视频id
 */

export function applaud(applaudId: number) {
  return apiRequest.post<IDataType>({
    url: ApplaudApi.applaud,
    data: {
      applaudId
    }
  })
}
