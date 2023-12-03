import apiRequest from '..'
import type { IDataType } from '../types'
import type { ICollectionsParams } from './type'
enum CollectionApi {
  //收藏
  collection = '/collect/addOrCancel'
}

/**
 * @description: 收藏获取取消收藏
 * @param {number} video_id 收藏的视频id
 * @param {number} user_id 用户id 可选
 */

export function collection(params: ICollectionsParams) {
  return apiRequest.post<IDataType>({
    url: CollectionApi.collection,
    data: params
  })
}
