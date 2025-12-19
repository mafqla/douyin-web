<script lang="ts" setup>
import { settingStore } from '@/stores/setting'
import { videosCtrolStore } from '@/stores/videos-control'
import { computed, toRef, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuRoutes } from '@/router/routes'
import CoopPanel from './coop-panel.vue'

// 菜单项类型
interface MenuItem {
  id: string
  title: string
  path: string
  iconOffset: string
  groupId?: number
}

const router = useRouter()
const currentRoute = useRoute()
const currentTheme = toRef(settingStore(), 'theme')
const videosControl = videosCtrolStore()

// 刷新按钮状态
const isRefreshing = ref(false)
const hoveredMenuPath = ref<string | null>(null)

// 从路由配置生成菜单列表
const navMenuList = computed<MenuItem[]>(() => {
  return menuRoutes
    .filter((route) => !route.meta?.hidden)
    .map((route, idx) => ({
      id: String(idx + 1),
      title: route.meta?.title || '',
      path: route.path as string,
      iconOffset: route.meta?.icon || '0',
      groupId: route.meta?.group
    }))
})

// 当前激活的菜单ID
const activeMenuId = computed(() => {
  const currentPath = currentRoute.path
  const matchedIndex = navMenuList.value.findIndex((menu) => {
    const firstSegment = `/${currentPath.split('/')[1]}`
    const twoSegments = `/${currentPath.split('/').slice(1, 3).join('/')}`
    return menu.path === currentPath || menu.path === firstSegment || menu.path === twoSegments
  })
  return matchedIndex >= 0 ? String(matchedIndex + 1) : ''
})

// 是否在搜索页面
const isSearchPage = computed(() => currentRoute.path.includes('search'))

// 是否在推荐页面
const isRecommendPage = computed(() => currentRoute.path === '/')

// 判断是否显示分组分隔线
const shouldShowDivider = (index: number): boolean => {
  const currentItem = navMenuList.value[index]
  const nextItem = navMenuList.value[index + 1]
  return !!nextItem && currentItem.groupId !== nextItem.groupId
}

// 处理菜单点击
const handleMenuClick = (menu: MenuItem) => {
  const targetPath = menu.path === '/user/self' ? `${menu.path}?showTab=like` : menu.path
  router.push(targetPath)
}

// 计算图标背景位置
const getIconPosition = (menu: MenuItem): string => {
  const activeOffset = activeMenuId.value === menu.id ? -24 : 0
  const positionX = parseInt(menu.iconOffset) + activeOffset
  return `${positionX}px 0px`
}

// 处理刷新按钮点击
const handleRefreshClick = (event: Event) => {
  event.stopPropagation()
  if (isRefreshing.value) return

  isRefreshing.value = true
  videosControl.refreshRecommend()

  // 1.5秒后恢复按钮状态
  setTimeout(() => {
    isRefreshing.value = false
  }, 1500)
}

// 处理菜单项鼠标进入
const handleMenuMouseEnter = (path: string) => {
  hoveredMenuPath.value = path
}

// 处理菜单项鼠标离开
const handleMenuMouseLeave = () => {
  hoveredMenuPath.value = null
}

