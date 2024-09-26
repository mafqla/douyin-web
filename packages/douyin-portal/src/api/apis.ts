import request from './request'
import type { searchParams } from './tyeps/request_params/searchParams'
import type { IuserPostParams } from './tyeps/request_params/userPostParams'
import type {
  ICommentListRes,
  ICommentReplyRes
} from './tyeps/request_response/commentListRes'
import type { FooterLinksRes } from './tyeps/request_response/footerLinksRes'
import type { IhomeFeedRes } from './tyeps/request_response/homeFeedRes'
import type { HotSearchRes } from './tyeps/request_response/hotSearchRes'
import type { IrecommendFeedRes } from './tyeps/request_response/recommendFeed'
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
   * @description 获取推荐页视频
   */
  getRecommendFeed: (count: number): Promise<IrecommendFeedRes> => {
    return request.get(urls.recomend_feed, {
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

  searchSuggest: (
    query?: string,
    from_group_id?: string
  ): Promise<searchSuggestResponse> => {
    return request.get(urls.suggest_words, {
      params: {
        query,
        from_group_id
      }
    })
  },

  /**
   * @description 获取视频详细信息
   */
  getVideoDetail: (aweme_id: string): Promise<IVideoDetailRes> => {
    return request.get(urls.video_detail, {
      params: {
        aweme_id
      }
    })
  },
  /**
   * @description 获取视频相关推荐
   */
  getVideoRelated: (
    aweme_id: string,
    count: string,
    filterGids: string,
    refresh_index: string
  ): Promise<IRelatedVideoRes> => {
    return request.get(urls.video_related, {
      params: {
        aweme_id,
        count,
        filterGids,
        refresh_index
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
    aweme_id: string,
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
   * @param {Number} item_id  视频id
   * @param {Number} comment_id  评论id
   * @param {Number} cursor 分页游标
   * @param {Number} count 每页数量
   * @returns {Promise<ICommentReplyRes>} 评论回复
   */
  getCommentReply: (
    item_id: string,
    comment_id: string,
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
  },
  /**
   * @description 底部栏热门链接
   */

  getFooterLinks: (): Promise<FooterLinksRes> => {
    return request.get(urls.footer_link)
  },

  /**
   *@description 获取热搜
   */
  getHotSearch: (): Promise<HotSearchRes> => {
    return request.get(urls.hot_search)
  },

  /**
   * @description 获取用户信息
   */
  getUserInfo: (): Promise<IVideoDetailRes> => {
    return request.get(urls.user_info)
  }
}
