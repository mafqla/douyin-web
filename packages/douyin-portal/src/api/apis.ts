import request from './request'
import type { IMixInfo } from './tyeps/common/mix'
import type {
  IFollowerParams,
  IFollowingParams
} from './tyeps/request_params/followParams'
import type { searchParams } from './tyeps/request_params/searchParams'
import type { IuserLikeParams } from './tyeps/request_params/userLikeParams'
import type { IuserPostParams } from './tyeps/request_params/userPostParams'
import type {
  ICommentListRes,
  ICommentReplyRes
} from './tyeps/request_response/commentListRes'
import type { FooterLinksRes } from './tyeps/request_response/footerLinksRes'
import type { IhomeFeedRes } from './tyeps/request_response/homeFeedRes'
import type { HotSearchRes } from './tyeps/request_response/hotSearchRes'
import type { ILiveRecordRes } from './tyeps/request_response/liveRecordRes'
import type { IrecommendFeedRes } from './tyeps/request_response/recommendFeed'
import type { IRelatedVideoRes } from './tyeps/request_response/relatedVideoRes'
import type {
  SearchResponse,
  searchSuggestResponse
} from './tyeps/request_response/searchResponse'
import type { IUserCollectVideo } from './tyeps/request_response/userCollectVideoRes'
import type { IUserDetailRes } from './tyeps/request_response/userDetailRes'
import type { IUserLikeRes } from './tyeps/request_response/userLikeRes'
import type { IUserPostRes } from './tyeps/request_response/userPostRes'
import type { IVideoDetailRes } from './tyeps/request_response/videoDetailRes'
import type { IVideoRecordRes } from './tyeps/request_response/videoRecordRes'
import type { IVsRecordRes } from './tyeps/request_response/vsRecord'

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
  getRecommendFeed: (
    count: number,
    refresh_index: number
  ): Promise<IrecommendFeedRes> => {
    return request.get(urls.recomend_feed, {
      params: {
        count,
        refresh_index
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
  getUserInfo: (): Promise<IUserDetailRes> => {
    return request.get(urls.user_info)
  },
  /**
   * @description 获取其他用户信息
   * @param {String} sec_user_id 用户id
   * @return {Promise<IUserDetailRes>} 用户信息
   */
  getUserOtherInfo: (sec_user_id: string): Promise<IUserDetailRes> => {
    return request.get(urls.user_other_info, {
      params: {
        sec_user_id
      }
    })
  },

  /**
   * @description 获取用户关注列表
   * @return {Promise<IUserPostRes>} 用户关注列表
   */
  getFollowingList: (params: IFollowingParams): Promise<IUserPostRes> => {
    return request.get(urls.user_follow, {
      params
    })
  },
  /**
   * @description 获取用户粉丝列表
   * @return {Promise<IUserPostRes>} 用户粉丝列表
   */
  getFollowerList: (params: IFollowerParams): Promise<IUserPostRes> => {
    return request.get(urls.user_follow, {
      params
    })
  },
  /**
   * @description 获取用户视频列表
   * @returns {Promise<IUserPostRes>} 用户视频列表
   */
  getUserPost: (params: IuserPostParams): Promise<IUserPostRes> => {
    return request.get(urls.user_post, {
      params
    })
  },
  /**
   * @description 获取用户点赞的视频列表
   * @return {Promise<IUserLikeRes>} 用户点赞的视频列表
   */
  getUserLike: (params: IuserLikeParams): Promise<IUserLikeRes> => {
    return request.get(urls.user_like, {
      params
    })
  },
  /**
   * @description 获取用户收藏的视频列表
   * @param {Number} count 数量
   * @param {String} cursor 分页游标
   * @return {Promise<IUserCollectVideo>} 用户收藏的视频列表
   */
  getUserCollectVideo: (
    count: number,
    cursor: string
  ): Promise<IUserCollectVideo> => {
    return request.get(urls.user_collect_video, {
      params: {
        count,
        cursor
      }
    })
  },
  /**
   * @description 获取用户合集列表
   * @param {String} sec_user_id 用户id
   * @param {Number} count 数量
   * @param {String} cursor 分页游标
   * @return {Promise<IMixInfo>} 用户合集列表
   */
  getUserMix: (
    sec_user_id: string,
    count: number,
    cursor: string
  ): Promise<IMixInfo> => {
    return request.get(urls.user_mix, {
      params: {
        sec_user_id,
        count,
        cursor
      }
    })
  },
  /**
   * @description 获取用户观看视频的记录
   * @param {Number} count 数量 20
   * @param {Number} max_cursor 分页游标
   * @return {Promise<IVideoRecordRes>} 用户观看视频的记录
   */
  getUserRecordVideo: (
    count: number,
    max_cursor: number
  ): Promise<IVideoRecordRes> => {
    return request.get(urls.user_record_video, {
      params: {
        count,
        max_cursor
      }
    })
  },
  /**
   * @description 获取用户观看影视综的记录
   * @param {Number} count 数量 20
   * @param {Number} cursor 分页游标
   * @return {Promise<IVsRecordRes>} 用户观看影视的记录
   */
  getUserRecordVs: (count: number, cursor: number): Promise<IVsRecordRes> => {
    return request.get(urls.user_record_vs, {
      params: {
        count,
        cursor
      }
    })
  },
  /**
   * @description 获取用户观看直播的记录
   * @param {String} max_time 时间戳
   * @return {Promise<ILiveRecordRes>} 用户观看直播的记录
   */
  getUserRecordLive: (max_time: number): Promise<ILiveRecordRes> => {
    return request.get(urls.user_record_live, {
      params: {
        max_time
      }
    })
  }
}
