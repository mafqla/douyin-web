<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import VideoSideList from '../video-side-list/video-side-list.vue'
import VideoComment from '../video-comment/video-comment.vue'
import SidebarRelatedVideo from './sidebar-related-video.vue'
import SidebarFolderPlaylist from './sidebar-folder-playlist.vue'
import SidebarMixPlaylist from './sidebar-mix-playlist.vue'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { useSidebarStore, type SidebarTabType } from '@/stores/sidebar'

const sidebarStore = useSidebarStore()

const activeName = ref<SidebarTabType>('comment')

const handleClick = (tab: SidebarTabType) => {
  activeName.value = tab
  // 同步到 store
  sidebarStore.setActiveTab(tab)
}

const props = defineProps<{
  aweme_id?: string
  user_sec_id?: string
  username?: string
  author_id?: number
  relatedText?: string
  // 当前播放的视频信息（用于相关推荐显示第一个）
  currentAweme?: IAwemeInfo
}>()

// 从 store 获取收藏夹信息
const folder = computed(() => sidebarStore.currentFolder)

// 从 store 获取合集信息
const mix = computed(() => sidebarStore.currentMix)

// 当有收藏夹信息时，默认切换到收藏夹 tab
watch(
  folder,
  (newFolder) => {
    if (newFolder) {
      activeName.value = 'folder'
      sidebarStore.setActiveTab('folder')
    }
  },
  { immediate: true }
)

// 当有合集信息时，默认切换到合集 tab
watch(
  mix,
  (newMix) => {
    if (newMix) {
      activeName.value = 'collection'
      sidebarStore.setActiveTab('collection')
    }
  },
  { immediate: true }
)

