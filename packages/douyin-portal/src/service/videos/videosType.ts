// export interface IVideoList {
//   page: number
//   size: number
//   status?: number
// }

export interface IVideoList {
  id: number
  title: string
  videosCover: string
  description: string
  videosTime: string
  videosAddress: string
  uploadTime: string
  playCount: 0
  likeCount: 0
  collectCount: 0
  dislikeCount: 0
  commentCount: 0
  status: 0

  isTop: boolean
  isAttention: number
  isLike: boolean
  isDislike: boolean
  isCollect: boolean
  userId: number
  userName: string
  userAvatar: string
}

export interface IVideoListResult {
  videosList: IVideoList[]
  publishCount: number
  likeCount: number
  collectCount: number
}

/**
 * 跟据参数获取视频
 * @param showTab
 * @param page
 * @param size
 * @param userId
 */
export interface IVideoParams {
  showTab: string
  page: number
  size: number
  userId?: number
}

/**
 * 获取分页视频列表
 * @param page
 * @param size
 *
 */
export interface IFeedParams {
  page: number
  size: number
}
