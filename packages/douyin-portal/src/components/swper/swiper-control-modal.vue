<script setup lang="ts">
import { videosCtrolStore } from '@/stores/videos-control'
</script>

<template>
  <div class="xgplayer-playswitch">
    <div class="modal-controls">
      <div class="modal-controls-switch">
        <div
          class="modal-controls-switch-up"
          :class="{ disabled: videosCtrolStore().activeVideoIndex === 0 }"
          @click="videosCtrolStore().handlePrev()"
        >
          <svg-icon class="icon" icon="video-switch-prev-arrow" />
        </div>
        <div
          class="modal-controls-switch-down"
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
  </div>
</template>

<style lang="scss" scoped>
.xgplayer-playswitch {
  flex-shrink: 0;
  width: 35px;
}
.modal-controls {
  border: 1px solid hsla(0, 0%, 100%, 0.15);
  border-radius: 18px;
  box-sizing: content-box;

  .modal-controls-switch {
    -webkit-backdrop-filter: unset;
    backdrop-filter: unset;
    background-color: rgba(0, 0, 0, 0.18);
    opacity: 1;
    border-radius: 18px;
    width: 35px;
    height: 80px;

    background: rgba(0, 0, 0, 0.18);
    border: 0.5px solid hsla(0, 0%, 100%, 0.15);
    position: relative;
    &:hover {
      opacity: 0.9;
    }
    .modal-controls-switch-up {
      height: 40px;
      position: absolute;
      top: 0px;
      width: 35px;
      cursor: pointer;
      opacity: 0.7;

      .icon {
        left: 5px;
        // left: 9px;
        position: relative;
        top: 7px;
        height: 26px !important;
        width: 26px !important;
        color: #fff;
        // color: rgba(22, 24, 35, 0.6);
      }
    }
    .modal-controls-switch-up.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
    .modal-controls-switch-down.disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }

    .modal-controls-switch-down {
      bottom: 0px;
      height: 40px;
      opacity: 0.7;
      position: absolute;
      width: 36px;
      cursor: pointer;

      .icon {
        left: 5px;
        // left: 9px;
        position: relative;
        top: 7px;
        height: 26px !important;
        width: 26px !important;
        color: #fff;
        // color: rgba(22, 24, 35, 0.6);
      }
    }
  }
}
</style>
