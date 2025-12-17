import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

// 侧边栏 tab 类型
export type SidebarTabType = 'folder' | 'works' | 'comment' | 'collection' | 'related'

/**
 * 侧边栏状态管理
 * 用于管理 video-sidebar 的额外状态，如收藏夹播放列表
 */
export const useSidebarStore = defineStore('sidebar', () => {
  // 当前播放的收藏夹信息（用于显示收藏夹 tab）
  const currentFolder = ref<ICollectsItem | null>(null)

  // 当前活动的 tab
  const activeTab = ref<SidebarTabType>('comment')

  // 各 tab 的视频列表
  const folderVideoList = shallowRef<IAwemeInfo[]>([])
  const worksVideoList = shallowRef<IAwemeInfo[]>([])
  const relatedVideoList = shallowRef<IAwemeInfo[]>([])

  // 当前活动 tab 的视频列表
  const currentVideoList = computed(() => {
    switch (activeTab.value) {
      case 'folder':
        return folderVideoList.value
      case 'works':
        return worksVideoList.value
      case 'related':
        return relatedVideoList.value
      default:
        return []
    }
  })

  // 设置当前收藏夹（同时切换到 folder tab）
  const setFolder = (folder: ICollectsItem | null) => {
    currentFolder.value = folder
    if (folder) {
      activeTab.value = 'folder'
    }
  }

  // 清除收藏夹信息
  const clearFolder = () => {
    currentFolder.value = null
  }

  // 设置活动 tab
  const setActiveTab = (tab: SidebarTabType) => {
    activeTab.value = tab
  }

  // 设置各 tab 的视频列表
  const setFolderVideoList = (list: IAwemeInfo[]) => {
    folderVideoList.value = list
  }

  const setWorksVideoList = (list: IAwemeInfo[]) => {
    worksVideoList.value = list
  }

  const setRelatedVideoList = (list: IAwemeInfo[]) => {
    relatedVideoList.value = list
  }

  // 清除所有视频列表
  const clearVideoLists = () => {
    folderVideoList.value = []
    worksVideoList.value = []
    relatedVideoList.value = []
  }

  return {
    currentFolder,
    activeTab,
    folderVideoList,
    worksVideoList,
    relatedVideoList,
    currentVideoList,
    setFolder,
    clearFolder,
    setActiveTab,
    setFolderVideoList,
    setWorksVideoList,
    setRelatedVideoList,
    clearVideoLists
  }
})
