import { getVideoCommentList } from '@/service/videos/videos'
import { defineStore } from 'pinia'

export const commentStore = defineStore('comment', {
  state: () => ({
    comments: []
  }),
  actions: {
    // 获取视频评论列表
    async getVideoCommentList(vid: number) {
      const data = await getVideoCommentList(vid)
      // console.log(data.data)
      this.comments = data.data
      return {
        code: Number(data.code),
        msg: data.msg,
        list: data.data
      }
    }
  }
})
