<script setup lang="ts">
import { ref } from 'vue'
//是否保存登录信息
const isSaveLogin = ref(true)
</script>
<template>
  <div class="trust-login-switch-title">保存登录信息</div>
  <div class="trust-login-switch-button">
    <el-switch v-model="isSaveLogin" />
  </div>
</template>

<style lang="scss" scoped>
.trust-login-switch-title {
  width: 76px;
  height: 22px;
  letter-spacing: 0.6px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  margin: 0px 8px;
  color: var(--color-text-t3);
}

.trust-login-switch-button {
  border-radius: 20px;
  box-shadow: inset 0 0 0 0 #dfdfdf;
  cursor: pointer;
  display: inline-block;
  outline: none;
  position: relative !important;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  :deep(.el-switch.is-checked .el-switch__core) {
    border: none;
    background-color: #fe2c55;
  }

  :deep(.el-switch__core) {
    min-width: 30px !important;
    height: 18px !important;
    border: none;
  }
}
</style>
