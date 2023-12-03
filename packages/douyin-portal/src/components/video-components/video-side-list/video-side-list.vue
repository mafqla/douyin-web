<script setup lang="ts">
import {} from 'vue'
import SideItem from './side-item.vue'
</script>
<template>
  <div class="video-side-list">
    <div class="side-list-header">
      <div class="side-list-header-info">
        <a href="#">
          <div class="info-author">
            <span>@</span>
            <span>作者</span>
            <svg-icon icon="side-list-right" class="icon" />
          </div>
          <div class="info-number">0粉丝<span></span>0获赞</div>
        </a>
      </div>
      <div class="side-list-header-btn">
        <button class="btn">关注</button>
      </div>
    </div>
    <div class="side-list-content">
      <!-- <el-scrollbar height="760px">
        <side-item v-for="item in 35" />
        <list-footer />
      </el-scrollbar> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-side-list {
  -ms-overflow-style: none;
  flex: 1 1;
  height: calc(100% - 46px);
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  padding: 0 16px;

  .side-list-header {
    -webkit-app-region: no-drag;
    display: flex;
    height: 60px;
    justify-content: space-between;

    // height: unset;
    // margin: 0;
    // padding: 16px 0;

    border-bottom: 1px solid hsla(0, 0%, 100%, 0.06);
    height: 70px;
    margin-bottom: 4px;

    .side-list-header-info {
      // flex: 1 1;
      display: flex;
      align-items: center;

      a {
        display: flex;
        flex-direction: column;
        height: 46px;
        justify-content: space-between;

        .info-author {
          align-items: center;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          height: 24px;
          font-size: 14px;
          font-weight: 500;
          max-width: unset;
          // max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .icon {
            width: 14px;
            height: 14px;
            color: rgba(255, 255, 255, 0.5);
          }
        }

        .info-number {
          align-items: center;
          // color: #161823;
          color: rgba(255, 255, 255, 0.9);
          display: flex;
          font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
          font-size: 12px;
          font-weight: 400;
          height: 20px;

          span {
            border-left: 1px solid;
            border-color: #f2f2f4;
            // border-color: rgba(242, 242, 243, 0.08);
            display: block;
            height: 10px;
            margin: 0 8px;
            width: 0;
            font-size: 16px;
            font-weight: 500;
          }
        }
      }
    }

    .side-list-header-btn {
      align-items: center;
      display: flex;
      margin: 0 -8px 0 0;

      .btn {
        display: flex;
        font-size: 12px;
        height: 28px;
        line-height: 28px;
        justify-content: center;
        margin-right: 8px;
        min-width: 49px;
        padding: 0 8px;
        // padding: 6px 10px;
        text-align: center;
        border-radius: 4px;

        background-color: #fe2c55;
        color: #fff;
        text-shadow: none;
        border: none;

        &:hover {
          background-color: rgba(210, 27, 70, 1);
        }
      }
    }
  }
}
</style>
