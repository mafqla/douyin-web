<script setup lang="ts">
import { computed } from 'vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'

// 预加载数据类型
interface IFolderPreloadData {
  awemeList: IAwemeInfo[]
  cursor: string
  hasMore: boolean
  loading: boolean
}

const props = defineProps<{
  folder: ICollectsItem
  preloadData?: IFolderPreloadData
  selected?: boolean
  // 是否显示选择框（批量管理模式）
  selectable?: boolean
  // 是否选中（批量管理模式）
  checked?: boolean
}>()

const emit = defineEmits<{
  select: [folder: ICollectsItem]
  edit: [folder: ICollectsItem]
  delete: [folder: ICollectsItem]
  addVideo: [folder: ICollectsItem]
}>()

// 获取前6张封面图片
const coverImages = computed(() => {
  if (!props.preloadData?.awemeList) return []
  return props.preloadData.awemeList
    .slice(0, 6)
    .map((aweme) => {
      // 优先使用视频封面，如果没有则使用动态封面
      return (
        aweme.video?.cover?.url_list?.[0] ||
        aweme.video?.dynamic_cover?.url_list?.[0] ||
        ''
      )
    })
    .filter(Boolean)
})

// 是否正在加载
const isLoading = computed(() => props.preloadData?.loading ?? true)

// 点击选择收藏夹
const handleClick = () => {
  emit('select', props.folder)
}

// 编辑收藏夹
const handleEdit = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('edit', props.folder)
}

// 删除收藏夹
const handleDelete = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('delete', props.folder)
}

// 添加视频
const handleAddVideo = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('addVideo', props.folder)
}
</script>

<template>
  <div class="folfer-item" @click="handleClick">
    <div
      class="folder-item-content"
      :class="{ active: selected, selectable: selectable }"
    >
      <!-- 选择框（批量管理模式） -->
      <div
        v-if="selectable"
        class="folder-checkbox"
        :class="{ checked: checked }"
      >
        <span class="checkbox-icon">
          <svg
            v-show="checked"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            focusable="false"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.4111 7.30848C18.0692 7.81171 18.1947 8.75312 17.6915 9.41119L11.1915 17.9112C10.909 18.2806 10.4711 18.4981 10.0061 18.5C9.54105 18.5019 9.10143 18.288 8.81592 17.9209L5.31592 13.4209C4.80731 12.767 4.92512 11.8246 5.57904 11.316C6.23296 10.8074 7.17537 10.9252 7.68398 11.5791L9.98988 14.5438L15.3084 7.58884C15.8116 6.93077 16.7531 6.80525 17.4111 7.30848Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
      </div>
      <!-- 顶部信息 -->
      <div class="folder-info">
        <div class="folder-info-left">
          <p class="folder-name">{{ folder.collects_name }}</p>
          <span v-if="folder.status !== 1" class="lock-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              focusable="false"
            >
              <path
                d="M7 9V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V9H18C19.1046 9 20 9.89543 20 11V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V11C4 9.89543 4.89543 9 6 9H7ZM15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7V9H15V7Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
        <!-- 更多按钮（非批量模式显示） -->
        <HoverDropdown
          v-if="!selectable"
          placement="auto"
          content-class="more-menu"
        >
          <template #trigger>
            <div class="folder-more-btn">
              <svg
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"
                  fill="#fff"
                  fill-opacity=".5"
                ></path>
              </svg>
            </div>
          </template>
          <template #content>
            <div class="more-menu-item" @click="handleAddVideo">添加视频</div>
            <div class="more-menu-item" @click="handleEdit">编辑收藏夹</div>
            <div class="more-menu-item delete" @click="handleDelete">
              删除收藏夹
            </div>
          </template>
        </HoverDropdown>
      </div>
      <!-- 数量 -->
      <p class="folder-number">
        共<span class="folder-number-count">{{ folder.total_number }}</span
        >作品
      </p>
      <!-- 封面 - 显示前6张图片 -->
      <div class="folder-cover">
        <!-- 加载中状态 -->
        <template v-if="isLoading">
          <div v-for="i in 6" :key="i" class="folder-cover-item loading">
            <div class="cover-img"></div>
          </div>
        </template>
        <!-- 有封面图片 -->
        <template v-else-if="coverImages.length > 0">
          <div v-for="(img, index) in 6" :key="index" class="folder-cover-item">
            <div class="cover-img">
              <img
                v-if="coverImages[index]"
                v-lazy="coverImages[index]"
                :alt="`封面${index + 1}`"
              />
              <!-- 空位占位图标 -->
              <svg
                v-else
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="empty-icon"
                viewBox="0 0 105 120"
              >
                <g opacity=".04">
                  <path
                    d="M89.013 24.055C82.55 19.84 77.883 13.098 76.427 5.238A28.704 28.704 0 0 1 75.939 0H55.31l-.035 82.675c-.345 9.257-7.967 16.689-17.307 16.689-2.902 0-5.636-.726-8.044-1.992-5.517-2.907-9.299-8.692-9.299-15.35 0-9.56 7.783-17.343 17.343-17.343 1.783 0 3.495.297 5.119.803V44.423a38.211 38.211 0 0 0-5.12-.368C17.034 44.055 0 61.088 0 82.027c0 12.848 6.42 24.216 16.213 31.088A37.749 37.749 0 0 0 37.973 120c20.939 0 37.972-17.033 37.972-37.973V40.101a49.054 49.054 0 0 0 28.704 9.227v-20.63a28.56 28.56 0 0 1-15.636-4.643z"
                    fill="#2F3035"
                    fill-opacity=".9"
                  ></path>
                  <path
                    d="M88.74 24.474h0a29.057 29.057 0 0 0 15.409 4.72V48.826a48.547 48.547 0 0 1-27.912-9.131l-.792-.568v42.9c0 20.664-16.81 37.473-37.472 37.473a37.252 37.252 0 0 1-21.473-6.794l-.285.406.285-.406C6.835 105.922.5 94.704.5 82.027c0-20.663 16.81-37.472 37.467-37.472 1.565 0 3.1.117 4.619.307V64.814a17.46 17.46 0 0 0-4.62-.635c-9.835 0-17.842 8.006-17.842 17.842 0 6.853 3.892 12.804 9.566 15.793h0a17.732 17.732 0 0 0 8.277 2.05c9.61 0 17.451-7.646 17.806-17.17V82.676L55.81.5h19.635c.029 1.647.2 3.259.491 4.829 1.483 7.998 6.231 14.857 12.805 19.145z"
                    stroke="#E7E7EC"
                    stroke-opacity=".3"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.folfer-item {
  width: calc(33.33% - 10.8px);
  margin-bottom: 16px;
  margin-right: 16px;
  display: inline-block;

  &:nth-child(3n) {
    margin-right: 0;
  }
}
.folder-item-content {
  overflow: visible !important;
  user-select: none;
  line-height: 0;
  position: relative;
  background-color: var(--color-bg-b1-white);
  cursor: pointer;
  border-radius: 12px;
  padding: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-bg-b2);

    .folder-cover-item {
      background-color: var(--color-bg-b3);

      path {
        fill: var(--color-bg-b2) !important;
        stroke: var(--color-bg-b2) !important;
      }
    }
  }

  // 批量选择模式样式
  &.selectable {
    .folder-checkbox {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
    }
  }
}

