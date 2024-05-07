<script setup lang="ts">
import { ref } from 'vue'

const dianzan = 100
const shoucang = 100
const comment = 100

const isLiked = ref()
const isCollect = ref()
</script>
<template>
  <div class="video-detail-action">
    <div class="video-detail-action-left">
      <div class="video-detail-action-item">
        <svg-icon
          :class="{ liked: isLiked }"
          icon="dianzan"
          style="width: 42px; height: 42px"
        />
        <span class="num">{{ dianzan }}</span>
      </div>
      <div class="video-detail-action-item">
        <svg-icon icon="comment" style="width: 42px; height: 42px" />
        <span class="num">{{ comment }}</span>
      </div>
      <div class="video-detail-action-item">
        <svg-icon
          icon="collection"
          :class="{ collect: isCollect }"
          style="width: 42px; height: 42px"
        />
        <span class="num">{{ shoucang }}</span>
      </div>

      <div class="video-detail-action-item">
        <svg-icon icon="fenxiang" style="width: 42px; height: 42px" />
        <span class="num">9</span>
      </div>
    </div>
    <div class="video-detail-action-right">
      <div class="report-container">
        <svg-icon icon="report" />
        <span class="report-text">举报</span>
      </div>
      <span>发布时间：2024-04-02 17:00</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-detail-action {
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 4px;
  display: flex;
}
.video-detail-action-left {
  margin-left: -5px;
  display: flex;

  & > div {
    margin-right: 24px;
    * {
      vertical-align: middle;
    }
  }

  .video-detail-action-item {
    cursor: pointer;
    align-items: center;
    display: flex;

    .icon {
      height: 20px;
      width: 20px;
      opacity: 1;
      color: #fff;

      &.liked {
        color: red !important;
      }
      &.collect {
        color: rgb(255, 184, 2) !important;
      }
    }
  }

  .num {
    color: var(--color-text-t0);
    font-size: 15px;
    font-weight: 500;
    line-height: 23px;
  }
}
.video-detail-action-right {
  color: var(--color-text-t4);
  justify-content: flex-end;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  display: flex;

  .report-container {
    cursor: pointer;
    color: var(--color-text-t4);
    align-items: center;
    display: flex;

    .report-text {
      margin-left: 7px;
      margin-right: 24px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
  }

  .publish-time {
    color: var(--color-text-t4);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
}
</style>
