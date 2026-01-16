<script setup lang="ts">
import { computed } from 'vue'
import type { IMixInfo } from '@/api/tyeps/common/mix'
import HoverDropdown from '@/components/common/hover-dropdown/index.vue'
import { useCount } from '@/hooks/useCount'

const props = defineProps<{
  mix: IMixInfo
  // 是否显示选择框（批量管理模式）
  selectable?: boolean
  // 是否选中（批量管理模式）
  checked?: boolean
  // 是否是自己的页面（显示更多操作）
  isSelf?: boolean
}>()

const emit = defineEmits<{
  select: [mix: IMixInfo]
  uncollect: [mix: IMixInfo]
  edit: [mix: IMixInfo]
  manage: [mix: IMixInfo]
  add: [mix: IMixInfo]
}>()

// 获取封面图片
const coverUrl = computed(() => {
  return props.mix.cover_url?.url_list?.[0] || ''
})

// 格式化播放量
const playCount = computed(() => {
  const vv = props.mix.statis?.play_vv || 0
  return useCount(vv)
})

// 更新集数信息
const episodeInfo = computed(() => {
  const statis = props.mix.statis
  if (!statis || !statis.updated_to_episode) return ''
  return `更新至${statis.updated_to_episode}集`
})

// 上次观看信息
const lastWatchInfo = computed(() => {
  // 优先使用 watched_episode 字段
  if (props.mix.watched_episode && props.mix.watched_episode > 0) {
    return `（上次看到${props.mix.watched_episode}集）`
  }
  return ''
})

// 是否有更新标签
const hasUpdate = computed(() => {
  const statis = props.mix.statis
  const watchedEpisode = props.mix.watched_episode || 0
  if (!statis) return false
  // 优先使用 has_updated_episode 字段
  if (statis.has_updated_episode && statis.has_updated_episode > 0) {
    return true
  }
  // 使用 watched_episode 判断是否有更新
  return watchedEpisode > 0 && statis.updated_to_episode > watchedEpisode
})

// 更新集数
const updateCount = computed(() => {
  const statis = props.mix.statis
  const watchedEpisode = props.mix.watched_episode || 0
  if (!statis) return 0
  // 优先使用 has_updated_episode 字段
  if (statis.has_updated_episode && statis.has_updated_episode > 0) {
    return statis.has_updated_episode
  }
  // 使用 watched_episode 计算更新集数
  return statis.updated_to_episode - watchedEpisode
})

// 点击选择合集
const handleClick = () => {
  emit('select', props.mix)
}

// 取消收藏
const handleUncollect = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('uncollect', props.mix)
}

// 修改合集
const handleEdit = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('edit', props.mix)
}

// 作品管理
const handleManage = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('manage', props.mix)
}

// 添加作品
const handleAdd = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  emit('add', props.mix)
}
</script>

<template>
  <div class="mix-item" @click="handleClick">
    <div class="mix-item-content" :class="{ selectable: selectable }">
      <!-- 选择框（批量管理模式） -->
      <div v-if="selectable" class="mix-checkbox" :class="{ checked: checked }">
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

      <!-- 封面区域 -->
      <div class="mix-cover">
        <img v-lazy="coverUrl" :alt="mix.mix_name" class="mix-cover-img" />
      </div>

      <!-- 信息区域 -->
      <div class="mix-info">
        <div class="mix-top">
          <p class="mix-title" :title="mix.mix_name">{{ mix.mix_name }}</p>
          <!-- 更新标签 -->
          <span v-if="hasUpdate" class="update-tag"
            >更新{{ updateCount }}集</span
          >
        </div>
        <p class="mix-stats">{{ playCount }} 播放</p>
        <p class="mix-episode" v-if="episodeInfo">
          {{ episodeInfo
          }}<span v-if="lastWatchInfo" class="last-watch">{{
            lastWatchInfo
          }}</span>
        </p>
      </div>

      <!-- 更多操作（自己的页面显示） -->
      <div v-if="isSelf && !selectable" class="mix-more">
        <HoverDropdown placement="bottom-end" content-class="more-menu">
          <template #trigger>
            <div class="mix-more-btn">
              <svg
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM10.5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0zM5 12a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </template>
          <template #content>
            <div class="more-menu-item" @click="handleEdit">修改合集</div>
            <div class="more-menu-item" @click="handleManage">作品管理</div>
            <div class="more-menu-item" @click="handleAdd">添加作品</div>
          </template>
        </HoverDropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mix-item {
  width: calc(33.33% - 10.8px);
  margin-bottom: 16px;
  margin-right: 16px;
  display: inline-block;

  &:nth-child(3n) {
    margin-right: 0;
  }
}

.mix-item-content {
  width: 100%;
  background-color: var(--color-bg-b1-white);
  user-select: none;
  border-radius: 12px;
  padding: 12px;
  position: relative;
  cursor: pointer;
  display: flex;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-bg-b2);
  }

  &.selectable {
    .mix-checkbox {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 10;
    }
  }
}

// 选择框样式
.mix-checkbox {
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

  &.checked .checkbox-icon {
    background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
    box-shadow: none;
    color: #fff;
  }
}

.mix-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  .mix-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.mix-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .mix-top {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;

    .update-tag {
      flex-shrink: 0;
      background: linear-gradient(135deg, #ff2c55 0%, #ff0050 100%);
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 14px;
    }
  }
  .mix-title {
    color: var(--color-text-t1);
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mix-stats {
    color: var(--color-text-t3);
    font-size: 12px;
    line-height: 20px;
  }

  .mix-episode {
    color: var(--color-text-t3);
    font-size: 12px;
    line-height: 20px;

    .last-watch {
      color: var(--color-text-t3);
    }
  }
}

.mix-more {
  position: absolute;
  top: 12px;
  right: 12px;
  line-height: 0;

  .mix-more-btn {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    color: var(--color-text-t3);
    transition: all 0.2s;

    &:hover {
      background-color: var(--color-bg-b3);
      color: var(--color-text-t1);
    }
  }
}

:deep(.more-menu) {
  width: auto;
  height: auto;
  padding: 8px;
  border-radius: 12px;

  .more-menu-item {
    width: 96px;
    height: 38px;
    text-align: center;
    cursor: pointer;
    background-color: var(--color-bg-b1);
    color: var(--color-text-t2);
    border-radius: 8px;
    font-size: 14px;
    line-height: 38px;

    &:hover {
      color: var(--color-text-t0);
      background-color: var(--color-bg-b2);
    }
  }
}
</style>
