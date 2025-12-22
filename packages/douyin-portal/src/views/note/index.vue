<script setup lang="ts">
import apis from '@/api/apis'
import { Loading } from '@/components/common'
import ImageGalleryPlayer from '@/components/video-player/ImageGalleryPlyer.vue'
import VideoAction from '@/components/video-components/video-action/video-action.vue'
import SwiperControl from '@/components/swiper/swiper-control.vue'
import { useCurrentVideoStore } from '@/stores/current-video'
import { useSidebarStore } from '@/stores/sidebar'
import { useRoute, useRouter } from 'vue-router'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { useCount } from '@/hooks'
import { formatTimeToYMDHMS } from '@/utils/date-format'
import { getAwemeLink } from '@/utils/aweme-link'
import SidebarRelatedVideo from '@/components/video-components/video-sidebar/sidebar-related-video.vue'
import VideoComment from '@/components/video-components/video-comment/video-comment.vue'

const currentVideoStore = useCurrentVideoStore()
const sidebarStore = useSidebarStore()
const router = useRouter()

const route = useRoute()
const awemeId = route.params.id as string

const loading = ref(true)
const noteDetail = ref<IAwemeInfo>()
provide('videoDetail', noteDetail)

// 当前激活的tab
const activeTab = ref<'related' | 'comment'>('related')

const getNoteDetail = async (awemeId: string) => {
  try {
    const res = await apis.getVideoDetail(awemeId)
    noteDetail.value = res.aweme_detail
    currentVideoStore.setScene('comment_top_rec')
    currentVideoStore.setCurrentVideo(res.aweme_detail)
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getNoteDetail(awemeId)
})

// 图集列表
const imgGallery = computed(() => {
  return noteDetail.value?.images || []
})

// 音乐URL
const musicUrl = computed(() => {
  return noteDetail.value?.music?.play_url?.url_list ?? []
})

// 粉丝数
const followers = computed(() => {
  return useCount(noteDetail.value?.author?.follower_count || 0)
})

// 获赞数
const likes = computed(() => {
  return useCount(noteDetail.value?.author?.total_favorited || 0)
})

// 发布时间
const publishTime = computed(() => {
  if (!noteDetail.value?.create_time) return ''
  return formatTimeToYMDHMS(noteDetail.value.create_time)
})

// 是否关注
const isFollow = computed(() => {
  return Boolean(noteDetail.value?.author?.follow_status)
})

// 切换到评论tab
const handleToggleComments = () => {
  activeTab.value = 'comment'
}

// 上下切换逻辑
const relatedList = computed(() => sidebarStore.relatedVideoList)

const currentIndex = computed(() => {
  if (!noteDetail.value || relatedList.value.length === 0) return -1
  return relatedList.value.findIndex(
    (item) => item.aweme_id === noteDetail.value?.aweme_id
  )
})

const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => {
  return (
    currentIndex.value >= 0 && currentIndex.value < relatedList.value.length - 1
  )
})

const handlePrev = () => {
  if (!canGoPrev.value) return
  const prevItem = relatedList.value[currentIndex.value - 1]
  if (prevItem) {
    router.push(getAwemeLink(prevItem))
  }
}

const handleNext = () => {
  if (!canGoNext.value) return
  const nextItem = relatedList.value[currentIndex.value + 1]
  if (nextItem) {
    router.push(getAwemeLink(nextItem))
  }
}

const metaTitle = computed(() => {
  return noteDetail.value?.desc
    ? `${noteDetail.value?.desc} - 抖音`
    : window.location.href
})
useTitle(metaTitle)

onUnmounted(() => {
  useTitle('抖音-记录美好生活')
})
</script>

