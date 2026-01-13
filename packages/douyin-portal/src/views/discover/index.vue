<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { UserTab } from '@/components/user'
import ErrorPage from '@/components/common/error-page/index.vue'
import DiscoverList from './discover-list.vue'

// Tab 配置
interface TabItem {
  id: string
  name: string
  tag_id?: string
}

const tabsConfig: TabItem[] = [
  { id: 'all', name: '全部' },
  { id: 'education', name: '公开课', tag_id: '1' },
  { id: 'game', name: '游戏', tag_id: '300205' },
  { id: 'anime', name: '二次元', tag_id: '300206' },
  { id: 'music', name: '音乐', tag_id: '300209' },
  { id: 'movie', name: '影视', tag_id: '300215' },
  { id: 'food', name: '美食', tag_id: '300204' },
  { id: 'knowledge', name: '知识', tag_id: '300213' },
  { id: 'drama', name: '小剧场', tag_id: '300214' },
  { id: 'vlog', name: '生活vlog', tag_id: '300216' },
  { id: 'sports', name: '体育', tag_id: '300207' },
  { id: 'travel', name: '旅行', tag_id: '300221' },
  { id: 'parenting', name: '亲子', tag_id: '300217' },
  { id: 'animal', name: '动物', tag_id: '300220' },
  { id: 'agriculture', name: '三农', tag_id: '300219' },
  { id: 'car', name: '汽车', tag_id: '300218' },
  { id: 'fashion', name: '美妆穿搭', tag_id: '300222' }
]

// Tab ID 列表
const tabs = tabsConfig.map((t) => t.id)

// 当前选中的 Tab
const activeTab = ref('all')

// 加载状态
const loadError = ref(false)

// 获取当前 Tab 的 tag_id
const currentTagId = computed(() => {
  const tab = tabsConfig.find((t) => t.id === activeTab.value)
  return tab?.tag_id
})

// discover-list 组件 ref
const discoverListRef = ref<InstanceType<typeof DiscoverList> | null>(null)

// Tab 切换
const handleTabChange = (tabId: string) => {
  if (activeTab.value === tabId) return
  activeTab.value = tabId
  // 滚动到顶部
  const contentEl = document.querySelector('.discover-tab-content')
  if (contentEl) {
    contentEl.scrollTo(0, 0)
  }
}

// 滚动加载更多（监听内容区滚动）
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  if (scrollHeight - scrollTop - clientHeight < 200) {
    discoverListRef.value?.loadMore()
  }
}

onMounted(() => {
  window.addEventListener('resize', updateScrollState)
  // 延迟初始化，确保 DOM 完全渲染
  setTimeout(() => {
    updateScrollState()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScrollState)
})

// 子组件加载完成
const handleLoaded = () => {
  loadError.value = false
}

// 子组件加载错误
const handleError = () => {
  loadError.value = true
}

// 重试加载
const handleRetry = () => {
  loadError.value = false
  discoverListRef.value?.retry()
}

// Tab 滚动相关
const tabBarRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)
const showSwitchBtns = ref(false)

const updateScrollState = () => {
  const tabBar = document.querySelector('.discover-tab-bar') as HTMLElement
  if (tabBar) {
    // 检查是否需要显示切换按钮（内容超出容器宽度）
    const needScroll = tabBar.scrollWidth > tabBar.clientWidth
    showSwitchBtns.value = needScroll
    canScrollLeft.value = tabBar.scrollLeft > 0
    // 判断是否可以继续向右滚动，需要考虑切换按钮遮挡的宽度（90px）
    const switchBtnWidth = 90
    const maxScrollLeft =
      tabBar.scrollWidth - tabBar.clientWidth + switchBtnWidth
    canScrollRight.value = tabBar.scrollLeft < maxScrollLeft - 1
  }
}

const scrollTabs = (direction: 'left' | 'right') => {
  // 检查是否可以滚动
  if (direction === 'left' && !canScrollLeft.value) return
  if (direction === 'right' && !canScrollRight.value) return

  const tabBar = document.querySelector('.discover-tab-bar') as HTMLElement
  if (tabBar) {
    const scrollAmount = 200
    tabBar.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    setTimeout(updateScrollState, 300)
  }
}
</script>

