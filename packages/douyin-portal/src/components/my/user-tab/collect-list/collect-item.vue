<template>
  <div class="collect-item">
    <a class="collect-item-a">
      <div class="collect-item-content">
        <div class="collect-item-content-left">
          <div class="collect-img-item">
            <img
              src="https://p3-pc.douyinpic.com/obj/image-cut-tos/fedcf1ed096f6cb005ec7e5f1513d62f?from=1347513714"
              alt="生活"
              class="collect-img"
            />
          </div>
        </div>
        <div class="collect-item-content-right">
          <div class="collect-item-content-right-title">
            <span>生活</span>
            <svg
              width="14"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="collect-item-content-right-title-svg"
            >
              <path
                opacity="0.8"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.824 5.647h-.942C.842 5.647 0 6.49 0 7.53v6.589C0 15.158.843 16 1.882 16h9.412c1.04 0 1.883-.843 1.883-1.882V7.529c0-1.04-.843-1.882-1.883-1.882h-.941V3.765a3.765 3.765 0 10-7.53 0v1.882zm1.882 0H8.47V3.765a1.882 1.882 0 10-3.765 0v1.882z"
                fill="#A9AAB7"
              ></path>
            </svg>
          </div>
          <p class="collect-item-content-dec">共 5 作品</p>
        </div>

        <svg-icon icon="collect" class="collect-item-content-svg" />
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
</script>
<style lang="scss" scoped>
.collect-item {
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 10px;
  width: calc(33.33% - 10.8px);
  display: inline-block;

  .collect-item-a {
    position: relative;
    .collect-item-content {
      // background: #f2f2f4;
      background: rgba(242, 242, 243, 1);
      border-radius: 6px;
      display: flex;
      padding: 12px;
      .collect-item-content-left {
        border-radius: 4px;
        flex: none;
        height: 88px;
        overflow: hidden;
        width: 88px;
        .collect-img-item {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
          .collect-img {
            color: #161722;
            max-height: 100%;
            max-width: 100%;
            position: relative;
            transition: all 0.3s linear;
          }
        }
      }
      .collect-item-content-right {
        display: flex;
        flex: 1 1;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 16px;
        .collect-item-content-right-title {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          // color: #161823;
          color: rgba(22, 24, 35, 1);
          display: -webkit-box;
          font-size: 14px;
          height: 44px;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          .collect-item-content-right-title-svg {
            margin: 0 0 4px 4px;
            vertical-align: middle;
          }
        }
      }
      .collect-item-content-dec {
        color: rgba(22, 24, 35, 0.6);
        font-size: 12px;
        line-height: 20px;
      }
    }
  }

  .collect-item-content-svg {
    align-self: flex-end;
    -bottom-right-radius: 6px;
    margin: 0 -12px -12px 0;
    width: 74px;
    height: 70px;
    color: #eff1fa;
  }
  @media (max-width: 1400px) {
    .collect-item-content-svg {
      display: none;
    }
  }
}
</style>
