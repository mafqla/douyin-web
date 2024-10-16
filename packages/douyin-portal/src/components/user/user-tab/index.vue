<script setup lang="ts">
import {} from 'vue'
import tabsItem from './tabs-item.vue'

const props = defineProps<{
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}>()

// 滚动监听
const { y } = useScroll(window)
const isScroll = ref(false)

watchEffect(() => {
  if (y.value > 160) {
    isScroll.value = true
  } else {
    isScroll.value = false
  }
})
const parentElement = ref<HTMLElement | null>(null)
// 侧边栏宽度
const sidebarWidth = ref<HTMLElement | null>(null)
onMounted(() => {
  parentElement.value = document.querySelector('.user-content')
  sidebarWidth.value = document.querySelector('.aside')
  // console.log(parentElement.value)
})

const paddingStyle = computed(() => {
  if (!isScroll.value) {
    return 'padding: 0px;'
  }
  if (parentElement.value && sidebarWidth.value && isScroll) {
    // 计算左侧空间大小
    const elementOffsetLeft =
      parentElement.value.offsetLeft + sidebarWidth.value.offsetWidth
    const offsetParent = parentElement.value.offsetParent

    // 计算包含元素的总宽度
    const offsetParentWidth = (offsetParent as HTMLElement)?.offsetWidth

    // 计算右侧空间大小
    const elementRightSpace =
      offsetParentWidth -
      (parentElement.value.offsetLeft + parentElement.value.offsetWidth)

    console.log(
      `padding: 0px ${elementRightSpace}px 0px${elementOffsetLeft}px;`
    )
    // 返回样式字符串
    return `padding: 0px ${elementRightSpace}px 0px ${elementOffsetLeft}px;`
  }
})

// 切换标签的处理函数
const handleTabChange = (tab: string) => {
  if (props.onTabChange) {
    props.onTabChange(tab)
  }
}
</script>

<template>
  <div class="user-tabbar" :class="{ scroll: isScroll }" :style="paddingStyle">
    <div class="tabbar-content">
      <div class="tabs-top">
        <div class="tabs-list">
          <tabs-item
            :active="activeTab === tab"
            @click="handleTabChange(tab)"
            v-for="(tab, index) in tabs"
            :key="index"
          >
            <slot :name="tab" />
          </tabs-item>
        </div>
      </div>
      <slot name="tabs-item-left" />
    </div>
  </div>
  <div class="user-tab-content">
    <slot name="taba-content" />
  </div>
</template>

<style lang="scss" scoped>
.user-tabbar {
  --global-bg-img: url(https://lf3-static.bytednsdoc.com/obj/eden-cn/medeh7bmupenuhd/dkw8.jpg);
  --global-bg-img-thin: url(https://lf3-static.bytednsdoc.com/obj/eden-cn/medeh7bmupenuhd/dkt8.jpg);
  background-image: var(--global-bg-img), var(--global-bg-img-thin);
  background-size: 0 0;
  background-color: var(--color-bg-b0);
  width: 100%;
  border-bottom: none;
  align-items: center;
  margin: 0 auto;
  display: flex;
  position: relative;

  &.scroll {
    background-image: var(--global-bg-img),
      linear-gradient(var(--color-bg-b0), var(--color-bg-b0));
    background-size: auto, calc(100% - 500px) 100%;
    background-position: 0 calc(0px - var(--header-height)), right 0;
    background-repeat: no-repeat;
    min-width: 915px;
    top: 60px;
    top: var(--header-height);
    z-index: 3;
    position: fixed;
    left: 0;
    right: 0;
    transform: translateZ(0);
  }

  .tabbar-content {
    width: 100%;
    height: 36px;
    justify-content: space-between;
    align-items: center;
    margin: 11px 0;
    display: flex;
    position: relative;

    .tabs-top {
      box-sizing: border-box;
      position: relative;
      height: 56px;
      display: flex;
      .tabs-list {
        white-space: nowrap;
        outline: none;
        position: relative;
        flex-shrink: 0;
        .tabs-item {
          border-bottom: 3px solid transparent;
          padding: 12px 0;
          font-size: 16px;
          cursor: pointer;
          box-sizing: border-box;
          color: var(--color-tab-text);
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
            Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
            sans-serif;
          font-weight: 400;
          line-height: 20px;
          display: inline-block;
          position: relative;
          margin-right: 24px;
          padding-left: 0;
          &:hover {
            border-bottom: 3px solid var(--color-tab-border-hover);
            color: var(--color-tab-text-active);
          }
          &.tabs-active {
            border-bottom: 3px solid var(--color-primary);
            color: var(--color-tab-text-active);
            font-weight: 600;
            &:hover {
              border-bottom: 3px solid var(--color-primary);
            }
          }

          .tabs-item-content {
            cursor: pointer;
            align-items: center;
            margin-right: 40px;
            display: flex;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}

.user-tab-content {
  position: relative;
  width: 100%;
}
</style>
