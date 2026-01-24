<script setup lang="ts">
import type { ICoCreator } from '@/api/tyeps/common/aweme'

defineProps<{
  visible: boolean
  creators: ICoCreator[]
}>()

const emit = defineEmits<{
  close: []
}>()

// 获取创作者角色标签
const getCreatorRole = (index: number) => {
  if (index === 0) return '作者'
  if (index === 1 || index === 2) return '导演'
  return '参演'
}

// 处理关注
const handleFollow = (creator: ICoCreator) => {
  // TODO: 实现关注逻辑
  console.log('关注:', creator.nickname)
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="co-creators-modal-overlay" @click="closeModal">
        <div class="co-creators-modal" @click.stop>
          <!-- 头部 -->
          <div class="modal-header">
            <div class="modal-title">{{ creators.length }}人共同创作</div>
            <svg 
              width="36" 
              height="36" 
              xmlns="http://www.w3.org/2000/svg" 
              class="modal-close-icon" 
              viewBox="0 0 36 36"
              @click="closeModal"
            >
              <path d="M22.133 23.776a1.342 1.342 0 1 0 1.898-1.898l-4.112-4.113 4.112-4.112a1.342 1.342 0 0 0-1.898-1.898l-4.112 4.112-4.113-4.112a1.342 1.342 0 0 0-1.898 1.898l4.113 4.112-4.113 4.113a1.342 1.342 0 0 0 1.898 1.898l4.113-4.113 4.112 4.113z"fill="currentColor" ></path>
            </svg>
          </div>

          <!-- 分割线 -->
          <div class="modal-divider modal-divider-top"></div>

          <!-- 创作者列表 -->
          <div class="modal-content">
            <template v-for="(creator, index) in creators" :key="creator.uid">
              <div class="creator-item">
                <div class="creator-avatar-wrapper">
                  <a 
                    :href="`/user/${creator.sec_uid}`" 
                    class="creator-link"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <div class="creator-avatar">
                      <img :src="creator.avatar_thumb.url_list[0]" :alt="`${creator.nickname}头像`" />
                    </div>
                  </a>
                </div>
                
                <div class="creator-info">
                  <div class="creator-name-wrapper">
                    <div class="creator-name-row">
                      <a 
                        :href="`/user/${creator.sec_uid}`" 
                        class="creator-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <span class="creator-nickname">{{ creator.nickname }}</span>
                      </a>
                      <div class="creator-role-tag">{{ getCreatorRole(index) }}</div>
                    </div>
                  </div>
                </div>

                <div class="creator-action">
                  <button 
                    v-if="creator.follow_status === 0"
                    class="follow-button" 
                    @click="handleFollow(creator)"
                  >
                    <div class="follow-button-text">关注</div>
                  </button>
                </div>
              </div>
              
              <div v-if="index < creators.length - 1" class="modal-divider"></div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
// 弹窗遮罩层
.co-creators-modal-overlay {
  width: 100%;
  height: 100%;
  background: var(--color-mask-m1);
  z-index: 9999;
  justify-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
}

// 弹窗主体
.co-creators-modal {
  width: 408px;
  height: 589px;
  background: var(--color-bg-b1);
  border-radius: 16px;
  flex-direction: column;
  align-items: center;
  animation: 0.4s cubic-bezier(0.34, 0.69, 0.1, 1) modal-scale, 0.2s linear modal-opacity;
  display: flex;
  position: relative;
}

// 弹窗头部
.modal-header {
  width: 100%;
  height: 54px;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  display: flex;
  position: absolute;
}

.modal-title {
  color: var(--color-text-t1);
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
}

.modal-close-icon {
  cursor: pointer;
}

// 分割线
.modal-divider {
  border-top-color: rgba(22, 24, 35, 0.06);
  border-top-color: var(--color-line-l3);
  margin: 0;
  border-top-style: solid;
  border-top-width: 1px;
}

.modal-divider-top {
  height: 1px;
  width: 408px;
  background: rgba(22, 24, 35, 0.1);
  background: var(--color-line-l3);
  border-top-color: rgba(22, 24, 35, 0.1);
  border-top-color: var(--color-line-l3);
  position: absolute;
  top: 54px;
  margin-top: 0 !important;
}

// 内容区域
.modal-content {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  height: calc(100% - 84px);
  width: calc(100% - 48px);
  flex-direction: column;
  display: flex;
  position: relative;
  top: 54px;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

// 创作者项
.creator-item {
  align-items: center;
  margin: 12px 0;
  display: flex;
}

.creator-avatar-wrapper {
  cursor: pointer;
}

.creator-avatar {
  width: 40px;
  height: 40px;
  box-sizing: content-box;
  border-radius: 50%;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(22, 24, 35, 0.06) !important;
  border: 1px solid var(--color-line-l3) !important;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
  }
}

.creator-link {
  text-decoration: none;
}

.creator-info {
  width: 0;
  flex: 1;
  margin: 0 12px;
}

.creator-name-wrapper {
  max-width: 231px;
  margin: 4px 0;
  display: flex;
}

.creator-name-row {
  color: #161823;
  color: var(--color-text-t1);
  align-items: center;
  display: flex;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.creator-nickname {
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  overflow: hidden;
  color: #161823;
  color: var(--color-text-t1);
}

.creator-role-tag {
  color: var(--color-text-t1);
  background-color: var(--tag-bg, #eff0f3);
  border-radius: 3px;
  margin-left: 4px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 20px;
}

:root[dark] .creator-role-tag {
  --tag-bg: #40424b;
}

.creator-action {
  width: auto;
  justify-content: center;
  align-items: center;
  display: flex;
}

.follow-button {
  min-width: 68px;
  width: 68px;
  height: 32px;
  background: var(--color-primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

.follow-button-text {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

// 动画
@keyframes modal-scale {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

@keyframes modal-opacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// 过渡动画
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .co-creators-modal {
  animation: 0.4s cubic-bezier(0.34, 0.69, 0.1, 1) modal-scale;
}

.modal-fade-leave-active .co-creators-modal {
  animation: 0.2s cubic-bezier(0.34, 0.69, 0.1, 1) modal-scale reverse;
}
</style>
