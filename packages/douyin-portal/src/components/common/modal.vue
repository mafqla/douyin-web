<script setup lang="ts">
import { watchEffect } from 'vue'
const props = defineProps({
  open: Boolean,
  isShowClose: {
    type: Boolean,
    default: false
  }
})

watchEffect(() => {
  if (props.open) {
    document.body.style.overflow = 'hidden'
  } else {
    //移除样式属性
    document.body.style.removeProperty('overflow')
  }
})

const emit = defineEmits(['close'])
</script>
<template>
  <Teleport to="body">
    <div class="modal" v-if="open" @click="$emit('close')">
      <slot />
      <div class="close-btn" v-if="isShowClose" @click="$emit('close')">
        <svg
          width="48"
          height="48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class=""
          viewBox="0 0 48 48"
          id="svg_icon_ic_close"
        >
          <path
            d="M32.801 32.801c-.71.71-1.86.71-2.569 0l-5.565-5.566-5.566 5.566a1.817 1.817 0 01-2.569-2.569l5.566-5.566-5.566-5.565a1.817 1.817 0 012.569-2.57l5.566 5.567 5.566-5.566A1.816 1.816 0 1132.8 19.1l-5.566 5.565 5.566 5.566c.71.71.71 1.86 0 2.57z"
            fill="#fff"
            fill-opacity="0.8"
          ></path>
        </svg>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  // background: rgba(0, 0, 0, 0.6);
  background: var(--color-mask-m1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  width: 64px;
  height: 64px;
  user-select: none;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  top: 35px;
  left: 35px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}
</style>