// 选择框样式
.folder-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;

  .checkbox-icon {
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: var(--color-text-3);
    transition: all 0.2s ease;
    box-shadow: inset 0 0 0 1px var(--color-text-3);
    border-radius: 4px;
    background: transparent;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  // 选中状态
  &.checked .checkbox-icon {
    background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
    box-shadow: none;
    color: #fff;
  }
}
.folder-info {
  justify-content: space-between;
  align-items: center;
  display: flex;

  .folder-info-left {
    max-width: calc(100% - 18px);
    flex-grow: 1;
    align-items: center;
    display: flex;

    .folder-name {
      color: var(--color-text-1);
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      line-height: 22px;
      overflow: hidden;
    }
    .lock-icon {
      color: #a9aab7;
      margin-left: 2px;
      font-size: 12px;
      text-align: center;
      text-transform: none;
      text-rendering: optimizelegibility;
      fill: currentColor;
      font-style: normal;
      line-height: 0;
      display: inline-block;
    }
  }
}
.folder-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 下拉菜单样式（通过 content-class 传递给 HoverDropdown）
:deep(.more-menu) {
  width: 126px;

  .more-menu-item {
    width: 110px;
    height: 38px;
    text-align: center;
    cursor: pointer;
    background-color: var(--color-bg-b1);
    color: var(--color-text-t3);
    border-radius: 8px;
    font-size: 14px;
    line-height: 38px;

    &:hover {
      color: var(--color-text-t0);
      background-color: var(--color-bg-b2);
    }
  }
}

.folder-number {
  color: var(--color-text-3);
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  .folder-number-count {
    margin: 0 4px;
  }
}
.folder-cover {
  justify-content: space-between;
  display: flex;

  .folder-cover-item {
    width: calc(16.6667% - 6.66667px);
    background-color: var(--color-bg-b2);
    border-radius: 8px;
    transition: all 0.2s;

    .cover-img {
      width: 100%;
      justify-content: center;
      align-items: center;
      padding-top: 100%;
      display: flex;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        position: absolute;
        top: 0;
        left: 0;
      }
      .empty-icon {
        width: 33%;
        margin: auto;
        transition: all 0.2s;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        g {
          opacity: 1;
        }

        path {
          fill: var(--color-bg-b3);
          stroke: var(--color-bg-b3);
        }
      }
    }
  }
}
</style>
