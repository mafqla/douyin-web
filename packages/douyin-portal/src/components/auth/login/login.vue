<script setup lang="ts">
import {} from 'vue'
import qrLogin from './qr-login.vue'
import codeLogin from './code-login.vue'
import passLogin from './pass-login.vue'
import { ref } from 'vue'

const activeName = ref('pass')
</script>
<template>
  <div class="login">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="扫码登录" name="qr">
        <qr-login />
      </el-tab-pane>

      <el-tab-pane label="验证码登录" name="code">
        <code-login />
      </el-tab-pane>

      <el-tab-pane label="密码登录" name="pass">
        <pass-login />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.login {
  position: relative;
  border-radius: 12px;
  min-height: 446px;
  width: 404px;
  &::before {
    background: hsla(0, 0%, 100%, 0.9);
    border-radius: 12px;
    box-shadow: 0 0 60px rgba(226, 97, 89, 0.2);
    content: '';
    height: 423px;
    left: 0;
    position: absolute;
    top: 7px;
    width: 405px;
  }
  :deep(.el-tabs) {
    border-radius: 12px;
    overflow: visible;
    width: 100%;
    min-height: 446px;

    .el-tabs__content {
      overflow: visible;
    }
  }

  :deep(.el-tabs__header) {
    // height: 64px;
    margin: 0 auto;
    border-bottom: 1px solid #f1f2f5;
    align-items: center;

    .el-tabs__nav {
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      padding: 0 25px;
      width: 100%;
    }

    .el-tabs__item.is-active {
      border-bottom: 3px solid #fe2c55;
      color: #161823 !important;
      font-weight: 500;
    }
    .el-tabs__item:hover {
      color: #161823 !important;
      cursor: pointer;
    }

    .el-tabs__active-bar {
      height: 0;
    }
    .el-tabs__item {
       color: var(--color-text-t1);
      cursor: default;
      font-size: 18px;
      font-weight: 400;
      height: 77px;
      line-height: 77px;
      outline: none;
      position: relative;
      text-align: center;
      width: 90px;
      display: flex;
      padding: 0;
      justify-content: center;
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
}
</style>
