<script setup lang="ts">
import { watchEffect } from 'vue'
import type { ICollectsItem } from '@/api/tyeps/request_response/userCollectsListRes'

const props = defineProps<{
  folder: ICollectsItem | null
}>()

const show = defineModel<boolean>({ default: false })

const emit = defineEmits(['success'])

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
  show.value = false
}

// 确认删除
const handleConfirm = async () => {
  if (!props.folder) {
    return
  }

  try {
    // TODO: 调用删除收藏夹接口
    // await apis.deleteCollectFolder({
    //   collects_id: props.folder.collects_id_str
    // })

    emit('success')
    close()
  } catch (error) {
    console.error('删除收藏夹失败', error)
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="folder-dialog" v-if="show">
      <div class="content">
        <div class="delete-text">
          确认删除该收藏夹吗，删除后视频依旧可在收藏视频中查看～
        </div>
        <!-- 底部按钮 -->
        <div class="btn-content">
          <button class="cancel common" @click="close">暂不删除</button>
          <button class="delete common" @click="handleConfirm">确认删除</button>
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
    width: 320px;
    background: var(--color-bg-b1);
    z-index: 10;
    border-radius: 16px;
    padding: 24px;
    animation: 0.4s cubic-bezier(0.34, 0.69, 0.1, 1) snhrddAe,
      0.2s linear iudJnLeB;
    position: relative;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  }

  .delete-text {
    color: var(--color-text-t1);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  .btn-content {
    justify-content: center;
    display: flex;
    margin-top: 24px;

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
      width: 148px;
    }

    .delete {
      background-color: var(--color-primary);
      color: var(--color-const-text-white);
      margin: 0 !important;

      &:hover {
        background-color: var(--color-primary-hover);
      }
    }

    .cancel {
      background-color: var(--secondary-bg-color);
      color: var(--color-text-t1);
      margin-left: 16px;
    }
  }
}
</style>
