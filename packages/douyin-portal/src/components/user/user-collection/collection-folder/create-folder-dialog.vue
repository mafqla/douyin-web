<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const show = defineModel<boolean>({ default: false })

const emit = defineEmits(['success'])

// 表单数据
const folderName = ref('')
const isPrivate = ref(false)
const maxLength = 15

// 监听弹框打开/关闭
watchEffect(() => {
  if (show.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.removeProperty('overflow')
  }
})

// 关闭弹框
const close = () => {
  folderName.value = ''
  isPrivate.value = false
  show.value = false
}

// 提交创建
const handleSubmit = async () => {
  if (!folderName.value.trim()) {
    return
  }

  try {
    // TODO: 调用创建收藏夹接口
    // await apis.createCollectFolder({
    //   name: folderName.value,
    //   is_private: isPrivate.value
    // })

    emit('success')
    close()
  } catch (error) {
    console.error('创建收藏夹失败', error)
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="folder-dialog" v-if="show">
      <div class="content">
        <div class="head">
          <h1 class="title">新建收藏夹</h1>

          <svg
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            class="close"
            @click="close"
          >
            <path
              d="M22.133 23.776a1.342 1.342 0 1 0 1.898-1.898l-4.112-4.113 4.112-4.112a1.342 1.342 0 0 0-1.898-1.898l-4.112 4.112-4.113-4.112a1.342 1.342 0 1 0-1.898 1.898l4.113 4.112-4.113 4.113a1.342 1.342 0 0 0 1.898 1.898l4.113-4.113 4.112 4.113z"
              fill="#0A0C20"
            ></path>
          </svg>
        </div>

        <div class="form">
          <!-- 收藏夹名称输入 -->
          <div class="form-item">
            <div class="input-box">
              <input
                v-model="folderName"
                type="text"
                placeholder="请输入收藏夹名称(15个字以内)"
                :maxlength="maxLength"
              />
              <span class="size">{{ folderName.length }}/{{ maxLength }}</span>
            </div>
          </div>

          <!-- 公开设置 -->
          <div class="privacy-item">
            <div class="privacy-left">
              <span class="privacy-label">设置为公开</span>
              <span class="privacy-label-2"
                >公开后有机会被推荐，帮助到更多人</span
              >
            </div>
            <div
              class="privacy-switch"
              :class="{ active: isPrivate }"
              @click="isPrivate = !isPrivate"
            >
              <div class="switch-dot"></div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="btn-content">
            <button
              class="save common"
              :disabled="!folderName.trim()"
              @click="handleSubmit"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.folder-dialog {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--color-mask-m1);
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    background: var(--color-bg-b1);
    border-radius: 16px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: auto;
  }

  .head {
    justify-content: space-between;
    align-items: center;
    display: flex;
    padding: 24px !important;

    .title {
      color: var(--color-text-t1);
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }

    .close {
      cursor: pointer;
      width: 28px;
      height: 28px;

      path {
        fill: var(--color-text-t2);
      }
    }
  }

  .form {
    width: 352px;
    padding: 0 24px !important;
  }

  .form-item {
    margin-top: 24px;
    width: 100%;
    margin-bottom: 16px;

    .form-label {
      color: var(--color-text-t1);
      font-size: 14px;
    }

    .input-box {
      margin-top: 8px;
      position: relative;
      width: 100%;

      input {
        background: var(--color-bg-b2);
        border: none;
        border-radius: 10px;
        caret-color: var(--color-text-t2);
        color: var(--color-text-t1);
        font-size: 14px;
        height: 48px;
        line-height: 40px;
        outline: none;
        padding: 0 60px 0 12px;
        width: 100%;
        box-sizing: border-box;

        &::placeholder {
          color: var(--color-text-t4);
        }

        &:focus {
          background: var(--color-bg-b3);
        }
      }

      .size {
        color: var(--color-text-t4);
        font-size: 12px;
        line-height: 40px;
        position: absolute;
        right: 12px;
        top: 0;
      }
    }
  }

  .privacy-item {
    justify-content: space-between;
    align-items: center;
    display: flex;

    .privacy-left {
      flex-direction: column;
      display: flex;

      .privacy-icon {
        margin-right: 8px;
        font-size: 16px;
        color: var(--color-text-t2);
      }

      .privacy-label {
        color: var(--color-text-t2);
        font-size: 14px;
        line-height: 22px;
      }
      .privacy-label-2 {
        color: var(--color-text-t3);
        font-size: 12px;
        line-height: 20px;
      }
    }
  }

  .privacy-switch {
    width: 44px;
    height: 24px;
    background-color: var(--color-bg-b3);
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s ease;

    &.active {
      background-color: var(--color-primary);

      .switch-dot {
        transform: translateX(20px);
      }
    }

    .switch-dot {
      width: 20px;
      height: 20px;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform 0.2s ease;
    }
  }

  .btn-content {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    display: flex;
    padding: 36px 0 24px !important;

    .common {
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      height: 36px;
      line-height: 22px;
      min-width: 88px;
      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      margin: 0 8px;
      outline: none;
      padding: 0 16px;
      position: relative;
      width: 100%;
    }

    .save {
      background-color: var(--color-primary);
      color: var(--color-const-text-white);
      margin: 0 !important;

      &:hover {
        background-color: var(--color-primary-hover);
      }

      &:disabled {
        background-color: rgba(254, 44, 89, 0.34);
        cursor: not-allowed;
      }
    }

    .cancel {
      background-color: var(--secondary-bg-color);
      color: var(--color-text-t3);
      margin-left: 16px;
    }
  }
}
</style>
