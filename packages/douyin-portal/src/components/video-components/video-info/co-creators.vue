<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ICoCreator } from '@/api/tyeps/common/aweme'
import { SvgIcon } from '@/components/common'
import CoCreatorsModal from './co-creators-modal.vue'

const props = defineProps<{
  creators: ICoCreator[]
}>()

const showModal = ref(false)

// 显示的创作者列表（前4个）
const displayedCreators = computed(() => {
  if (props.creators.length <= 4) {
    return props.creators
  }
  return props.creators.slice(0, 4)
})

// 是否显示省略按钮
const showEllipsis = computed(() => {
  return props.creators.length > 4
})

// 打开弹窗
const openModal = () => {
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div v-if="creators.length > 0" class="co-creators-container">
    <ul class="co-creators-list">
      <li v-for="creator in displayedCreators" :key="creator.uid" class="co-creator-item">
        <div class="co-creator-avatar-wrapper">
          <a 
            :href="`/user/${creator.sec_uid}`" 
            class="co-creator-avatar-link"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span class="co-creator-avatar">
              <img :src="creator.avatar_thumb.url_list[0]" :alt="creator.nickname" />
            </span>
          </a>
          <!-- 关注按钮 -->
          <div v-if="creator.follow_status === 0" class="co-creator-follow-btn">
            <SvgIcon class="icon" icon="avfollow" />
          </div>
        </div>
        <div class="co-creator-name">
          <span class="co-creator-nickname">{{ creator.nickname }}</span>
        </div>
      </li>
    </ul>
    
    <!-- 省略按钮 -->
    <div v-if="showEllipsis" class="ellipsis-item" @click="openModal">
      <div class="ellipsis-wrapper">
        <div class="ellipsis-button">
          <span role="img" class="ellipsis-icon">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false">
              <path d="M13.5556 17.7778C13.5556 18.7596 12.7596 19.5556 11.7778 19.5556C10.7959 19.5556 10 18.7596 10 17.7778C10 16.7959 10.7959 16 11.7778 16C12.7596 16 13.5556 16.7959 13.5556 17.7778Z" fill="currentColor"></path>
              <path d="M19.7778 17.7778C19.7778 18.7596 18.9818 19.5556 18 19.5556C17.0182 19.5556 16.2222 18.7596 16.2222 17.7778C16.2222 16.7959 17.0182 16 18 16C18.9818 16 19.7778 16.7959 19.7778 17.7778Z" fill="currentColor"></path>
              <path d="M24.2222 19.5556C25.2041 19.5556 26 18.7596 26 17.7778C26 16.7959 25.2041 16 24.2222 16C23.2404 16 22.4444 16.7959 22.4444 17.7778C22.4444 18.7596 23.2404 19.5556 24.2222 19.5556Z" fill="currentColor"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- 共创者弹窗 -->
    <CoCreatorsModal 
      :visible="showModal" 
      :creators="creators" 
      @close="closeModal" 
    />
  </div>
</template>

<style lang="scss" scoped>
.co-creators-container {
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  gap: 16px;

  .co-creators-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 16px;
  }

  .co-creator-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .co-creator-avatar-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .co-creator-avatar-link {
    display: block;
    text-decoration: none;
  }

  .co-creator-avatar {
    display: block;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    padding: 2px;
    background: linear-gradient(135deg, var(--color-primary), rgba(var(--cyan-400), 1));

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      background-color: var(--color-bg-b0);
    }
  }

  .co-creator-follow-btn {
    position: absolute;
    bottom: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 20px;
      height: 20px;
      color: var(--color-const-text-white);
    }
  }

  .co-creator-name {
    margin-top: 4px;
    max-width: 56px;
    text-align: center;
  }

  .co-creator-nickname {
    font-size: 12px;
    color: var(--color-const-text-white);
    text-shadow: 0 0 1px var(--color-mask-m3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  // 省略按钮样式
  .ellipsis-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }

  .ellipsis-wrapper {
    cursor: pointer;
    transition: transform 0.2s linear;
    display: flex;
  }

  .ellipsis-button {
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    display: flex;

    .ellipsis-icon {
      font-size: 32px;
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        display: block;
      }
    }
  }

  .ellipsis-item:hover .ellipsis-wrapper {
    transform: scale(1.2);
  }

  .ellipsis-item:hover .ellipsis-button {
    background: rgba(255, 255, 255, 0.3);

    .ellipsis-icon {
      color: #fff;
    }
  }

  // 响应式样式
  @media screen and (max-width: 1440px) {
    .ellipsis-button {
      width: 38px;
      height: 38px;

      .ellipsis-icon {
        font-size: 32px;
      }
    }
  }

  @media screen and (min-width: 1440px) and (max-width: 1920px) {
    .ellipsis-button {
      width: calc(0.833333vw + 26px);
      height: calc(0.833333vw + 26px);

      .ellipsis-icon {
        width: calc(0.833333vw + 6px);
        height: calc(0.833333vw + 6px);
      }
    }
  }

  @media screen and (min-width: 1920px) {
    .ellipsis-button {
      width: 42px;
      height: 42px;

      .ellipsis-icon {
        width: 22px;
        height: 22px;
      }
    }
  }
}
</style>
