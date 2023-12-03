<script setup lang="ts">
import { ref } from 'vue'
import { ElEmpty } from 'element-plus'
import { VideoList } from '@/components/video-components'
import UserFavorites from '../user-favorites/user-favorites.vue'
import CollectList from '../collect-list/collect-list.vue'
import CollectionsList from '../collections-list/collections-list.vue'
import { videoStore } from '@/stores/videos'
// 数据为空时的展示
const isEmpty = ref(false)
const activeName = ref('videos')
const isLogin = ref(false)

const handleClick = (tab: any) => {
  console.log(tab)
}
</script>
<template>
  <div class="user-collect">
    <template v-if="videoStore().isEmpty.collect">
      <el-empty
        image="https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/image/EmptySearch.19da93c9.png"
        description="暂无内容"
      />
    </template>

    <template v-else>
      <div class="user-collect-list">
        <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
          <el-tab-pane label="收藏夹" name="favorites">
            <user-favorites>
              <collect-list />
            </user-favorites>
          </el-tab-pane>
          <el-tab-pane label="视频" name="videos">
            <video-list :videoList="videoStore().userCollectVideos" />
          </el-tab-pane>
          <el-tab-pane label="合集" name="collections">
            <user-favorites>
              <collections-list />
            </user-favorites>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.user-collect {
  margin-top: 12px;
  position: relative;

  :deep(.el-empty__image) {
    background-size: 100% 100%;
    height: 158px;
    width: 236px;
  }
  :deep(.el-empty__description) {
    p {
      // color: rgba(22, 24, 35, 1);
      color: #161823;
      font-family: sans-serif -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
    }
  }

  .user-collect-list {
    margin-top: 12px;
    width: 100%;

    :deep(.el-tabs__header) {
      align-items: center;
      background-color: var(--color-bg-b0);
      display: flex;
      height: 40px;
      justify-content: space-between;
      margin-bottom: 4px;
      position: relative;
      width: 100%;
      border: none;

      .el-tabs__item {
        font-size: 13px;
        line-height: 21px;

        &::before {
          // background: #f2f2f4;
          background: rgba(242, 242, 243, 1);
          content: '';
          height: 16px;
          left: -2px;
          position: absolute;
          top: 4px;
          width: 1px;
        }
        &:first-child::before {
          display: none;
        }
      }
    }
  }
}
</style>
