<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
</script>

<template>
  <div class="carousel-controls">
    <div class="xgplayer-playswitch-tab">
      <div class="xgplayer-playswitch-prev" :class="{ disabled: videosCtrolStore().activeVideoIndex === 0 }"
        @click="videosCtrolStore().handlePrev()">
        <svg-icon class="icon" icon="video-switch-prev-arrow" />
      </div>
      <div class="xgplayer-playswitch-next" :class="{
        disabled: videosCtrolStore().stopScroll
      }" @click="
        videosCtrolStore().stopScroll === true
          ? null
          : videosCtrolStore().handleNext()
        ">
        <svg-icon class="icon" icon="video-switch-next-arrow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-controls {
  width: 100%;
  height: 100%;

  .xgplayer-playswitch-tab {
    background-color: var(--color-bg-b1-white);
    height: 88px;
    opacity: 0.7;
    position: relative;
    width: 44px;
    border-radius: 22px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .06);


    &:hover {
      opacity: 0.9;
    }

    .xgplayer-playswitch-prev {
      height: 44px;
      position: absolute;
      top: 0px;
      width: 44px;
      cursor: pointer;
      opacity: 0.7;

      .icon {
        // left: 5px;
        left: 9px;
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
      height: 40px;
      opacity: 0.7;
      position: absolute;
      width: 36px;
      cursor: pointer;

      .icon {
        // left: 5px;
        left: 9px;
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

