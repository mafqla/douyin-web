/* eslint-disable */
<script setup lang="ts">
import type { IawemeDetail } from '@/api/tyeps/request_response/videoDetailRes';
import { useCount } from '@/hooks';
import formatTime from '@/utils/date-format';
import { ref, type Ref } from 'vue'


const videoDetail = inject<Ref<IawemeDetail>>('videoDetail')


const isLiked = ref(Boolean(videoDetail?.value.user_digged))
const isCollect = ref(Boolean(videoDetail?.value.collect_stat))

</script>
<template>
  <div class="video-detail-action" v-if="videoDetail">
    <div class="video-detail-action-left">
      <div class="video-detail-action-item">
        <svg-icon :class="{ liked: isLiked }" icon="dianzan" style="width: 42px; height: 42px" />
        <span class="num">{{ useCount(videoDetail.statistics.digg_count) }}</span>
      </div>
      <div class="video-detail-action-item">
        <svg-icon icon="comment" style="width: 42px; height: 42px" />
        <span class="num">{{ useCount(videoDetail.statistics.collect_count) }}</span>
      </div>
      <div class="video-detail-action-item">
        <svg-icon icon="collection" :class="{ collect: isCollect }" style="width: 42px; height: 42px" />
        <span class="num">{{ useCount(videoDetail.statistics.share_count) }}</span>
      </div>

      <div class="video-detail-action-item">
        <svg-icon icon="fenxiang" style="width: 42px; height: 42px" />
        <span class="num">{{ useCount(videoDetail.statistics.share_count) }}</span>
      </div>
    </div>
    <div class="video-detail-action-right">
      <div class="report-container">
        <svg-icon icon="report" />
        <span class="report-text">举报</span>
      </div>
      <span>发布时间：{{ formatTime(videoDetail.create_time) }}</span>
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

  &>div {
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
