<script setup lang="ts">
import { ref, watchEffect, type Ref, reactive, onMounted } from 'vue'
import { UserCollect, UserHistory, UserLike, UserPost } from '.'
import { ElTabPane, ElTabs, type TabsPaneContext } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/stores/user'
import { videoStore } from '@/stores/videos'
const route = useRoute()
const router = useRouter()

const activeName = ref(router.currentRoute.value.query.showTab) as Ref<
  'post' | 'comments' | 'history' | string | undefined | number
>

// console.log(activeName.value, 'activeName.value')
const handleClick = (tab: TabsPaneContext) => {
  // console.log(tab.paneName)
  activeName.value = tab.paneName

  router.push({
    query: {
      ...route.query,
      showTab: tab.paneName
    }
  })
}

// 滚动监听
window.addEventListener('scroll', function () {
  if (window.scrollY > 160) {
    document.querySelector('.el-tabs__header')?.classList.add('header-scroll')
  } else {
    document
      .querySelector('.el-tabs__header')
      ?.classList.remove('header-scroll')
  }
})

const tabData = reactive({
  isHide: true
})

const video = videoStore()

const postCount = ref(0)
const likeCount = ref(0)
const collectCount = ref(0)

//是否隐藏作品
const isHidePost = ref(false)
//是否隐藏喜欢
const isHideLike = ref(true)
watchEffect(() => {
  postCount.value = video.postCount
  likeCount.value = video.likeCount
  collectCount.value = video.collectCount

  activeName.value = router.currentRoute.value.query.showTab as any
})
</script>

<template>
  <div class="user-tab">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="作品" name="post" :lazy="true">
        <template #label v-if="!isHidePost">
          <span class="tab-title">作品</span>
          <span class="tab-video-num" v-if="tabData.isHide">
            {{ postCount }}
          </span>
          <!-- <svg-icon icon="lock" class="icon" v-if="tabData.isHide" /> -->
        </template>

        <template v-if="!isHidePost">
          <Loading :show="videoStore().loading">
            <user-post />
          </Loading>
        </template>
      </el-tab-pane>

      <el-tab-pane label="喜欢" name="like" :lazy="true">
        <template #label v-if="isHideLike">
          <span class="tab-title">喜欢</span>
          <span class="tab-video-num" v-if="!isHideLike">
            {{ likeCount }}
          </span>
          <svg-icon icon="lock" class="icon" v-if="isHideLike" />
        </template>

        <template v-if="!isHideLike">
          <Loading :show="videoStore().loading">
            <user-like />
          </Loading>
        </template>
        <template v-if="isHideLike">
          <el-empty
            image="https://lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/EmptyList.82c3fe11.png"
          >
            <div class="title">喜欢内容不可见</div>
            <div class="subtitle">该用户已将喜欢设为私密</div>
          </el-empty>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.user-tab {
  background-color: var(--color-bg-b0);

  .tab-title {
    margin-right: 6px;
  }

  .icon {
    width: 14px;
    height: 16px;
  }
  :deep(.el-tabs__header) {
    height: 64px;
    margin: 0 auto;
    width: 100%;
    border-bottom: 1px solid var(--color-line-l3);
    display: flex;
    align-items: center;
    background-color: var(--color-bg-b0);
  }
  :deep(.el-empty__image) {
    background-size: 100% 100%;
    height: 158px;
    width: 236px;
  }
  :deep(.el-empty__description) {
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
  //下拉样式
  :deep(.el-tabs__header).header-scroll {
    left: 0;
    min-width: 650px;
    position: fixed;
    right: 0;
    top: 60px;
    transform: translateZ(0);
    z-index: 1;
  }

  @media (min-width: 1475px) {
    :deep(.el-tabs__header).header-scroll {
      padding: 0px 166.333px 0px 332.667px;
    }
  }

  @media (max-width: 1475px) {
    :deep(.el-tabs__header).header-scroll {
      padding: 0px 26px 0px 230px;
    }
  }
  @media (max-width: 1328px) {
    :deep(.el-tabs__header).header-scroll {
      padding: 0px 66px 0px 220px;
    }
  }

  @media (max-width: 1200px) {
    :deep(.el-tabs__header).header-scroll {
      padding: 0px 66px 0px 132px;
    }
  }
  // @media (max-width: 840px) {
  //   :deep(.el-tabs__header).header-scroll {
  //     padding: 0px 26px 0px 94px;
  //   }
  // }
  :deep(.el-tabs__item.is-active) {
    color: var(--color-text-t0);
  }
  :deep(.el-tabs__item:hover) {
    color: none;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }

  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs__item) {
    border-bottom: none;
    height: 100%;
    color: var(--color-text-t4);
    font-size: 18px;
    line-height: 26px;
    font-weight: normal;
  }
  :deep(.el-tabs__active-bar) {
    height: 0;
  }

  :deep(.el-tabs__content) {
    flex: none;
    width: 100%;
    height: 100%;
  }
  :deep(.el-tabs__nav) {
    z-index: unset;
  }
}
</style>
