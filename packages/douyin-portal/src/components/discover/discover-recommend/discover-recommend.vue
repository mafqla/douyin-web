<script setup lang="ts">
import {} from 'vue'
</script>
<template>
  <div class="discover-recommend">
    <h2 class="discover-header">猜你喜欢</h2>
    <div class="discover-content">
      <div class="discover-main">
        <template v-for="item in 20">
          <discover-item />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discover-recommend {
  min-width: 508px;
  height: 100%;
  position: relative;
  padding: 16px 30px 0;
  //滚动条隐藏
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .discover-header {
    // color: #000;
    color: rgba(0, 0, 0, 1);
    font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 34px;
  }
  .discover-content {
    margin-top: 24px;
    padding-bottom: 40px;
  }
  .discover-main {
    display: flex;
    flex-wrap: wrap;
    margin: 0px -8px;
  }
}
@media (min-width: 2472px) {
  .discover-recommend {
    padding: 16px 0 0;
  }
}
</style>
