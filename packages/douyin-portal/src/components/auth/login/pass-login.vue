<script setup lang="ts">
import { userStore } from '@/stores/user'
import { ref } from 'vue'

const email = ref('admin@qq.com')
const password = ref('admin13n')

// 定义表单校验规则
const rules = {}

//调用登录接口

const handleLogin = (email: string, password: string) => {
  // 调用登录接口
  const store = userStore()
  store.login({ email, password })
}
</script>
<template>
  <div class="pass-login">
    <el-form>
      <el-form-item>
        <el-input placeholder="邮箱" v-model="email" />
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入密码"
          type="password"
          show-password
          v-model="password"
          @keyup.enter="handleLogin(email, password)"
        >
          <template #append>忘记密码</template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <div class="web-login-confirm-info">
          <span class="web-login-confirm-info__before-text">同意</span>
          <a
            target="_blank"
            href="https://www.douyin.com/agreements/?id=6773906068725565448"
            class="web-login-confirm-info__info"
            >用户协议
          </a>
          <span class="web-login-confirm-info__connect-text">和</span>
          <a
            target="_blank"
            href="https://www.douyin.com/agreements/?id=6773901168964798477"
            class="web-login-confirm-info__info"
            >隐私政策
          </a>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="handleLogin(email, password)"
          :disabled="!email || !password"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.pass-login {
  margin-top: 48px;
  .el-form {
    padding: 0 55px;
    width: 100%;
    // width: 308px;

    .el-input {
      background: #f2f2f4;
      border: none;
      border-radius: 4px;
      color: rgba(22, 24, 35, 0.34);
      height: 52px;
      line-height: 24px;
      padding: 8px 20px 8px 10px;

      :deep(.el-input__wrapper) {
        border: none;
        background: none;
        height: 100%;
        box-shadow: none;
        .el-input__inner {
          background: none;
          border: none;
          box-shadow: none;
        }
        &:hover {
          border: none;
          box-shadow: none;
        }
      }
      :deep(.el-input__wrapper.is-focus) {
        border: none;
        box-shadow: none;

        .el-input__inner {
          background: none;
          border: none;
          box-shadow: none;
        }
      }
      :deep(.el-input-group__append, .el-input-group__prepend) {
        background: none;
        border: none;
        box-shadow: none;
        padding: 0;
        color: #ff2c55;

        &:hover {
          color: #d21b46;
        }
      }
    }

    .web-login-confirm-info {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 40px;
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      .web-login-confirm-info__before-text {
        color: #999;
      }
      .web-login-confirm-info__info {
        // color: rgba(22, 24, 35, 0.34);
        color: rgba(22, 24, 35, 0.75);
        margin: 0 6px;
      }
      .web-login-confirm-info__connect-text {
        color: #999;
      }
    }

    .el-button {
      background: #fe2c55;
      font-weight: 500;
      height: 48px;
      line-height: 48px;
      vertical-align: middle;

      border: none;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      outline: none;
      text-align: center;
      width: 100%;
    }

    .el-button.is-disabled {
      background: #ffc2c6;
      cursor: default;
    }
  }
}
</style>
