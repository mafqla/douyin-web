<script setup lang="ts">
import { userStore } from '@/stores/user'
import { ref } from 'vue'

const email = ref('')
const code = ref('')
const errorInfo = ref('')

console.log(email, code)
const handleLogin = (email: string, code: string) => {
  console.log(email, code)
  // 调用登录接口
  const store = userStore()
  store.login({ email, code })
}

const countdown = ref(0)
const handleSendCode = (email: string) => {
  // 调用发送验证码接口
  const store = userStore()
  if (!email) {
    errorInfo.value = '手机号不能为空'
    return
  }
  store.postCode(email)
  countdown.value = 60
  const intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(intervalId)
    }
  }, 1000)
}

</script>
<template>
  <div class="code-login">
    <el-form>
      <el-form-item>
        <el-input placeholder="邮箱" v-model="email">
          <!-- <template #prepend>
                      <el-select placeholder="+86" style="width: 180px">
                        <el-option label="Restaurant" value="1" />
                        <el-option label="Order No." value="2" />
                        <el-option label="Tel" value="3" />
                      </el-select>
                    </template> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入验证码" v-model="code">
          <template #append>
            <span @click="handleSendCode(email)">
              <template v-if="!countdown">获取验证码</template>
              <template v-else>{{ countdown }} 秒后重新获取</template>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <div class="login-error">{{ errorInfo }}</div>

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
        <el-button @click="handleLogin(email, code)" :disabled="!email || !code"
          >登录/注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.code-login {
  margin-top: 48px;
  .el-form {
    padding: 0 55px;
    width: 100%;
    // width: 308px;

    .el-input {
      background: #f2f2f4;
      border: none;
      border-radius: 10px;
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

        &:hover {
          color: #000;
        }
      }
    }

    .web-login-confirm-info {
      display: flex;
      align-items: center;
      justify-content: center;
      // margin-top: 40px;
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
      border-radius: 10px;
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

  .login-error {
    color: #fe3824;
    height: 20px;
    letter-spacing: 0.6px;
    border: none;
    outline: none;
    margin-top: 4px;
    margin-bottom: 30px;
    padding-left: 12px;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