// 判断是否显示刷新按钮
const shouldShowRefreshBtn = (menu: MenuItem): boolean => {
  return menu.path === '/' && isRecommendPage.value && hoveredMenuPath.value === menu.path
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__container" :style="isSearchPage ? { background: 'unset' } : {}">
      <div class="sidebar__header">
        <div class="sidebar__logo">
          <a href="/" class="sidebar__logo-link"></a>
        </div>
      </div>

      <div class="sidebar__content">
        <div class="douyin-navigation">
          <div class="nav-menu">
            <template v-for="(menu, index) in navMenuList" :key="menu.path">
              <div
                class="nav-menu__item"
                :class="{ 'nav-menu__item--active': activeMenuId === menu.id }"
                @click="handleMenuClick(menu)"
                @mouseenter="handleMenuMouseEnter(menu.path)"
                @mouseleave="handleMenuMouseLeave"
              >
                <div class="nav-menu__item-inner">
                  <div
                    class="nav-menu__icon nav-menu__icon--dark"
                    :style="{
                      'background-position': getIconPosition(menu),
                      'background-size': '1152px auto'
                    }"
                    v-show="currentTheme === 'dark'"
                  ></div>
                  <div
                    class="nav-menu__icon nav-menu__icon--light"
                    :style="{
                      'background-position': getIconPosition(menu),
                      'background-size': '1152px auto'
                    }"
                    v-show="currentTheme === 'light'"
                  ></div>
                  <div class="nav-menu__title-wrapper">
                    <span class="nav-menu__title">{{ menu.title }}</span>
                    <!-- 推荐页刷新按钮 -->
                    <div
                      v-if="shouldShowRefreshBtn(menu)"
                      class="nav-menu__refresh-btn"
                      :class="{ 'nav-menu__refresh-btn--refreshing': isRefreshing }"
                      @click="handleRefreshClick"
                      title="刷新推荐"
                    >
                      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                        <path
                          d="M24.932 16.444c0-4.687-3.89-8.444-8.634-8.444a8.679 8.679 0 0 0-7.207 3.79v-1.558a.99.99 0 0 0-1.98 0v4.038c0 .547.444.99.99.99h4.038a.99.99 0 0 0 0-1.98h-1.646c1.137-1.963 3.304-3.3 5.804-3.3 3.7 0 6.655 2.918 6.655 6.464 0 3.547-2.956 6.465-6.655 6.465-2.963 0-5.459-1.88-6.326-4.453a.99.99 0 0 0-1.876.633c1.138 3.38 4.39 5.8 8.202 5.8 4.746 0 8.635-3.758 8.635-8.445z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nav-menu__divider" v-if="shouldShowDivider(index)"></div>
            </template>
          </div>

          <div class="sidebar__footer">
            <el-popover :show-arrow="false" placement="right-start">
              <template #reference>
                <div class="footer-action">
                  <div
                    class="footer-action__icon footer-action__icon--setting footer-action__icon--light"
                    v-if="currentTheme === 'light'"
                  ></div>
                  <div
                    class="footer-action__icon footer-action__icon--setting footer-action__icon--dark"
                    v-if="currentTheme === 'dark'"
                  ></div>
                  <div class="footer-action__label"><span>设置</span></div>
                </div>
              </template>
              <template #default>
                <coop-panel />
              </template>
            </el-popover>
            <div class="footer-action">
              <div
                class="footer-action__icon footer-action__icon--light"
                v-if="currentTheme === 'light'"
              ></div>
              <div
                class="footer-action__icon footer-action__icon--dark"
                v-if="currentTheme === 'dark'"
              ></div>
              <div class="footer-action__label"><span>业务合作</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  flex-basis: $sidebar-width-min;
  flex-shrink: 0;
  position: relative;
  background: var(--color-bg-b0);
  z-index: 200;

  &__container {
    width: $sidebar-width-min;
    background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
    height: 100vh;
    position: fixed;
    z-index: 100;
  }

  &__header {
    height: 68px;
    width: 100%;
    position: relative;
    user-select: none;
  }

  &__logo {
    background: transparent !important;
    align-items: center;
    display: flex;
    flex-basis: $sidebar-width-min;
    flex-shrink: 0;
    height: 165%;
    justify-content: center;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 2;

    &-link {
      -webkit-app-region: no-drag;
      background: var(--logo-small-url) no-repeat;
      height: 34px;
      opacity: 1;
      transition: opacity 0.3s;
      width: 30px;
    }
  }

  &__content {
    z-index: 20;
    height: calc(100vh - var(--header-height) - 64px);
    position: relative;
    overflow: hidden;
  }

  &__footer {
    bottom: 0;
    position: fixed;
    z-index: 2;
    background: var(--color-bg-b0);

    &::before {
      background-color: var(--color-line-l3);
      content: ' ';
      height: 1px;
      left: 8px;
      position: absolute;
      width: calc(100% - 16px);
    }
  }
}

.douyin-navigation {
  background-position: 0 100%;
  background-size: cover;
  bottom: 0;
  height: calc(100% - 68px);
  outline: none;
  width: $sidebar-width-min;
  z-index: 20;
  background: transparent !important;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  overscroll-behavior: contain;
  scrollbar-color: transparent transparent !important;
  position: fixed;
  scrollbar-width: none !important;

  &::-webkit-scrollbar {
    display: none;
  }

  :deep(.el-menu) {
    all: unset;
  }
}

