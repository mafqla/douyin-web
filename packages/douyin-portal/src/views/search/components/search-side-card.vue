<script setup lang="ts">
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { useCount } from '@/hooks/useCount'
import { videosCtrolStore } from '@/stores/videos-control'
import { type PropType } from 'vue'

defineProps({
  aweme_list: {
    type: Array as PropType<IAwemeInfo[]>,
    default: () => []
  }
})
const control = videosCtrolStore()
const closeRelated = () => {
  control.isShowRelated = false
}
</script>
<template>
  <div
    class="search-side-card"
    style="width: 124px"
    v-show="control.isShowRelated"
  >
    <div class="search-side-card__header">
      <div class="search-side-card__header-title">相关内容</div>
      <svg-icon
        icon="close-big"
        class="search-side-card__header-icon"
        @click="closeRelated"
      />
    </div>
    <div class="search-side-card__body">
      <ul class="search-side-card__list">
        <li class="search-side-card__item" v-for="item in aweme_list">
          <a
            class="search-side-card-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="card-image-container">
              <div class="card-image-wrapper">
                <img
                  :src="item.video.cover.url_list[0]"
                  :alt="`${item.author.nickname}:${item.desc}`"
                  class=""
                />
              </div>
              <div class="card-overlay"></div>
              <span class="author-card-user-video-like">
                <svg-icon icon="digg" class="icon-digg" />
                <span>{{ useCount(item.statistics.digg_count) }}</span>
              </span>
              <p class="card-description">
                {{ item.desc }}
              </p>
            </div>
            <div class="card-status">
              <div class="card-animation-container">
                <div
                  class="card-animation-1 hide-animation-if-not-suport-gpu"
                ></div>
                <div
                  class="card-animation-2 hide-animation-if-not-suport-gpu"
                ></div>
              </div>
              <div class="card-status-label">播放中</div>
            </div>
          </a>
        </li>
      </ul>
      <list-footer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-side-card {
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 2;

  &__header {
    align-items: center;
    display: flex;
    flex: 0 0;
    flex-shrink: 0;
    padding: 16px 20px 16px 10px;

    &-title {
      color: var(--color-text-t1);
      font-size: 15px;
      font-weight: 500;
      line-height: 23px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-icon {
      cursor: pointer;
      flex-shrink: 0;
      margin-left: auto;
      width: 13px;
      height: 13px;
      color: var(--color-text-t4);

      path {
        width: 13px;
        height: 13px;
      }
    }
  }

  &__body {
    flex-grow: 1;
    height: 100%;
    overflow-y: scroll;
    position: relative;
    width: 100%;
  }

  &__list {
    display: flex;
    flex-direction: column;
    padding: 16px 16px 0;
  }

  &__item {
    margin-bottom: 10px;
    overflow: hidden;
  }
  &-link {
    border-radius: 12px;
    cursor: pointer;
    display: block;
    overflow: hidden;
    position: relative;
    transition-duration: 0.35s;
    transition-property: transform, shadow, background-color;
    width: 100%;

    .card-image-container {
      border-radius: 12px;
      box-shadow: 0 0 0.5px 0 var(--color-secondary-default);
      overflow: hidden;
      padding-bottom: 133%;
      position: relative;
      transition-delay: 0.5s;
      transition-duration: 0.35s;
      transition-property: border-radius;

      .card-image-wrapper {
        height: 100%;
        overflow: hidden;
        position: absolute;
        width: 100%;

        img {
          height: 100%;
          -o-object-fit: cover;
          object-fit: cover;
          width: 100%;

          transform: scale(1);
          transition: all 0.3s ease-in;
        }
      }
      .card-overlay {
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
        bottom: 0;
        height: 48px;
        opacity: 1;
        position: absolute;
        width: 100%;
      }
      .author-card-user-video-like {
        bottom: 4px;
        font-size: 12px;
        left: 0;
        margin-left: 8px;

        align-items: center;
        // bottom: 4px;
        color: #fff;
        display: flex;
        flex-direction: row;
        // font-size: 14px;
        font-weight: 500;
        justify-content: center;
        // left: 8px;
        line-height: 22px;
        position: absolute;

        .icon-digg {
          height: 14px;
          width: 14px;
        }
        span {
          display: inline-block;
          margin-left: 5px;
        }
      }

      .card-description {
        display: none;
      }
    }

    .card-status {
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      left: 0;
      opacity: 0.8;
      padding-bottom: 5px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 2;

      .card-animation-container {
        height: 24px;
        position: relative;
        width: 24px;

        .card-animation-1 {
          animation: playend 4s steps(94, start) forwards;
          background-image: url(@/assets/play_effect.cf93320c.png);
          background-size: 24px;
          font-size: 0;
          height: 24px;
          left: 0;
          position: absolute;
          top: 0;
          width: 24px;
        }
        .card-animation-2 {
          animation: playing 4s steps(95, start) infinite;
          animation-delay: 3.95s;
          background-image: url(@/assets/playing_effect.f36700c2.png);
          background-size: 24px;
          font-size: 0;
          height: 24px;
          left: 0;
          opacity: 0;
          position: absolute;
          top: 0;
          width: 24px;
        }

        @keyframes playend {
          99% {
            background-position-y: -2256px;
            opacity: 1;
          }

          to {
            background-position-y: -2256px;
            opacity: 0;
          }
        }

        @keyframes playing {
          0% {
            opacity: 1;
          }

          to {
            background-position-y: -2280px;
            opacity: 1;
          }
        }
      }
      .card-status-label {
        color: var(--color-const-text-white);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }
}
</style>
