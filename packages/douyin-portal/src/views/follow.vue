<script setup lang="ts">
import { ref } from 'vue'
import CarouselControls from '@/components/swper/swiper-control.vue'

const loading = ref(false)
</script>
<template>
  <div class="follow">
    <Loading :show="loading" :isShowText="true" :center="true">
      <!-- <swiper-video>
        <template #slide>
          <carousel-controls />
        </template>
      </swiper-video> -->
      <mini-player
        style="height: 320px; width: 200px"
        :url="'http://192.168.227.1:8081/res/458e6bd5-a8cc-492f-a924-e264d7b2eb9e.mp4'"
      />
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.follow {
  width: 100%;
  height: 80vh;
  position: relative;
  background-color: antiquewhite;
}

:deep(.carousel-controls) {
  .carousel-controls-switch {
    background-color: rgba(0, 0, 0, 0.18) !important;
    border: 0.5px solid hsla(0, 0%, 100%, 0.15) !important;
    width: 35px;

    .carousel-controls-switch-up,
    .carousel-controls-switch-down {
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
