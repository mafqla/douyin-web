<script setup lang="ts">
import {} from 'vue'
import RelatedVideoItem from './related-video-item.vue'
</script>
<template>
  <div class="related-video">
    <div class="user-info">
      <div class="avatar-content">
        <div class="live-avatar">
          <img
            class="avatar"
            src="//p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_efd7067eff5cd3e49d18b328d2a5700e.jpeg?from=116350172"
          />
        </div>
      </div>
      <div class="info-content">
        <div class="username">
          <span class="username-text">Blueblue.</span>
        </div>
        <p class="stats-container">
          <span class="stats-label">粉丝</span>
          <span class="stats-value">16.1万</span>
          <span class="stats-label">获赞</span>
          <span class="stats-value">3142.6万</span>
        </p>
      </div>

      <div class="btn-content">
        <button type="button" class="btn">关注</button>
      </div>
    </div>
    <div class="line"></div>
    <div class="aweme-relate">
      <div class="title-container">
        <h2 class="h2-title">推荐视频</h2>
      </div>

      <ul>
        <related-video-item
          v-for="item in 20"
          :key="item"
          videoTitle="还得是湖南妹妹真的太顶了，照片视频都绝了 #大长腿 #陌生人拍照"
          videoLink="//www.douyin.com/video/7347978613007863066"
          thumbnailSrc="//p9-pc-sign.douyinpic.com/image-cut-tos-priv/7ee7ec9cd08dfdaae500c675cbffe766~tplv-dy-resize-origshort-autoq-75:330.jpeg?biz_tag=pcweb_cover&from=3213915784&s=PackSourceEnum_WEBPC_RELATED_AWEME&sc=cover&se=false&x-expires=2027689200&x-signature=AcHqYcX6m9y9HPJ2zUEYLHSz5eE%3D"
          videoDuration="03:05"
          likeCount="5.1万"
          userName="七玖📸"
        />
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.related-video {
  width: 100%;
}
.user-info {
  height: 90px;
  justify-content: center;
  align-items: center;
  // margin: 11px 0 3px;
  margin: 1px 0 3px;
  display: flex;
}

.avatar-content {
  transition: all 0.3s ease-in;
  transform: scale(1);
  &:hover {
    transition: all 0.3s ease-out;
    transform: scale(1.1);
  }

  .live-avatar {
    width: 60px;
    height: 60px;
    box-sizing: content-box;
    border-radius: 50%;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    // border: 1px solid rgba(22, 24, 35, 0.06) !important;
    border: 1px solid var(--color-line-l3) !important;

    .avatar {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      position: relative;
    }
  }
}
.info-content {
  flex: 1;
  margin: 0 8px;
  overflow: hidden;

  * {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .username {
    color: var(--color-text-t1);
    height: 28px;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    display: flex;

    .username-text {
      color: var(--color-text-t1);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
  }
  .stats-container {
    color: var(--color-text-t4);
    font-size: 12px;
    line-height: 20px;

    .stats-label {
      margin-right: 2px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }
    .stats-value {
      color: var(--color-text-t1);
      margin-right: 8px;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
    }
  }
}

.btn-content {
  .btn {
    margin: 0;
    cursor: pointer;
    border: 0;
    outline: none;
    justify-content: center;
    align-items: center;
    // margin: 0 8px;
    padding: 0 16px;
    display: inline-flex;
    position: relative;
    min-width: 68px;
    height: 32px;
    border-radius: 8px;
    font-size: 14px;

    background-color: var(--color-primary);

    color: var(--color-const-text-white);
  }
}

.line {
  width: 100%;
  height: 1px;
  min-height: 1px;
  background-color: var(--color-line-l3);
  display: block;
  position: relative;
}

.aweme-relate {
  margin-top: 36px;

  .title-container {
    justify-content: center;
    align-items: center;
    display: flex;

    .h2-title {
      color: var(--color-text-t1);
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
      white-space: nowrap;
      flex: 1 1 0%;
      overflow: hidden;
    }
  }
}
</style>
