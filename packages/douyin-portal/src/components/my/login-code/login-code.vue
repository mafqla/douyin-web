<template>
  <div class="user-login-code">
    <div class="share-login-guide">
      <div class="web-login-container">
        <div class="web-login">
          <img
            alt=""
            src="data:image/jpeg;base64,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"
            class="web-login-scan-code__content__qrcode-wrapper__qrcode"
            tabindex="0"
            aria-label="二维码"
          />
        </div>
      </div>
    </div>
    <p class="share-login-text">登录后即可观看喜欢、收藏的视频</p>
    <p class="share-login-text2">打开「APP」扫描二维码</p>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
</script>
<style lang="scss" scoped>
.user-login-code {
  height: 160px;
  margin-top: 50px;
  .share-login-guide {
    align-items: center;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;

    .web-login-container {
      border-bottom: 5px solid #fff;
      border-radius: 4px;
      height: 160px;
      margin-bottom: 8px;
      width: 160px;
      position: relative;

      .web-login {
        background-color: transparent;
        border-radius: 4px;
        box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
        height: 160px;
        padding: 0;
        width: 160px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .share-login-text {
    color: #161823;
    font-size: 18px;
    line-height: 26px;
    margin: 28px auto 8px;
    text-align: center;
  }

  .share-login-text2 {
    color: rgba(22, 24, 35, 0.34);
    font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
    font-weight: 400;
    text-align: center;
  }
}
</style>
