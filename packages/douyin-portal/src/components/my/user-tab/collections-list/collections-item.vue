<script setup lang="ts">
import {} from 'vue'
</script>
<template>
  <div class="collections-item">
    <a class="collections-item-a">
      <div class="collections-item-content">
        <div class="collections-item-content-left">
          <div class="collect-item-img">
            <img
              src="https://p3-pc.douyinpic.com/obj/image-cut-tos/fedcf1ed096f6cb005ec7e5f1513d62f?from=1347513714"
              alt="生活"
              class="collect-img"
            />
          </div>
        </div>
        <div class="collections-item-content-right">
          <div class="collections-item-content-right-title">
            《算法初步》教学视频
          </div>
          <p class="collections-item-content-right-play-number">364.0万 播放</p>
          <p class="collections-item-content-right-c-number">
            <span>更新至 35 集</span>
            <span class="collections-item-content-right-c-up">更新23集</span>
          </p>
        </div>
      </div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.collections-item {
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 10px;
  width: calc(33.33% - 10.8px);
  display: inline-block;
  .collections-item-a {
    position: relative;
    .collections-item-content {
      background: rgba(242, 242, 243, 1);
      border-radius: 6px;
      display: flex;
      padding: 12px;
      .collections-item-content-left {
        border-radius: 4px;
        flex: none;
        height: 88px;
        overflow: hidden;
        width: 88px;
        .collect-item-img {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
          img {
            color: #161722;
            max-height: 100%;
            max-width: 100%;
            position: relative;
            transition: all 0.3s linear;
          }
        }
      }
      .collections-item-content-right {
        margin-left: 10px;

        &-title {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #161823;
          display: -webkit-box;
          font-size: 14px;
          height: 44px;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &-play-number,
        &-c-number,
        &-c-up {
          color: rgba(22, 24, 35, 0.6);
          font-size: 12px;
          line-height: 20px;
        }
        &-c-up {
          background: #f2f2f4;
          border-radius: 3px;
          line-height: 17px;
          margin-left: 10px;
          padding: 0 4px;
        }
      }
    }
  }
}
</style>
