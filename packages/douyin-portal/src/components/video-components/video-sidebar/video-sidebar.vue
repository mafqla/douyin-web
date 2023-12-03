<script setup lang="ts">
import { ref } from 'vue'
import { ElTabPane, ElTabs } from 'element-plus'
import VideoSideList from '../video-side-list/video-side-list.vue'
import VideoComment from '../video-comment/video-comment.vue'

const activeName = ref('comment')

const handleClick = (tab: string) => {
  console.log(activeName)
  activeName.value = tab
}

const props = defineProps({
  id: Number,
  username: String
})
</script>
<template>
  <div class="video-sidebar">
    <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
      <el-tab-pane label="TA的作品" name="post">
        <video-side-list />
      </el-tab-pane>

      <el-tab-pane label="评论" name="comment">
        <video-comment :id="props.id" />
      </el-tab-pane>
    </el-tabs>

    <div class="video-sidebar-close" @click="$emit('closeComments')">
      <svg-icon class="icon" icon="close" />
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
  z-index: 1300;
  position: absolute;
  right: 0;
  top: 0;

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

  :deep(.el-tabs__header) {
    height: 46px !important;
    padding: 0 16px;
    margin: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    display: flex;
    flex: 0 0 46px !important;
    align-items: center;
  }

  :deep(.el-tabs__item.is-active) {
    // color: #000;
    color: rgba(255, 255, 255, 1);
  }
  :deep(.el-tabs__item:hover) {
    color: none;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
  :deep(.el-tabs__item) {
    height: 100%;
    color: rgba(255, 255, 255, 0.34);
    font-size: 14px;
    line-height: 46px;
    font-weight: 400;
    cursor: pointer;
    font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
    text-align: center;
    margin-right: 16px;
    padding: 0;
  }
  :deep(.el-tabs__active-bar) {
    border-bottom: 3px solid #ff2c55;
  }
  :deep(.el-tabs__content) {
    overflow: hidden;
    position: relative;
    height: calc(100% - 46px);
  }
}

@media screen and (min-width: 1440px) and (max-width: 2560px) {
  // .BasEuG5Q.nQWxAwdY .JrMwkvQy.WQ9IVUcw {
  //     width:71.4285714286%
  // }

  .video-sidebar {
    width: 28.5714285714%;
  }
}

@media screen and (min-width: 2560px) {
  // .BasEuG5Q.nQWxAwdY .JrMwkvQy.WQ9IVUcw {
  //   width: calc(100% - 656px);
  // }

  .video-sidebar {
    width: 656px;
  }
}
</style>
