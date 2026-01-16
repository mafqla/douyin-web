<script setup lang="ts">
import {} from 'vue'

defineProps({
  dialogTitle: String
})
const show = defineModel({ default: false, required: true })

const emit = defineEmits(['close'])

const close = () => {
  show.value = false
  emit('close')
}
</script>
<template>
  <Teleport to="body">
    <div class="dy-dialog" v-if="show" @click.self="close">
      <div class="dialog-content">
        <div class="dialog-title">{{ dialogTitle }}</div>
        <svg-icon icon="close" class="icon" @click.self="close" />
        <div
          class="dialog-line"
          style="border-top-style: solid; border-top-width: 1px"
        ></div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.dy-dialog {
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

  .dialog-content {
    width: 408px;
    height: 589px;
    flex-direction: column;
    align-items: center;
    animation-timeline: auto;
    animation-range-start: normal;
    animation-range-end: normal;
    display: flex;
    position: relative;
    background: var(--color-bg-b1);
    border-radius: 16px;
    animation: 0.4s cubic-bezier(0.34, 0.69, 0.1, 1) 0s 1 normal none running
        scaleUp,
      0.2s linear 0s 1 normal none running fadeIn;
  }

  @keyframes scaleUp {
    0% {
      transform: scale(0.8);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .icon {
    position: absolute;
    right: 24px;
    top: 24px;
    cursor: pointer;
    width: 32px;
    height: 32px;
  }

  .dialog-title {
    color: var(--color-text-t1);
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    position: relative;
    top: 20px;
    left: -119px;
  }

  .dialog-line {
    height: 1px;
    width: 408px;
    border-top-color: var(--color-line-l3);
    margin-top: 0px;
    position: absolute;
    top: 54px;
    background: var(--color-line-l3);
    margin: 10px 0px;
  }
}
</style>
