import request from './request'
import type { searchParams } from './tyeps/request_params/searchParams'
import type {
  SearchResponse,
  searchSuggestResponse
} from './tyeps/request_response/searchResponse'

import urls from './urls'

export default {
  /**
   * @description 搜索
   */
  search: (params: searchParams): Promise<SearchResponse> => {
    return request.get(urls.search, {
      params
    })
  },
  /**
   * @description 搜索关键词推荐
   */

  searchSuggest: (query: string): Promise<searchSuggestResponse> => {
    return request.get(urls.suggest_words, {
      params: {
        query: query,
        business_id: 30125,
        aid: 6383,
        app_name: 'douyin_web',
        pd: 'aweme_general',
        pc_client_type: 1
      }
    })
  }
}
