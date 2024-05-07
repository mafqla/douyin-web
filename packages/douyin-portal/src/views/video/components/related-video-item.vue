<script setup lang="ts">
import {} from 'vue'

defineProps({
  videoTitle: String,
  videoLink: String,
  thumbnailSrc: String,
  videoDuration: String,
  likeCount: String,
  userName: String
})
</script>
<template>
  <li class="list-item">
    <div class="list-item-container">
      <div class="thumbnail-container">
        <a
          :href="videoLink"
          class="video-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="image-container">
            <img :src="thumbnailSrc" alt="视频缩略图" class="thumbnail-image" />
          </div>
          <div class="video-duration">{{ videoDuration }}</div>
        </a>
      </div>
      <div class="interaction-section">
        <h3>
          <a class="title-link">
            <div class="video-title">{{ videoTitle }}</div>
          </a>
        </h3>
        <div class="video-meta">
          <span class="like-content">
            <svg-icon icon="like-line" class="like-icon" />
            <span class="like-count">{{ likeCount }}</span>
          </span>
          <span class="profile-info">
            <span class="user-name">{{ userName }}</span>
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
  }

  .thumbnail-container {
    width: 120px;
    height: 90px;
    flex-shrink: 0;
    margin-right: 8px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;

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
      margin-top: 2px;
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
</style>