<template>
  <Loading :show="loading" :isShowText="true" :center="true" text="图文加载中">
    <div class="note-page" v-if="noteDetail">
      <!-- 左侧：图集播放器 -->
      <div class="note-player-wrapper">
        <ImageGalleryPlayer
          :music_url="musicUrl"
          :imgGallery="imgGallery"
          :isPlay="true"
          :showAutoContinuous="false"
          :showImmersiveSwitch="false"
          :arrow-style="'bottom'"
          :musicInfo="noteDetail.image_album_music_info"
          class="note-player"
        >
          <!-- 右侧操作栏 -->
          <VideoAction
            :aweme_id="noteDetail.aweme_id"
            :user_id="noteDetail.author.uid"
            :avatar="noteDetail.author.avatar_thumb.url_list[0]"
            :digg_count="noteDetail.statistics?.digg_count"
            :comment_count="noteDetail.statistics?.comment_count"
            :collect_count="noteDetail.statistics?.collect_count"
            :share_count="noteDetail.statistics?.share_count"
            :user_digged="noteDetail.user_digged"
            :collect_stat="noteDetail.collect_stat"
            :follow_status="noteDetail.author?.follow_status"
            :isShowAvatar="false"
            :showSwiperControl="false"
            :music="noteDetail.music"
            @toggleComments="handleToggleComments"
          >
            <!-- 上下切换按钮 -->
            <SwiperControl
              :customControl="true"
              :disablePrev="!canGoPrev"
              :disableNext="!canGoNext"
              @prev="handlePrev"
              @next="handleNext"
            />
          </VideoAction>
        </ImageGalleryPlayer>
      </div>

      <!-- 右侧：侧边栏 -->
      <div class="note-sidebar">
        <!-- 用户信息 -->
        <div class="user-info">
          <router-link
            :to="`/user/${noteDetail.author.sec_uid}`"
            class="avatar-link"
          >
            <img
              :src="noteDetail.author.avatar_thumb.url_list[0]"
              :alt="noteDetail.author.nickname"
              class="avatar"
            />
          </router-link>
          <div class="user-detail">
            <router-link
              :to="`/user/${noteDetail.author.sec_uid}`"
              class="nickname"
            >
              {{ noteDetail.author.nickname }}
            </router-link>
            <div class="user-stats">
              <span
                >粉丝 <strong>{{ followers }}</strong></span
              >
              <span
                >获赞 <strong>{{ likes }}</strong></span
              >
            </div>
          </div>
          <button class="follow-btn" :class="{ followed: isFollow }">
            {{ isFollow ? '已关注' : '关注' }}
          </button>
        </div>

        <!-- 视频描述 -->
        <div class="note-desc">
          <ellipsis-expand
            :description="noteDetail.desc"
            :text-extra="noteDetail.text_extra || []"
            style="--lineClamp: 3; --lineHeight: 22px; --maxHeight: 66px"
            class="desc-text"
          />
          <!-- 发布时间 -->
          <div class="publish-info">
            <span class="publish-time">发布时间：{{ publishTime }}</span>
          </div>
        </div>

        <div class="note-sidebar-content">
          <!-- Tab切换 -->
          <div class="sidebar-tabs">
            <div class="sidebar-tabs-bar">
              <div
                class="sidebar-tabs-title"
                :class="{ active: activeTab === 'related' }"
                @click="activeTab = 'related'"
              >
                <span class="sidebar-tabs-title-text">相关推荐</span>
              </div>
              <div
                class="sidebar-tabs-title"
                :class="{ active: activeTab === 'comment' }"
                @click="activeTab = 'comment'"
              >
                <span class="sidebar-tabs-title-text"
                  >评论({{ noteDetail.statistics?.comment_count || 0 }})</span
                >
              </div>
            </div>
          </div>
          <div class="sidebar-tabs-border"></div>

          <!-- Tab内容 -->
          <div class="sidebar-tabs-content">
            <SidebarRelatedVideo
              v-show="activeTab === 'related'"
              :awemeId="noteDetail.aweme_id"
              :currentAweme="noteDetail"
              class="sidebar-related-video"
            />

            <VideoComment
              v-show="activeTab === 'comment'"
              :id="noteDetail.aweme_id"
              :author_id="Number(noteDetail.author.uid)"
              :relatedText="
                noteDetail.suggest_words?.suggest_words[0]?.words[0]?.word ?? ''
              "
            />
          </div>
        </div>
      </div>
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.note-page {
  width: 100%;
  padding: 0 40px;
  overflow-y: hidden;
  min-height: 100%;
}

.note-player-wrapper {
  width: 100%;
  height: 100%;

  .note-player {
    height: calc(100vh - 80px) !important;
    min-height: 300px;
    border-radius: 16px;
    position: relative;
    overflow: hidden;
  }
}

