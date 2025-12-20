<script setup lang="ts">
import { computed } from 'vue'
import { videosCtrolStore } from '@/stores/videos-control'

const props = withDefaults(
  defineProps<{
    // 是否使用自定义控制（不使用 videosCtrolStore）
    customControl?: boolean
    // 是否禁用上一个按钮
    disablePrev?: boolean
    // 是否禁用下一个按钮
    disableNext?: boolean
  }>(),
  {
    customControl: false,
    disablePrev: false,
    disableNext: false
  }
)

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()

const store = videosCtrolStore()

// 是否禁用上一个
const isPrevDisabled = computed(() => {
  if (props.customControl) {
    return props.disablePrev
  }
  return store.activeVideoIndex === 0
})

// 是否禁用下一个
const isNextDisabled = computed(() => {
  if (props.customControl) {
    return props.disableNext
  }
  return store.stopScroll
})

const handlePrev = () => {
  if (isPrevDisabled.value) return
  if (props.customControl) {
    emit('prev')
  } else {
    store.handlePrev()
  }
}

const handleNext = () => {
  if (isNextDisabled.value) return
  if (props.customControl) {
    emit('next')
  } else {
    store.handleNext()
  }
}
</script>

<template>
  <div class="carousel-controls">
    <div class="xgplayer-playswitch-tab">
      <div
        class="xgplayer-playswitch-prev"
        :class="{ disabled: isPrevDisabled }"
        @click="handlePrev"
      >
        <svg-icon class="icon" icon="video-switch-prev-arrow" />
      </div>
      <div
        class="xgplayer-playswitch-next"
        :class="{ disabled: isNextDisabled }"
        @click="handleNext"
      >
        <svg-icon class="icon" icon="video-switch-next-arrow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-controls {
  // width: 100%;
  // height: 100%;

  .xgplayer-playswitch-tab {
    background-color: var(--color-bg-b1-white);
    //height: 88px;
    opacity: 0.7;
    position: relative;
    //width: 44px;
    border-radius: 18px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .06);

    width: 36px;
    height: 80px;


    &:hover {
      opacity: 0.9;
    }

    .xgplayer-playswitch-prev {
      position: absolute;
      top: 0px;
      cursor: pointer;
      opacity: 0.7;
      height: 40px;
      width: 36px;

      .icon {
        // left: 5px;
        left: 4px;
        position: relative;
        top: 7px;
        height: 26px !important;
        width: 26px !important;
        color: var(  --xgplayer-playswitch-icon);
      }
    }

    .xgplayer-playswitch-prev.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }

    .xgplayer-playswitch-next.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }

    .xgplayer-playswitch-next {
      bottom: 0px;
      opacity: 0.7;
      position: absolute;
      cursor: pointer;
      height: 40px;
      width: 36px;

      .icon {
        // left: 5px;
        left: 4px;
        position: relative;
        top: 7px;
        height: 26px !important;
        width: 26px !important;
        color: var(  --xgplayer-playswitch-icon);
      }
    }

    .xgplayer-playswitch-prev:not(.disabled):hover,
    .xgplayer-playswitch-next:not(.disabled):hover {
      cursor: pointer;
      opacity: 1;
    }
  }
}
</style>

