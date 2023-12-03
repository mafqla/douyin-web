import apiRequest from '../index'
import type { IDataType } from '../types'

enum Api {
  //分类列表
  categoriesList = '/categories/getCategoriesList',
  // 分类视频列表
  categoriesVideoList = '/video/getVideosByTag'
}

// 获取分类列表
export const getCategoriesList = () => {
  return apiRequest.get<IDataType>({
    url: Api.categoriesList
  })
}

// 获取分类视频列表
export const getCategoriesVideoList = (
  currentPage: any,
  pageSize: any,
  categoriesName?: any
) => {
  return apiRequest.post<IDataType>({
    url: Api.categoriesVideoList,
    data: {
      currentPage,
      pageSize,
      categoriesName
    }
  })
}