// 监听 store 中 activeTab 的变化，同步到本地状态
watch(
  () => sidebarStore.activeTab,
  (newTab) => {
    if (newTab !== activeName.value) {
      activeName.value = newTab
    }
  },
  { immediate: true }
)
</script>
<template>
  <div class="video-sidebar">
    <div class="related-video-card">
      <div class="video-tabs">
        <div class="video-tabs-top">
          <div class="video-tabs-top-content">
            <div class="video-tabs-bar">
              <div
                v-if="folder"
                class="video-tabs-title"
                :class="{ active: activeName === 'folder' }"
                @click="handleClick('folder')"
              >
                <span class="video-tabs-title-text">收藏夹</span>
              </div>
              <div
                class="video-tabs-title"
                :class="{ active: activeName === 'works' }"
                @click="handleClick('works')"
              >
                <span class="video-tabs-title-text">TA的作品</span>
              </div>
              <div
                class="video-tabs-title"
                :class="{ active: activeName === 'comment' }"
                @click="handleClick('comment')"
              >
                <span class="video-tabs-title-text">评论</span>
              </div>
              <div
                class="video-tabs-title"
                :class="{ active: activeName === 'collection' }"
                @click="handleClick('collection')"
              >
                <span class="video-tabs-title-text">合集</span>
              </div>
              <div
                class="video-tabs-title"
                :class="{ active: activeName === 'related' }"
                @click="handleClick('related')"
              >
                <span class="video-tabs-title-text">相关推荐</span>
              </div>
            </div>
            <div class="video-sidebar-close" @click="$emit('closeComments')">
              <svg-icon class="icon" icon="close" />
            </div>
          </div>
        </div>

        <div class="video-tabs-border"></div>
        <div class="video-tabs-content">
          <!-- TA的作品 -->
          <div
            class="video-tabs-content-item works"
            v-show="activeName === 'works'"
          >
            <video-side-list
              :key="props.user_sec_id"
              :user_sec_id="props.user_sec_id ?? ''"
              :username="props.username ?? ''"
              :aweme_id="props.aweme_id ?? ''"
            />
          </div>
          <!-- 评论 -->
          <div
            class="video-tabs-content-item"
            v-show="activeName === 'comment'"
          >
            <video-comment
              :key="props.aweme_id"
              :id="props.aweme_id"
              :author_id="props.author_id"
              :relatedText="props.relatedText"
            />
          </div>
          <!-- 合集 -->
          <div
            v-if="mix"
            class="video-tabs-content-item collection"
            v-show="activeName === 'collection'"
          >
            <SidebarMixPlaylist
              :mix="mix"
              :aweme_id="props.aweme_id ?? ''"
            />
          </div>
          <!-- 相关推荐 -->
          <div
            class="video-tabs-content-item related"
            v-show="activeName === 'related'"
            data-scrollable
          >
            <SidebarRelatedVideo
              v-if="props.aweme_id"
              :key="props.aweme_id"
              :awemeId="props.aweme_id"
              :currentAweme="props.currentAweme"
            />
          </div>
          <!-- 收藏夹播放列表 -->
          <div
            v-if="folder"
            class="video-tabs-content-item folder"
            v-show="activeName === 'folder'"
          >
            <SidebarFolderPlaylist
              :folder="folder"
              :aweme_id="props.aweme_id ?? ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-sidebar {
  width: 336px;
  background-color: rgba(0, 0, 0, 0.7);
  height: 100%;
  overflow: -moz-scrollbars-none;
  position: relative;
  scrollbar-width: none;
  transform: translateZ(0);
  z-index: 3;

  .related-video-card {
    scrollbar-width: none;
    width: 100%;
    height: 100%;
    flex-direction: column;
    display: flex;
    position: absolute;
    top: 0px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    border-radius: 0px;

    .video-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;

      &-top {
        padding: 0px 16px;
        height: 46px;

        &-content {
          color: rgba(249, 249, 249, 0.6);
          width: 100%;
          position: relative;
          flex-shrink: 1;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;

          box-sizing: border-box;
        }
        & * {
          user-select: none;
        }
      }
      &-bar {
        position: relative;
        white-space: nowrap;
        outline: none;
        &::after {
          content: '';
          height: 0px;
          clear: both;
          display: block;
        }
        .video-tabs-title {
          font-size: 14px;
          line-height: 46px;
          text-align: center;
          font-weight: 400;
          outline: none;
          border-bottom: 3px solid transparent;
          padding: 0;
          box-sizing: border-box;
          color: var(--color-text-t2);
          display: inline-block;
          position: relative;
          cursor: pointer;
          margin-right: 16px;
          line-height: 46px;

          &:not(:last-of-type) {
            margin-right: 24px;
          }

          &:hover {
            color: rgba(249, 249, 249, 1);
          }

          &.active,
          &.active:hover {
            color: rgba(249, 249, 249, 1);
            border-bottom: 3px solid var(--color-primary);
          }
        }
      }

      &-border {
        width: calc(100% + 32px);
        height: 1px;
        min-height: 1px;
        opacity: 0.06;
        z-index: 12;
        background-color: rgb(255, 255, 255);
        display: block;
        position: relative;
        left: 0px;
      }
      &-content {
        height: calc(100% - 46px);
        scrollbar-width: none;
        flex: 1 1 0%;
        &-item {
          height: 100%;
          overflow-y: auto;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
          &.works {
            padding: 0 16px;
          }
          &.related {
            padding: 0 16px;
          }
          &.folder {
            padding: 0 16px;
          }
          &.collection {
            padding: 0 16px;
          }
        }
      }
    }
  }
  .video-sidebar-close {
    align-items: center;
    margin: 0 -8px 0 0;
    display: flex;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    cursor: pointer;

    .icon {
      width: 36px;
      height: 36px;
      color: rgba(255, 255, 255, 0.34);
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .video-sidebar {
    width: 28.5714285714%;
  }
  .video-sidebar .related-video-card .video-tabs-bar .video-tabs-title {
    font-size: calc(0.892857vw + 1.14286px);
    line-height: calc(2.32143vw + 12.5714px);
    margin-right: 13.2203%;
  }

  .video-tabs-top {
    height: calc(2.32143vw + 12.5714px) !important;
  }
}

@media screen and (min-width: 2560px) {
  .video-sidebar {
    width: 656px;
  }
  .video-sidebar .related-video-card .video-tabs-bar .video-tabs-title {
    margin-right: calc(13.2203% - 11px);
    font-size: 24px;
    line-height: 72px;
  }

  .video-tabs-top {
    height: 72px !important;
  }
}
</style>
