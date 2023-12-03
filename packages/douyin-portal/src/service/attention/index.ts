import apiRequest from '..'
import type { IDataType } from '../types'

enum AttentionApi {
  //关注或取消关注

  attention = '/attention/attention'
}

/**
 * @description: 关注或取消关注
 */
export function attention(attentionId: number) {
  return apiRequest.post<IDataType>({
    url: AttentionApi.attention,
    data: {
      attentionId
    }
  })
}
