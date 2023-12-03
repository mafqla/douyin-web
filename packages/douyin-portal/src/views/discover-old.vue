<script setup lang="ts">
import {} from 'vue'
import {
  DiscoverClassify,
  DiscoverHeader,
  DiscoverNew,
  DiscoverRecommend
} from '@/components/discover'
</script>
<template>
  <div class="discover">
    <div class="discover-container-in">
      <el-scrollbar>
        <discover-header />
        <discover-classify />
        <discover-new />
        <discover-recommend />
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discover {
  height: 100%;
  position: relative;
  user-select: none;

  //滚动条隐藏
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &-container {
    color: rgba(22, 24, 35, 0.75);
    font-family: 'PingFang SC', DFPKingGothicGB-Regular, sans-serif;
    font-size: 20px;
    font-weight: 400;
    height: 100%;
    // overflow-y: scroll;

    position: relative;

    &-in {
      overflow-x: visible;

      :deep(.el-scrollbar__bar.is-horizontal) {
        height: 0 !important;
      }
    }
  }
}

@media (min-width: 2472px) {
  .discover-container-in {
    margin: 0 auto;
    width: 2256px;
  }
}
</style>
