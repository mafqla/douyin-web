import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

/**
 * 当前播放视频状态管理
 * 用于全局存储当前正在播放的视频信息
 */
export const useCurrentVideoStore = defineStore('currentVideo', () => {
  // 当前播放的视频信息
  const currentVideo = ref<IAwemeInfo | null>(null)

  /**
   * 设置当前播放的视频
   * @param video 视频信息
   */
  const setCurrentVideo = (video: IAwemeInfo | null) => {
    currentVideo.value = video
  }

  /**
   * 清除当前播放的视频
   */
  const clearCurrentVideo = () => {
    currentVideo.value = null
  }

  /**
   * 获取当前视频的aweme_id
   */
  const currentAwemeId = computed(() => currentVideo.value?.aweme_id || '')

  /**
   * 获取当前视频的group_id
   */
  const currentGroupId = computed(() => currentVideo.value?.group_id || '')

  // 当前场景类型：detail_inbox_rex(swiper播放器) 或 comment_top_rec(video页面)
  const currentScene = ref<'detail_inbox_rex' | 'comment_top_rec'>(
    'detail_inbox_rex'
  )

  /**
   * 设置当前场景
   */
  const setScene = (scene: 'detail_inbox_rex' | 'comment_top_rec') => {
    currentScene.value = scene
  }

  /**
   * 获取搜索框推荐词
   * swiper播放器使用 scene="detail_inbox_rex"
   * video页面使用 scene="comment_top_rec"
   */
  const searchSuggestWord = computed(() => {
    if (!currentVideo.value?.suggest_words?.suggest_words) {
      return null
    }
    const suggestItem = currentVideo.value.suggest_words.suggest_words.find(
      (item) => item.scene === currentScene.value
    )
    if (suggestItem && suggestItem.words && suggestItem.words.length > 0) {
      return {
        word: suggestItem.words[0].word,
        wordId: suggestItem.words[0].word_id,
        hintText: suggestItem.hint_text,
        iconUrl: suggestItem.icon_url
      }
    }
    return null
  })

  return {
    currentVideo,
    currentAwemeId,
    currentGroupId,
    currentScene,
    searchSuggestWord,
    setCurrentVideo,
    clearCurrentVideo,
    setScene
  }
})
