<script setup lang="ts">
import {} from 'vue'

const entertainmentData = [
  {
    id: 1,
    time: '3月24日'
  },
  {
    id: 2,
    time: '3月23日'
  },
  {
    id: 3,
    time: '3月22日'
  }
]
</script>
<template>
  <div class="entertainment">
    <div class="entertainment-content">
      <template v-for="item in entertainmentData">
        <div class="entertainment-time">{{ item.time }}</div>
        <entertainment-list />
      </template>
    </div>
    <list-footer />
  </div>
</template>

<style lang="scss" scoped>
.entertainment {
  width: 100%;
  .entertainment-content {
    .entertainment-time {
      color: rgba(22, 24, 35, 0.34);
      font-size: 13px;
      height: 40px;
      line-height: 40px;
      width: 100%;
    }
  }
}
</style>
