import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import type { IMixDetailInfo } from '@/api/tyeps/request_response/mixDetailRes'
import type { IMixInfo } from '@/api/tyeps/common/mix'

// 侧边栏 tab 类型
export type SidebarTabType =
  | 'folder'
  | 'works'
  | 'comment'
  | 'collection'
  | 'related'

/**
 * 侧边栏状态管理
 * 用于管理 video-sidebar 的额外状态，如收藏夹播放列表
 */
export const useSidebarStore = defineStore('sidebar', () => {
  // 当前播放的收藏夹信息（用于显示收藏夹 tab）
  const currentFolder = ref<ICollectsItem | null>(null)

  // 当前播放的合集信息（用于显示合集 tab）
  const currentMix = ref<IMixDetailInfo | null>(null)

  // 用户合集列表（用于判断是否显示合集 tab）
  const userMixList = shallowRef<IMixInfo[]>([])

  // 当前活动的 tab
  const activeTab = ref<SidebarTabType>('comment')

  // 各 tab 的视频列表
  const folderVideoList = shallowRef<IAwemeInfo[]>([])
  const worksVideoList = shallowRef<IAwemeInfo[]>([])
  const relatedVideoList = shallowRef<IAwemeInfo[]>([])
  const collectionVideoList = shallowRef<IAwemeInfo[]>([])

  // 视频切换历史记录栈（用于向上切换返回）
  const videoHistoryStack = shallowRef<IAwemeInfo[]>([])

  // 未看视频 id 列表（用于显示未看角标）
  const notSeenItemIds = ref<Set<string>>(new Set())

  // 当前用户的认证类型（用于显示认证徽章）
  const currentUserVerificationType = ref<number | undefined>(undefined)
  // 当前用户的 sec_uid（用于判断是否是同一个用户）
  const currentUserSecUid = ref<string | undefined>(undefined)

  // 当前活动 tab 的视频列表
  const currentVideoList = computed(() => {
    switch (activeTab.value) {
      case 'folder':
        return folderVideoList.value
      case 'works':
        return worksVideoList.value
      case 'related':
        return relatedVideoList.value
      case 'collection':
        return collectionVideoList.value
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

  // 设置当前合集（同时切换到 collection tab）
  const setMix = (mix: IMixDetailInfo | null) => {
    currentMix.value = mix
    if (mix) {
      activeTab.value = 'collection'
    }
  }

  // 清除合集信息
  const clearMix = () => {
    currentMix.value = null
  }

  // 设置用户合集列表
  const setUserMixList = (list: IMixInfo[]) => {
    userMixList.value = list
  }

  // 清除用户合集列表
  const clearUserMixList = () => {
    userMixList.value = []
  }

  // 是否有用户合集
  const hasUserMix = computed(() => userMixList.value.length > 0)

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

  const setCollectionVideoList = (list: IAwemeInfo[]) => {
    collectionVideoList.value = list
  }

  // 清除所有视频列表
  const clearVideoLists = () => {
    folderVideoList.value = []
    worksVideoList.value = []
    relatedVideoList.value = []
    collectionVideoList.value = []
  }

  // 视频历史记录操作
  const pushVideoHistory = (video: IAwemeInfo) => {
    videoHistoryStack.value = [...videoHistoryStack.value, video]
  }

  const popVideoHistory = (): IAwemeInfo | undefined => {
    const newStack = [...videoHistoryStack.value]
    const video = newStack.pop()
    videoHistoryStack.value = newStack
    return video
  }

  const clearVideoHistory = () => {
    videoHistoryStack.value = []
  }

  const canGoPrevVideo = computed(() => videoHistoryStack.value.length > 0)

  // 设置未看视频 id 列表
  const setNotSeenItemIds = (ids: string[]) => {
    notSeenItemIds.value = new Set(ids)
  }

  // 清除未看视频 id 列表
  const clearNotSeenItemIds = () => {
    notSeenItemIds.value = new Set()
  }

  // 检查视频是否未看
  const isNotSeen = (awemeId: string) => {
    return notSeenItemIds.value.has(awemeId)
  }

  // 设置当前用户的认证类型
  const setCurrentUserVerificationType = (
    type: number | undefined,
    secUid?: string
  ) => {
    currentUserVerificationType.value = type
    currentUserSecUid.value = secUid
  }

  // 清除当前用户的认证类型
  const clearCurrentUserVerificationType = () => {
    currentUserVerificationType.value = undefined
    currentUserSecUid.value = undefined
  }

  return {
    currentFolder,
    currentMix,
    userMixList,
    hasUserMix,
    activeTab,
    folderVideoList,
    worksVideoList,
    relatedVideoList,
    collectionVideoList,
    currentVideoList,
    notSeenItemIds,
    videoHistoryStack,
    canGoPrevVideo,
    setFolder,
    clearFolder,
    setMix,
    clearMix,
    setUserMixList,
    clearUserMixList,
    setActiveTab,
    setFolderVideoList,
    setWorksVideoList,
    setRelatedVideoList,
    setCollectionVideoList,
    clearVideoLists,
    pushVideoHistory,
    popVideoHistory,
    clearVideoHistory,
    setNotSeenItemIds,
    clearNotSeenItemIds,
    isNotSeen,
    currentUserVerificationType,
    currentUserSecUid,
    setCurrentUserVerificationType,
    clearCurrentUserVerificationType
  }
})
