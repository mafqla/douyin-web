<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
</script>

<template>
  <div class="carousel-controls">
    <div class="carousel-controls-switch">
      <div
        class="carousel-controls-switch-up"
        :class="{ disabled: videosCtrolStore().activeVideoIndex === 0 }"
        @click="videosCtrolStore().handlePrev()"
      >
        <svg-icon class="icon" icon="video-switch-prev-arrow" />
      </div>
      <div
        class="carousel-controls-switch-down"
        :class="{
          disabled: videosCtrolStore().stopScroll
        }"
        @click="
          videosCtrolStore().stopScroll === true
            ? null
            : videosCtrolStore().handleNext()
        "
      >
        <svg-icon class="icon" icon="video-switch-next-arrow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-controls {
  width: 100%;
  height: 100%;

  .carousel-controls-switch {
    // background-color: rgb(50, 52, 66);
    background-color: rgba(242, 242, 243, 1);
    height: 88px;
    opacity: 0.7;
    position: relative;
    width: 44px;
    border-radius: 18px;
    &:hover {
      opacity: 0.9;
    }
    .carousel-controls-switch-up {
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
        // color: #fff;
        color: rgba(22, 24, 35, 0.6);
      }
    }
    .carousel-controls-switch-up.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
    .carousel-controls-switch-down.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }

    .carousel-controls-switch-down {
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
        // color: #fff;
        color: rgba(22, 24, 35, 0.6);
      }
    }
  }
}
</style>