.note-sidebar {
  padding-right: 8px;
  // overflow: scroll;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-line-l3);

  .avatar-link {
    flex-shrink: 0;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-detail {
    flex: 1;
    margin-left: 12px;
    min-width: 0;

    .nickname {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-t1);
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        color: var(--color-primary);
      }
    }

    .user-stats {
      font-size: 12px;
      color: var(--color-text-t3);
      margin-top: 4px;

      span {
        margin-right: 12px;
      }

      strong {
        color: var(--color-text-t1);
        font-weight: 500;
      }
    }
  }

  .follow-btn {
    flex-shrink: 0;
    padding: 6px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background-color: var(--color-primary);
    color: #fff;

    &:hover {
      background-color: var(--color-primary-hover);
    }

    &.followed {
      background-color: var(--color-bg-b3);
      color: var(--color-text-t2);
    }
  }
}

.note-desc {
  color: var(--color-text-t1);

  .desc-text {
    width: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
  }

  :deep(.text) {
    font-size: 14px !important;
    line-height: 22px !important;

    .tag span {
      font-size: 14px !important;
      line-height: 22px !important;
    }
  }
}

.publish-info {
  justify-content: flex-start;
  align-items: center;
  margin-top: 2px;
  display: flex;

  .publish-time {
    color: var(--color-text-t3);
    font-size: 12px;
    line-height: 20px;
  }
}

.note-sidebar-content {
  margin-top: 16px;
  height: calc(-226px + 100vh);
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  .sidebar-tabs {
    height: 46px;
    justify-content: space-between;
    display: flex;
    position: relative;
    flex: 0 0 46px;

    .sidebar-tabs-bar {
      color: var(--color-text-t1);
      width: 100%;
      display: flex;
      position: relative;
      border-bottom: 1px solid var(--color-line-l3, rgba(22, 24, 35, 0.06));
      flex-shrink: 1;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      user-select: none;

      &::after {
        content: '';
        height: 0px;
        clear: both;
        display: block;
      }

      .sidebar-tabs-title {
        user-select: none;
        color: var(--color-text-t3);
        font-size: 16px;
        line-height: 46px;
        text-align: center;
        cursor: pointer;
        margin-right: 36px;
        font-weight: 400;

        &:last-child {
          margin-right: 0;
        }

        &:hover {
          color: var(--color-text-t1);
        }

        &.active,
        &.active:hover {
          color: var(--color-text-t0);
          border-bottom: 3px solid var(--color-primary);
          font-weight: 600;
        }
      }
    }
  }

  .sidebar-tabs-border {
    background-color: var(--color-line-l3);
    width: calc(100% + 32px);
    height: 1px;
    min-height: 1px;
    opacity: 0.06;
    z-index: 12;
    display: block;
    position: relative;
    left: -16px;
  }

  .sidebar-tabs-content {
    height: calc(100% - 46px);
    scrollbar-width: none;
    flex: 1;

    .sidebar-related-video {
      height: 100%;
      scrollbar-width: none;
      position: relative;
      overflow-x: hidden;
      overflow-y: scroll;
      outline: none;
    }
  }
}

// @media (min-width: 0) {
//   .note-page {
//     min-width: 852px;
//     max-width: 134.2vh;
//     margin-left: auto;
//     margin-right: auto;
//   }
//   .note-player-wrapper {
//     width: 100%;
//     padding-right: 0;
//   }

//   .note-sidebar {
//     display: none;
//   }
// }
@media (min-width: 440px) {
  .note-page {
    max-width: calc(175.2vh + 57.816px);
    display: flex;
  }
  .note-player-wrapper {
    min-width: 440px;
    width: calc(100% - 320px);
    padding-right: 20px;
  }

  .note-sidebar {
    width: 320px;
    display: block;
  }
}
@media (min-width: 1240px) {
  .note-page {
    padding: 0 24px 0 0;
  }
}

// 覆盖 related-video-item 的响应式字体样式
.sidebar-related-video {
  :deep(.list-item-container .interaction-section) {
    .video-title {
      font-size: 14px !important;
    }
    .video-meta {
      .like-content {
        .like-icon {
          width: 20px !important;
          height: 20px !important;
        }
        .like-count {
          font-size: 12px !important;
        }
      }
      .profile-info .user-name {
        font-size: 12px !important;
      }
    }
  }
}
</style>
