<script setup lang="ts">
import { ref } from 'vue'
import VideoSideList from '../video-side-list/video-side-list.vue'
import VideoComment from '../video-comment/video-comment.vue'

const activeName = ref('comment')

const handleClick = (tab: string) => {
  // console.log(activeName)
  activeName.value = tab
}

const props = defineProps({
  aweme_id: String,
  user_sec_id: String,
  username: String,
  author_id: Number,
  relatedText: String
})
</script>
<template>
  <div class="video-sidebar">
    <div class="related-video-card">
      <div class="video-tabs">
        <div class="video-tabs-top">
          <div class="video-tabs-top-content">
            <div class="video-tabs-bar">
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
            </div>
          </div>
        </div>
        <div class="video-sidebar-close" @click="$emit('closeComments')">
          <svg-icon class="icon" icon="close" />
        </div>
        <div class="video-tabs-border"></div>
        <div class="video-tabs-content">
          <div
            class="video-tabs-content-item works"
            v-show="activeName === 'works'"
          >
            <video-side-list
              :user_sec_id="props.user_sec_id ?? ''"
              :username="props.username ?? ''"
              :aweme_id="props.aweme_id ?? ''"
            />
          </div>
          <div
            class="video-tabs-content-item"
            v-show="activeName === 'comment'"
          >
            <video-comment
              :id="props.aweme_id"
              :author_id="props.author_id"
              :relatedText="props.relatedText"
            />
          </div>
          <div
            class="video-tabs-content-item"
            v-show="activeName === 'collection'"
          >
            <!-- 合集的内容 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-sidebar {
  width: 336px;
  background-color: rgba(0, 0, 0, 0.32);
  height: 100%;
  overflow: -moz-scrollbars-none;
  position: relative;
  scrollbar-width: none;
  transform: translateZ(0);
  z-index: 3;
  // position: absolute;
  // right: 0;
  // top: 0;

  .related-video-card {
    scrollbar-width: none;
    width: 100%;
    height: 100%;
    flex-direction: column;
    display: flex;
    position: absolute;
    top: 0px;
    // border-radius: 4px 0px 0px 4px;
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
          margin-left: 16px;
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
          &.works {
            padding: 0 16px;
          }
        }
      }
    }
  }
  .video-sidebar-close {
    position: absolute;
    top: 4px;
    right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
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
}

@media screen and (min-width: 2560px) {
  .video-sidebar {
    width: 656px;
  }
}
</style>
