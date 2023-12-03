import { getCategoriesVideoList } from '@/service/discover/discover'
import { defineStore } from 'pinia'

export const discoverStore = defineStore('discover', {
  state: () => ({
    categoriesList: [],
    hotHeight: 0,
    listHeight: [] as number[]
  }),

  actions: {
    // 获取分类视频列表
    async getCategoriesList(
      currentPage: any,
      pageSize: any,
      categoriesName: any
    ) {
      const data = await getCategoriesVideoList(
        currentPage,
        pageSize,
        categoriesName
      )

      this.categoriesList = data.data
    }
  }
  // persist: {
  //   enabled: true
  // }
})
