import type { IVideoList, IVideoParams } from './../service/videos/videosType'
import {
  getMyFollowVideoList,
  getMyLikeVideoList,
  getMyVideoList,
  getVideoById,
  getVideoByParams,
  getVideoScrollList
} from '@/service/videos/videos'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'

interface IEmpty {
  post: boolean
  like: boolean
  collect: boolean
  record: boolean
}

interface VideoStoreState {
  videos: Array<any> // Define the type for your video data
  translateY: number
  userPostVideos: Array<IVideoList> // Define the type for user videos
  userLikeVideos: Array<IVideoList> // Define the type for user videos
  userCollectVideos: Array<IVideoList> // Define the type for user videos
  userRecordVideos: Array<IVideoList> // Define the type for user videos
  loading: boolean // Define the type for loading
  bottomLoading: boolean // Define the type for bottomLoading
  isEmpty: IEmpty
  postCount: number
  likeCount: number
  collectCount: number
}

export const videoStore = defineStore('videos', {
  //获取视频列表
  state: (): VideoStoreState => ({
    videos: [],
    translateY: 0,
    userPostVideos: [],
    userLikeVideos: [],
    userCollectVideos: [],
    userRecordVideos: [],
    loading: true,
    bottomLoading: true,
    isEmpty: {
      post: false,
      like: false,
      collect: false,
      record: false
    },

    postCount: 0,
    likeCount: 0,
    collectCount: 0
  }),
  actions: {
    // 根据参数获取视频
    async getVideoDataByParams(params: IVideoParams) {
      try {
        const res = await getVideoByParams(params)
        const userVideos = res.data

        this.isEmpty = {
          post: params.showTab === 'post' && res.code === '404',
          like: params.showTab === 'like' && res.code === '404',
          collect:
            params.showTab === 'favorite_collection' && res.code === '404',
          record: params.showTab === 'record' && res.code === '404'
        }

        this.loading = false
        this.postCount = userVideos.publishCount
        this.likeCount = userVideos.likeCount
        this.collectCount = userVideos.collectCount

        this.bottomLoading = false

        return userVideos.videosList
      } catch (error) {
        console.log(error)
        // ElMessage({
        //   message: error as string,
        //   type: 'error'
        // })
      }
    },
    async getVideos(cursor: number, size: number) {
      const data = await getVideoScrollList(cursor, size)
      // 返回状态码和消息
      this.videos = data.data
      return {
        code: Number(data.code),
        msg: data.msg,
        list: data.data
      }
    },

    //我关注人的视频
    async getMyFollowVideoListI() {
      const data = await getMyFollowVideoList()
      this.videos = data.data
    },
    //我喜欢的视频
    async getMyLikeVideoList() {
      const data = await getMyLikeVideoList()
      return data.data
    },
    // 我的视频
    async getMyVideoList() {
      const data = await getMyVideoList()
      return data.data
    },
    //根据id获取视频
    async getVideoById(videoId: number) {
      const data = await getVideoById(videoId)
      return data.data
    }
  }
})
