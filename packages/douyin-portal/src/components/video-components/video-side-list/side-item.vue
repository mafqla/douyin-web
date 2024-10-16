<script setup lang="ts">
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import { useCount } from '@/hooks'
import {} from 'vue'
interface SideItemProps {
  item: IAwemeInfo
  aweme_id: string
}

const props = defineProps<SideItemProps>()
</script>
<template>
  <div class="side-item" :aweme_id="props.item.aweme_id">
    <div class="side-item-content">
      <a href="#" class="side-link">
        <div class="side-link-content">
          <div class="side-link-content-img">
            <img
              :src="props.item.video.cover.url_list[0]"
              :alt="props.item.desc"
              class=""
            />
          </div>

          <div class="user-video-stats-tag">
            <div class="user-video-tag">
              <span
                class="tag-title"
                style="background: rgb(250, 206, 21)"
                v-if="props.item.is_top"
              >
                置顶
              </span>
            </div>
          </div>
          <span class="author-card-user-video-like">
            <svg-icon icon="small-like" class="icon" />
            <span>{{ useCount(props.item.statistics.digg_count) }}</span>
          </span>
          <p class="side-video-title">
            {{ props.item.desc }}
          </p>
        </div>
      </a>

      <div class="side-playing" v-show="props.aweme_id === props.item.aweme_id">
        <div class="side-playing-content">
          <div class="one"></div>
          <div class="two"></div>
        </div>
        <div class="side-playing-title">播放中</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-item {
  display: inline-flex;
  position: relative;

  .side-item-content {
    border: 1px solid hsla(0, 0%, 100%, 0.1);
    border-radius: 4px;
    font-size: 0;
    overflow: hidden;
    position: relative;
    width: 100%;

    .side-link {
      border: unset;
      border: 0.3px solid rgba(255, 255, 255, 0.04);
      position: relative;
      cursor: pointer;
      display: inline-block;
      transition-property: transform, shadow, background-color;
      width: 100%;

      .side-link-content {
        // box-shadow: 0 0 0.5px 0 #f2f2f4;
        box-shadow: 0 0 0.5px 0 rgba(243, 243, 243, 0.08);
        padding-bottom: 133%;
        transition-delay: 0.5s;
        transition-property: border-radius;

        .side-link-content-img {
          height: 100%;
          position: absolute;
          width: 100%;
          align-items: center;
          display: flex;
          justify-content: center;
          // position: relative;

          img {
            height: 100%;
            -o-object-fit: cover;
            object-fit: cover;
            width: 100%;
            transform: scale(1);
            transition: all 0.3s ease-in;
          }
        }

        &:hover {
          img {
            transform: scale(1.1);
            transition: all 0.3s ease-out;
          }
        }

        .user-video-stats-tag {
          position: absolute;
          left: 4px;
          top: 4px;
          display: flex;
          flex-wrap: wrap;
          .user-video-tag {
            margin-right: 2px;
            .tag-title {
              border-radius: 2px;
              white-space: nowrap;
              color: #161823;
              background: #faca15;

              align-items: center;
              // border-radius: 4px;
              display: inline-flex;
              font-size: 12px;
              font-weight: 500;
              height: 20px;
              justify-content: center;
              line-height: 20px;
              padding: 0 4px;
            }
          }
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

          .icon {
            width: 14px;
            height: 14px;
            margin-right: 2px;
          }
        }

        .side-video-title {
          display: none;
        }
      }
    }

    .side-link,
    .side-link-content {
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      transition-duration: 0.35s;
    }

    .side-playing {
      align-items: center;
      background: rgba(0, 0, 0, 0.6);
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
      .side-playing-content {
        height: 24px;
        position: relative;
        width: 24px;
        margin-bottom: 6px;
        .one {
          animation: playend 4s steps(94, start) forwards;
          background-image: url('@/assets/playing_effect.png');
        }
        .two {
          animation: playing 4s steps(95, start) infinite;
          animation-delay: 3.95s;
          background-image: url('@/assets/playing_effect2.png');
          opacity: 0;
        }
        .one,
        .two {
          background-size: 24px;
          font-size: 0;
          height: 24px;
          left: 0;
          position: absolute;
          top: 0;
          width: 24px;
        }
      }
      .side-playing-title {
        color: #fff;
        color: rgba(255, 255, 255, 1);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }
}
.side-item:nth-child(1) {
  margin-top: 0;
}

.side-item:nth-child(3n-1),
.side-item:nth-child(3n-2) {
  margin-bottom: 12px;
  margin-right: 6px;
  width: calc(33.33333% - 8px);
}

.side-item:nth-child(3n-1) {
  margin-left: 6px;
}

.side-item:nth-child(3n) {
  margin-bottom: 12px;
  margin-left: 6px;
  width: calc(33.33333% - 8px);
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
</style>
