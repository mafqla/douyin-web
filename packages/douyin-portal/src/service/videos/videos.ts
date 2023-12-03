import apiRequest from '../index'
import type { IDataType } from '../types'
import type {
  IFeedParams,
  IVideoList,
  IVideoListResult,
  IVideoParams
} from './videosType'

enum VideoApi {
  //获取分页视频列表
  getVideoList = '/video/feed',
  //获取视频滚动列表
  getVideoScrollList = '/video/getVideosByCursor',
  //获取视频评论列表
  getVideoCommentList = '/comment/list',
  //添加评论
  addVideoComment = '/comment/add',
  //热榜视频
  getHotVideoList = '/video/hotVideos',
  //我关注人的视频
  getMyFollowVideoList = '/video/myAttentionVideos',
  //我喜欢的视频
  getMyLikeVideoList = '/video/myLikeVideos',
  // 我的视频
  getMyVideoList = '/video/myVideos',
  //根据id获取视频
  getVideoById = '/video/getVideoInfoById',
  //视频上传
  uploadVideo = '/video/addVideo',
  //根据参数获取视频
  getVideoByParams = '/video/self'
}

/**
 * 跟据参数获取视频
 * @url /video/self
 */
export function getVideoByParams(params: IVideoParams) {
  return apiRequest.get<IDataType<IVideoListResult>>({
    url: VideoApi.getVideoByParams,
    params
  })
}

/**
 * 获取分页视频列表
 * @param IVideoList
 */
export function getVideoList(params: IFeedParams) {
  return apiRequest.post<IDataType<IVideoList[]>>({
    url: VideoApi.getVideoList,
    data: params
  })
}

//  获取视频滚动列表
export const getVideoScrollList = (cursor: number, size: number) => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getVideoScrollList,
    data: {
      cursor,
      size
    }
  })
}

// 获取视频评论列表
export const getVideoCommentList = (vid: number) => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getVideoCommentList,
    data: {
      vid
    }
  })
}

//添加评论
export const addVideoComment = (videoId: number, commentInfo: string) => {
  return apiRequest.post<IDataType>({
    url: VideoApi.addVideoComment,
    data: {
      videoId,
      commentInfo
    }
  })
}

//热榜视频

export const getHotVideoList = () => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getHotVideoList
  })
}

//我关注人的视频
export const getMyFollowVideoList = () => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getMyFollowVideoList
  })
}

//我喜欢的视频
export const getMyLikeVideoList = () => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getMyLikeVideoList
  })
}
// 我的视频
export const getMyVideoList = () => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getMyVideoList
  })
}

//根据id获取视频
export const getVideoById = (videoId: number) => {
  return apiRequest.post<IDataType>({
    url: VideoApi.getVideoById,
    data: {
      videoId
    }
  })
}

//视频上传
export const uploadVideo = (
  video: any,
  title: any,
  desciption: any,
  cover: any,
  status: any
) => {
  return apiRequest.post<IDataType>({
    url: VideoApi.uploadVideo,
    data: {
      video,
      title,
      desciption,
      cover,
      status
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
