<script setup lang="ts">
import { ref } from 'vue'
import { ElEmpty } from 'element-plus'
import { videoStore } from '@/stores/videos'
</script>
<template>
  <div class="user-work">
    <template v-if="videoStore().isEmpty.post">
      <el-empty
        image="https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/image/EmptySearch.19da93c9.png"
        description="暂无内容"
      >
        <div class="title">暂无内容</div>
      </el-empty>
    </template>

    <template v-else>
      <div class="user-like-list">
        <video-list :videoList="videoStore().userPostVideos" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.user-work {
  width: 100%;
  height: 100%;
  margin-top: 12px;
  :deep(.el-empty__image) {
    background-size: 100% 100%;
    height: 158px;
    width: 236px;
  }
  :deep(.el-empty__description) {
    // p {
    //   // color: rgba(22, 24, 35, 1);
    //   color: #161823;
    //   font-family: sans-serif -apple-system, BlinkMacSystemFont, Segoe UI,
    //     Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;
    //   font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
    //   font-size: 18px;
    //   font-weight: 500;
    //   line-height: 26px;
    // }
    display: none;
  }
  :deep(.el-empty__bottom) {
    .title {
      color: var(--color-text-t1);
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
      margin-bottom: 8px;
      position: relative;
    }
    .subtitle {
      color: var(--color-text-t3);
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 8px;
      position: relative;
    }
  }
}
</style>
