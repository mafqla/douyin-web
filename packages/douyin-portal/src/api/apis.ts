import request from './request'
import type { searchParams } from './tyeps/request_params/searchParams'
import type { IuserPostParams } from './tyeps/request_params/userPostParams'
import type {
  ICommentListRes,
  ICommentReplyRes
} from './tyeps/request_response/commentListRes'
import type { IhomeFeedRes } from './tyeps/request_response/homeFeedRes'
import type { IRelatedVideoRes } from './tyeps/request_response/relatedVideoRes'
import type {
  SearchResponse,
  searchSuggestResponse
} from './tyeps/request_response/searchResponse'
import type { IUserPostRes } from './tyeps/request_response/userPostRes'
import type { IVideoDetailRes } from './tyeps/request_response/videoDetailRes'

import urls from './urls'

export default {
  /**
   * @description 获取首页视频流
   */
  homeFeed: (count: number): Promise<IhomeFeedRes> => {
    return request.get(urls.home_feed, {
      params: {
        count
      }
    })
  },
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
  },

  /**
   * @description 获取视频详细信息
   */
  getVideoDetail: (aweme_id: number): Promise<IVideoDetailRes> => {
    return request.get(urls.video_detail, {
      params: {
        aweme_id
      }
    })
  },
  /**
   * @description 获取视频相关推荐
   */
  getVideoRelated: (aweme_id: number): Promise<IRelatedVideoRes> => {
    return request.get(urls.related_video, {
      params: {
        aweme_id
      }
    })
  },
  /**
   * @description 获取用户视频
   */
  getUserPost: (params: IuserPostParams): Promise<IUserPostRes> => {
    return request.get(urls.user_post, {
      params
    })
  },

  /**
   * @description 获取评论列表
   */
  getCommentList: (
    aweme_id: number,
    cursor: number,
    count: number
  ): Promise<ICommentListRes> => {
    return request.get(urls.comment_list, {
      params: {
        aweme_id,
        cursor,
        count
      }
    })
  },
  /**
   * @description 获取评论回复
   */
  getCommentReply: (
    item_id: number,
    comment_id: number,
    cursor: number,
    count: number
  ): Promise<ICommentReplyRes> => {
    return request.get(urls.comnet_reply, {
      params: {
        item_id,
        comment_id,
        cursor,
        count
      }
    })
  }
}
