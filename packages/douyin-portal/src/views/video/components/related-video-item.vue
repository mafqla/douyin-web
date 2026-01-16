<script setup lang="ts">
const props = defineProps({
  videoTitle: String,
  videoLink: String,
  thumbnailSrc: String,
  videoDuration: String,
  likeCount: String,
  userName: String,
  sec_uid: String,
  // 是否正在播放
  isPlaying: {
    type: Boolean,
    default: false
  },
  // 是否禁用链接跳转（在侧边栏中使用时禁用）
  disableLink: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = (e: Event) => {
  if (props.disableLink) {
    e.preventDefault()
    emit('click')
  }
}
</script>
<template>
  <li class="list-item" :class="{ 'is-playing': isPlaying }">
    <div class="list-item-container">
      <div class="thumbnail-container">
        <!-- 普通缩略图 -->
        <component
          :is="disableLink ? 'div' : 'router-link'"
          :to="disableLink ? undefined : videoLink ?? ''"
          class="video-link"
          rel="noopener noreferrer"
          @click="handleClick"
        >
          <div class="image-container">
            <img :src="thumbnailSrc" alt="视频缩略图" class="thumbnail-image" />
            <img
              :src="thumbnailSrc"
              alt="视频缩略图"
              class="thumbnail-image-filter"
            />
          </div>
          <!-- 正在播放状态 -->
          <div class="playing-overlay" v-if="isPlaying">
            <div class="playing-icon-content">
              <div class="playing-icon"></div>
              <div class="playing-icon-2"></div>
            </div>

            <span class="playing-text">播放中</span>
          </div>
          <div v-if="!isPlaying" class="video-duration">
            {{ videoDuration }}
          </div>
        </component>
      </div>
      <div class="interaction-section">
        <h3>
          <component
            :is="isPlaying || disableLink ? 'div' : 'router-link'"
            :to="isPlaying || disableLink ? undefined : videoLink ?? ''"
            class="title-link"
            @click="handleClick"
          >
            <div class="video-title">{{ videoTitle }}</div>
          </component>
        </h3>
        <div class="video-meta">
          <span class="like-content">
            <svg-icon icon="like-line" class="like-icon" />
            <span class="like-count">{{ likeCount }}</span>
          </span>
          <span class="profile-info">
            <router-link :to="`/user/${sec_uid}`">
              <span class="user-name">{{ userName }}</span>
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.list-item {
  margin-top: 24px;
  display: block;
  cursor: pointer;

  &.is-playing {
    .image-container {
      filter: blur(12px);
    }
  }
}

.list-item-container {
  height: 90px;
  width: 100%;
  display: flex;

  &:hover {
    img {
      transform: scale(1.1);
      transition: all 0.3s ease-out 0s;
    }
  }

  .thumbnail-image {
    height: 100%;
    object-fit: cover;
    transform: scale(1);
    transition: all 0.3s ease-in 0s;
    max-width: 100%;
    max-height: 100%;
    color: rgb(22, 23, 34);
    position: relative;
    z-index: 1;
  }
  .thumbnail-image-filter {
    filter: blur(12px);
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.2);
    transition: all 0.3s ease-in 0s;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .thumbnail-container {
    width: 120px;
    height: 90px;
    flex-shrink: 0;
    margin-right: 8px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;

    .playing-overlay {
      opacity: 0.8;
      z-index: 2;
      background: rgba(0, 0, 0, 0.4);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 5px;
      display: flex;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      .playing-icon-content {
        width: 24px;
        height: 24px;
        position: relative;
      }
      .playing-icon {
        width: 24px;
        height: 24px;
        background-image: url(https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/play_effect.85840c1731f5dc69.png);
        background-size: 24px;
        font-size: 0;
        animation: 4s steps(94, start) forwards Z0ApMjwD;
        position: absolute;
        top: 0;
        left: 0;
      }
      @keyframes Z0ApMjwD {
        99% {
          opacity: 1;
          background-position-y: -2256px;
        }
        100% {
          opacity: 0;
          background-position-y: -2256px;
        }
      }
      .playing-icon-2 {
        opacity: 0;
        width: 24px;
        height: 24px;
        background-image: url(https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/playing_effect.78d3977c03431a5d.png);
        background-size: 24px;
        font-size: 0;
        animation: 4s steps(95, start) 3.95s infinite R82xwgfS;
        position: absolute;
        top: 0;
        left: 0;
      }
      @keyframes R82xwgfS {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 1;
          background-position-y: -2280px;
        }
      }

      .playing-text {
        color: var(--color-const-text-white);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
    }

    .image-container {
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      display: flex;
      position: relative;
    }

    .video-duration {
      color: var(--color-const-text-white);
      opacity: 0.9;
      width: 100%;
      text-align: right;
      padding-right: 4px;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      position: absolute;
      bottom: 0px;
      left: 0px;
    }
  }

  .interaction-section {
    text-align: left;
    flex: 1 1 0%;
    overflow: hidden;

    .title-link {
      text-align: justify;
      color: var(--color-text-t1);
      height: 66px;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      display: -webkit-box;
      overflow: hidden;
    }

    .video-title {
      color: var(--color-text-t1);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    .video-meta {
      align-items: center;
      // margin-top: 2px;
      display: flex;

      .like-content {
        .like-icon {
          vertical-align: middle;
          color: var(--color-text-t3);
          width: 20px;
          height: 20px;
        }

        .like-count {
          color: var(--color-text-t3);
          vertical-align: middle;
          font-size: 12px;
          font-weight: 500;
          line-height: 20px;
        }
      }

      .profile-info {
        text-align: right;
        text-overflow: ellipsis;
        color: var(--color-text-t3);
        padding-left: 10px;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        display: block;
        white-space: nowrap;
        flex: 1 1 0%;
        overflow: hidden;

        &:hover {
          .user-name {
            color: var(--color-text-t1);
          }
        }

        .user-name {
          color: var(--color-text-t3);
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
        }
      }
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  .list-item-container .interaction-section {
    .video-title {
      font-size: calc(0.803571vw + 1.42857px);
    }
    .video-meta {
      .like-content {
        .like-icon {
          width: calc(1.07143vw + 4.57143px);
          height: calc(1.07143vw + 4.57143px);
        }
        .like-count {
          font-size: calc(0.714286vw + 1.71429px);
        }
      }
      .profile-info .user-name {
        font-size: calc(0.714286vw + 1.71429px);
      }
    }
  }
}
@media screen and (min-width: 2560px) {
  .list-item-container .interaction-section {
    .video-title {
      font-size: 20px;
    }

    .video-meta {
      .like-content {
        .like-icon {
          width: 32px;
          height: 32px;
        }
        .like-count {
          font-size: 20px;
        }
      }
      .profile-info .user-name {
        font-size: 20px;
      }
    }
  }
}
</style>
