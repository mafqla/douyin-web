<script lang="ts" setup>
import { settingStore } from '@/stores/setting'
import { videosCtrolStore } from '@/stores/videos-control'
import { computed, toRef, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuRoutes } from '@/router/routes'
import CoopPanel from './coop-panel.vue'
import { DyPopover } from '@/components/ui/popover'

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
    return (
      menu.path === currentPath ||
      menu.path === firstSegment ||
      menu.path === twoSegments
    )
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
  const targetPath =
    menu.path === '/user/self' ? `${menu.path}?showTab=like` : menu.path
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
  return (
    menu.path === '/' &&
    isRecommendPage.value &&
    hoveredMenuPath.value === menu.path
  )
}
</script>

<template>
  <div class="sidebar">
    <div
      class="sidebar__container"
      :style="isSearchPage ? { background: 'unset' } : {}"
    >
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
                  </div>
                  <!-- 推荐页刷新按钮 -->
                  <div
                    class="nav-menu__refresh-btn"
                    :class="{
                      'nav-menu__refresh-btn--refreshing': isRefreshing
                    }"
                    v-if="shouldShowRefreshBtn(menu)"
                    @click="handleRefreshClick"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      class="RVV0407m"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.745 8a7 7 0 1 0 .746 6.625 1 1 0 1 1 1.854.75A9.003 9.003 0 0 1 3 12a9 9 0 0 1 16-5.657V5a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1h-4a1 1 0 1 1 0-2h1.745z"
                        fill="currentColor"
                        fill-opacity="1"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div
                class="nav-menu__divider"
                v-if="shouldShowDivider(index)"
              ></div>
            </template>
          </div>

          <div class="sidebar__footer">
            <DyPopover
              position="topLeft"
              trigger="hover"
              :z-index="100"
              :theme="false"
              :popover-style="{ left: '-24px', boxShadow: 'unset' }"
            >
              <div class="footer-action" title="设置">
                <div
                  class="footer-action__icon footer-action__icon--setting footer-action__icon--light"
                  v-if="currentTheme === 'light'"
                ></div>
                <div
                  class="footer-action__icon footer-action__icon--setting footer-action__icon--dark"
                  v-if="currentTheme === 'dark'"
                ></div>
              </div>
              <template #content>
                <coop-panel />
              </template>
            </DyPopover>
            <div class="footer-action" title="业务合作">
              <div
                class="footer-action__icon footer-action__icon--coop footer-action__icon--light"
                v-if="currentTheme === 'light'"
              ></div>
              <div
                class="footer-action__icon footer-action__icon--coop footer-action__icon--dark"
                v-if="currentTheme === 'dark'"
              ></div>
            </div>
            <div class="footer-action" title="帮助">
              <div class="footer-action__icon footer-action__icon--help">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  focusable="false"
                  id="douyin-sidebar-new"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.9999 4.75C7.99575 4.75 4.74976 7.99599 4.74976 12.0001C4.74976 16.0043 7.99575 19.2502 11.9999 19.2502C16.004 19.2502 19.25 16.0043 19.25 12.0001C19.25 10.5774 18.841 9.2525 18.1344 8.13394C16.8488 6.0989 14.5816 4.75 11.9999 4.75ZM3.24976 12.0001C3.24976 7.16756 7.16732 3.25 11.9999 3.25C15.1176 3.25 17.8537 4.88105 19.4025 7.33284C20.2561 8.68408 20.75 10.2856 20.75 12.0001C20.75 16.8327 16.8324 20.7502 11.9999 20.7502C7.16732 20.7502 3.24976 16.8327 3.24976 12.0001ZM8.25 10C8.25 7.92894 9.92894 6.25 12 6.25C14.0711 6.25 15.75 7.92894 15.75 10C15.75 11.8142 14.4617 13.3275 12.75 13.675V14.5H11.25V13C11.25 12.5858 11.5858 12.25 12 12.25C13.2426 12.25 14.25 11.2426 14.25 10C14.25 8.75736 13.2426 7.75 12 7.75C10.7574 7.75 9.75 8.75736 9.75 10H8.25ZM13.25 16.5625C13.25 17.2528 12.6903 17.8125 12 17.8125C11.3097 17.8125 10.75 17.2528 10.75 16.5625C10.75 15.8722 11.3097 15.3125 12 15.3125C12.6903 15.3125 13.25 15.8722 13.25 16.5625Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
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
    height: 72px;
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
    height: calc(100vh - var(--header-height) - 122px);
    position: relative;
    overflow: hidden;
  }

  &__footer {
    box-shadow: none;
    width: var(--navigation-width);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    display: flex;
    z-index: 2;
    background-color: var(--color-bg-b0);
    position: fixed;
    bottom: 0;
  }
}

.douyin-navigation {
  background-position: 0 100%;
  background-size: cover;
  height: calc(100vh - var(--header-height) - 136px - 20px);
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
}

.nav-menu {
  display: flex;
  flex-direction: column;
  user-select: none;

  .nav-menu__item {
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

  .nav-menu__item-inner {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 6px 8px;
    width: 100%;
    position: relative;
  }

  .nav-menu__icon {
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

  .nav-menu__title-wrapper {
    display: flex;
    align-self: center;
    line-height: 1;
    margin-top: 0;
    position: relative;
  }

  .nav-menu__title {
    color: var(--color-text-t2);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    margin-top: -4px;
    max-width: 70px;
  }

  .nav-menu__refresh-btn {
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;
    margin: 0 4px 0 auto;

    svg {
      width: 100%;
      height: 100%;
      path {
        fill: var(--color-text-t0);
      }
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

  .nav-menu__divider {
    border-bottom: 1px solid var(--color-line-l3);
    height: 1px;
    margin: 8px 18px 0px;
    width: 112px;
  }
}

.footer-action {
  width: 32px;
  height: 32px;
  color: var(--color-text-t3);
  cursor: pointer;
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  display: flex;
  position: relative;

  &:hover {
    background: var(--color-fill-hover);

    .footer-action__icon {
      opacity: 1;

      svg {
        opacity: 1;
      }
    }
  }

  .footer-action__icon {
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

    &--coop {
      background-position: -864px center;
    }

    &--help {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;

      svg {
        width: 100%;
        height: 100%;
        color: var(--color-text-t1);
      }
    }
  }
}

@media (min-width: 1240px) {
  .sidebar {
    flex-basis: $sidebar-width;

    .sidebar__container {
      width: $sidebar-width;
    }

    .sidebar__logo {
      flex-basis: $sidebar-width !important;

      &-link {
        background: var(--logo-url) no-repeat !important;
        background-size: 72px 28px !important;
        height: 28px !important;
        opacity: 1 !important;
        width: 91px !important;
      }
    }

    .sidebar__content {
      height: calc(100vh - var(--header-height) - 88px);
    }
  }

  .douyin-navigation {
    width: $sidebar-width !important;
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

  .sidebar__footer {
    width: var(--navigation-expend-width);
    height: 60px;
    gap: 8px;
    justify-content: unset;
    align-items: unset;
    flex-direction: row;
    padding: 14px 0 14px 24px;
  }

  .footer-action {
    flex-direction: row;
    justify-self: start;
    margin: 0;
    padding: 4px;
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
