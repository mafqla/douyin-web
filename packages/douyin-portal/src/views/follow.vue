<script setup lang="ts">
import { ref } from 'vue'
import CarouselControls from '@/components/swper/swiper-control.vue'
import testVideo from '/test-video/test1.mp4?url'
const loading = ref(false)
const testurl = 'https://sf3-cdn-tos.douyinstatic.com/obj/ies-music/7418416350111599410.mp3'
</script>
<template>
  <div class="follow">
    <Loading :show="loading" :isShowText="true" :center="true">
      <!-- <swiper-video>
        <template #slide>
          <carousel-controls />
        </template>
</swiper-video> -->
      <mini-player style="height: 320px; width: 200px" :url="testurl" />
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
