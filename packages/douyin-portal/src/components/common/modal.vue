<script setup lang="ts">
import { watchEffect } from 'vue'
const props = defineProps({
  open: Boolean
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
</style>