<template>
  <div class="discover">
    <!-- 加载错误 -->
    <error-page
      v-if="loadError"
      :show="false"
      title="加载失败"
      description="请检查网络连接后重试"
      image="noNetwork-image"
      :style="{ height: '100%' }"
    >
      <template #actionBtns>
        <button class="retry-btn" @click="handleRetry">重新加载</button>
      </template>
    </error-page>

    <!-- 正常内容 -->
    <template v-else>
      <!-- Tab 栏 -->
      <user-tab
        :tabs="tabs"
        :activeTab="activeTab"
        :onTabChange="handleTabChange"
        class="discover-tab-bar"
        @scroll="updateScrollState"
      >
        <template v-slot:all>
          <span class="tabs-text">全部</span>
        </template>
        <template v-slot:education>
          <span class="tabs-text">公开课</span>
        </template>
        <template v-slot:game>
          <span class="tabs-text">游戏</span>
        </template>
        <template v-slot:anime>
          <span class="tabs-text">二次元</span>
        </template>
        <template v-slot:music>
          <span class="tabs-text">音乐</span>
        </template>
        <template v-slot:movie>
          <span class="tabs-text">影视</span>
        </template>
        <template v-slot:food>
          <span class="tabs-text">美食</span>
        </template>
        <template v-slot:knowledge>
          <span class="tabs-text">知识</span>
        </template>
        <template v-slot:drama>
          <span class="tabs-text">小剧场</span>
        </template>
        <template v-slot:vlog>
          <span class="tabs-text">生活vlog</span>
        </template>
        <template v-slot:sports>
          <span class="tabs-text">体育</span>
        </template>
        <template v-slot:travel>
          <span class="tabs-text">旅行</span>
        </template>
        <template v-slot:parenting>
          <span class="tabs-text">亲子</span>
        </template>
        <template v-slot:animal>
          <span class="tabs-text">动物</span>
        </template>
        <template v-slot:agriculture>
          <span class="tabs-text">三农</span>
        </template>
        <template v-slot:car>
          <span class="tabs-text">汽车</span>
        </template>
        <template v-slot:fashion>
          <span class="tabs-text">美妆穿搭</span>
        </template>
        <template v-slot:taba-content>
          <div class="discover-tab-content" @scroll="handleScroll">
            <discover-list
              :key="activeTab"
              ref="discoverListRef"
              :tagId="currentTagId"
              @loaded="handleLoaded"
              @error="handleError"
            />
          </div>
        </template>
      </user-tab>
      <div class="tab-switch-wrapper" v-if="showSwitchBtns">
        <div class="tab-switch-btns">
          <svg
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="switch-btn"
            :class="{ disabled: !canScrollLeft }"
            viewBox="0 0 20 20"
            @click="scrollTabs('left')"
          >
            <circle
              cx="10"
              cy="10"
              r="10"
              transform="matrix(-1 0 0 1 20 0)"
            ></circle>
            <path
              d="M11.14 6.162a.857.857 0 0 1 1.212 1.212L9.847 9.879l2.505 2.505a.857.857 0 1 1-1.212 1.213l-3.104-3.105-.007-.007a.857.857 0 0 1 0-1.212l3.111-3.111z"
            ></path>
          </svg>
          <svg
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="switch-btn"
            :class="{ disabled: !canScrollRight }"
            viewBox="0 0 20 20"
            @click="scrollTabs('right')"
          >
            <circle cx="10" cy="10" r="10"></circle>
            <path
              d="M9.241 6.162a.857.857 0 0 0-1.212 1.212l2.505 2.505-2.505 2.505a.857.857 0 0 0 1.212 1.213l3.104-3.105.007-.007a.857.857 0 0 0 0-1.212L9.241 6.162z"
            ></path>
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.discover {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  --jx-card-gap: 20px;
  --jx-margin-gap: 30px;
}

:deep(.discover-tab-bar) {
  margin-left: var(--jx-margin-gap);
  margin-right: calc(var(--jx-margin-gap) + 6px);
  width: calc(100% - 2 * var(--jx-margin-gap) - 6px);
  white-space: nowrap;
  scrollbar-width: none;
  padding: 12px 0 20px;
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  flex-shrink: 0;

  .tabs-item:last-child {
    margin-right: 90px !important;
  }
}

:deep(.user-tab-content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// Tab 切换按钮外层容器
.tab-switch-wrapper {
  height: 52px;
  margin-right: calc(var(--jx-margin-gap) + 6px);
  box-sizing: border-box;
  z-index: 100;
  padding: 12px 0 20px;
  position: absolute;
  top: 0;
  right: 0;
  width: 90px;
  background: var(--tab-switch-bg);
  justify-content: flex-end;
  align-items: center;
  display: flex;
}

// Tab 切换按钮
.tab-switch-btns {
  width: 56px;
  height: 100%;
  align-items: center;
  display: flex;

  .switch-btn {
    cursor: pointer;

    &:last-child {
      margin-left: 16px;
    }

    circle {
      fill: var(--color-secondary-default);
      fill-opacity: 1;
    }

    path {
      fill: var(--color-text-t0);
      fill-opacity: 1;
    }

    &.disabled {
      cursor: not-allowed;

      circle {
        fill: var(--switch-btn-disable-bg, rgba(242, 242, 244, 0.08));
      }

      path {
        fill-opacity: 0.34;
      }
    }
  }
}

.discover-tab-content {
  flex: 1;
  scrollbar-gutter: stable;
  flex-direction: column;
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.tabs-text {
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
}

// 重试按钮
.retry-btn {
  padding: 8px 24px;
  font-size: 16px;
  color: var(--color-text-t1);
  background-color: var(--color-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
</style>