.nav-menu {
  display: flex;
  flex-direction: column;
  user-select: none;

  &__item {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 8px 10px 0;

    &--active,
    &:hover {
      background: var(--color-fill-hover);
      border-radius: 12px;

      span {
        color: var(--color-text-t0) !important;
      }

      .nav-menu__icon {
        opacity: 1 !important;
      }
    }
  }

  &__item-inner {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 6px 8px;
    width: 100%;
    position: relative;
  }

  &__icon {
    height: 24px;
    width: 24px;
    opacity: 0.5;

    &--light {
      background-image: url(@/assets/nav_light-new1.png);
    }

    &--dark {
      background-image: url(@/assets/nav_dark-new1.png);
    }
  }

  &__title-wrapper {
    display: flex;
    align-self: center;
    line-height: 1;
    margin-top: 4px;
    position: relative;
  }

  &__title {
    color: var(--color-text-t2);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    margin-top: -4px;
    max-width: 70px;
  }

  &__refresh-btn {
    width: 18px;
    height: 18px;
    padding: 0;
    margin-left: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-t2);
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;

    svg {
      width: 100%;
      height: 100%;
    }

    &:hover {
      opacity: 1;
    }

    &:active {
      transform: scale(0.9);
    }

    &--refreshing {
      animation: spin 1s linear infinite;
      opacity: 1;
    }
  }

  &__divider {
    border-bottom: 1px solid var(--color-line-l3);
    height: 1px;
    margin: 12px 24px 10px;
    width: 112px;
  }
}

.footer-action {
  color: var(--color-text-t3);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 70px;
  margin: 12px 0;
  padding: 8px 0 8px 8px;

  &:hover {
    background: var(--color-fill-hover);

    .footer-action__icon {
      opacity: 1;
    }
  }

  &__icon {
    background-size: 1152px;
    height: 24px;
    opacity: 0.5;
    width: 24px;
    background-position: -864px center;

    &--light {
      background-image: url(@/assets/nav_light-new1.png);
    }

    &--dark {
      background-image: url(@/assets/nav_dark-new1.png);
    }

    &--setting {
      background-position: -912px center;
    }
  }

  &__label {
    align-items: center;
    display: flex;
    flex-grow: 1;

    span {
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }
  }
}

@media (min-width: 1240px) {
  .sidebar {
    flex-basis: $sidebar-width;

    &__container {
      width: $sidebar-width;
    }

    &__logo {
      flex-basis: $sidebar-width !important;

      &-link {
        background: var(--logo-url) no-repeat !important;
        background-size: 72px 28px !important;
        height: 28px !important;
        opacity: 1 !important;
        width: 91px !important;
      }
    }

    &__content {
      height: calc(100vh - var(--header-height) - 88px);
    }
  }

  .douyin-navigation {
    width: $sidebar-width !important;
    bottom: 2px;
  }

  .nav-menu {
    &__item {
      height: 40px !important;
      margin: 2px 16px 0 !important;
      align-items: flex-end !important;
      flex-direction: row !important;
    }

    &__item-inner {
      padding: 8px 16px !important;
      display: flex !important;
      flex-direction: row !important;
      justify-content: flex-start !important;
    }

    &__icon {
      margin-right: 12px;
    }

    &__title-wrapper {
      align-self: flex-start;
      margin-top: 0 !important;
      position: relative !important;
      word-break: keep-all !important;
    }

    &__title {
      font-size: 16px !important;
      line-height: 26px !important;
      transform: scale(1);
    }
  }

  .footer-action {
    align-items: center !important;
    flex-direction: row !important;
    height: 38px;
    width: 128px !important;
    padding: 8px 0 8px 16px !important;
    margin: 4px 16px !important;

    &__icon {
      margin-right: 12px;
    }

    &__label span {
      margin-right: 4px;
      font-size: 14px;
      line-height: 22px;
    }
  }
}

@media (max-width: 1240px) {
  .footer-action {
    width: 52px;
    height: 52px;
    justify-content: center;
    align-items: center;
    margin: 6px 10px;
    padding: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
