<script setup lang="ts">
import { AuthEditUserInfo } from '@/service/auth/auth'
import { userStore } from '@/stores/user'
import { reactive, ref, watchEffect } from 'vue'

const props = defineProps({
  open: Boolean,
  userInfo: {
    type: Object,
    default: () => {
      return {
        username: '',
        signature: '',
        avatar: ''
      }
    }
  }
})

const isEdited = ref(false)
// 记录初始的用户名和个性签名
const usernameInitial = ref(props.userInfo.username)
const signatureInitial = ref(props.userInfo.signature)
const avatarInitial = ref(props.userInfo.avatar)
const usernameLength = ref(props.userInfo.username.length)
watchEffect(() => {
  usernameLength.value = props.userInfo.username.length
  if (
    props.userInfo.username !== usernameInitial.value ||
    props.userInfo.signature !== signatureInitial.value
  ) {
    isEdited.value = true
  } else {
    isEdited.value = false
  }
  if (props.open) {
    document.body.style.overflow = 'hidden'
  } else {
    //移除样式属性
    document.body.style.removeProperty('overflow')
  }
})

const emit = defineEmits(['close'])
const params = reactive({
  username: '',
  signature: '',
  avatar: '' as any
})
const saveProfile = async () => {
  params.username = props.userInfo.username
  params.signature = props.userInfo.signature
  console.log(params)
  //调用接口
  try {
    await AuthEditUserInfo(params)
    await userStore().getUserInfo()
  } catch (e) {
    console.log(e)
  }

  //关闭
  emit('close')
}
const cancelEdit = () => {
  props.userInfo.username = usernameInitial.value
  props.userInfo.signature = signatureInitial.value
  props.userInfo.avatar = avatarInitial.value
  emit('close')
}

const avatarInput = ref<HTMLInputElement | null>(null)
//头像上传
const uploadAvatar = () => {
  // 监听文件选择变化事件
  if (avatarInput.value) {
    avatarInput.value.click()
    //获取文件流
    avatarInput.value.onchange = (e: any) => {
      const file = e.target.files[0]
      console.log(file)
      params.avatar = file
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        props.userInfo.avatar = reader.result as string
      }
    }
  }
}
</script>
<template>
  <Teleport to="body">
    <div class="user-modal" v-if="open">
      <input
        type="file"
        accept=".png,.webp,.jpeg,.pjpeg,.bmp,.jpg"
        style="display: none"
        ref="avatarInput"
      />
      <div class="content">
        <div class="head">
          <span class="title">编辑资料</span>
          <span class="close" @click="cancelEdit">
            <svg
              width="36"
              height="36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 36 36"
            >
              <path
                d="M24.601 24.6a1.362 1.362 0 01-1.927 0L18.5 20.427l-4.174 4.175a1.362 1.362 0 01-1.927-1.927l4.174-4.174-4.174-4.175a1.362 1.362 0 011.927-1.926l4.174 4.174 4.174-4.174a1.362 1.362 0 111.927 1.927L20.427 18.5l4.174 4.174a1.362 1.362 0 010 1.927z"
                fill="#fff"
                fill-opacity="0.8"
              ></path>
            </svg>
          </span>
        </div>
        <div class="avatar" @click="uploadAvatar">
          <div class="upload">
            <img :src="userInfo.avatar" alt="avatar" />
            <span class="upload-icon"></span>
          </div>
          <div class="upload-text">点击修改头像</div>
        </div>
        <div class="username">
          <div class="title">名字</div>
          <div class="input-box">
            <input
              type="text"
              placeholder="记得填写呢称"
              maxlength="20"
              v-model="userInfo.username"
            />
            <span class="size">{{ usernameLength }}/20</span>
          </div>
        </div>
        <div class="signature">
          <div class="title">简介</div>
          <div class="input-box">
            <el-input
              v-model="userInfo.signature"
              placeholder="介绍一下自己"
              resize="none"
              type="textarea"
            />
          </div>
        </div>
        <div class="btn-content">
          <button
            class="save common"
            :disabled="!isEdited"
            @click="saveProfile"
          >
            保存
          </button>
          <button class="cancel common" @click="cancelEdit">取消</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.user-modal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  // background: rgba(0, 0, 0, 0.6);
  background: var(--color-mask-m1);
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    background: var(--color-bg-b1);
    border-radius: 4px;
    height: 588px;
    left: 50%;
    padding: 0 40px;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 480px;
  }

  .head {
    margin-top: 36px;
    position: relative;

    .title {
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      font-size: 18px;
    }
    .close {
      cursor: pointer;
      position: absolute;
      right: -36px;
      top: -32px;

      svg path {
        fill: var(--color-text-t2);
      }
    }
  }

  .avatar {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 16px;
    width: 100%;

    .upload {
      border-radius: 50%;
      height: 108px;
      overflow: hidden;
      position: relative;
      width: 108px;

      img {
        height: 100%;
        width: 100%;
      }

      .upload-icon {
        background-color: rgba(0, 0, 0, 0.3);
        background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi41MzUgNWEyIDIgMCAwIDAtMS42NjQuODkxTDkuNDY0IDguMDAzSDhhNCA0IDAgMCAwLTQgNFYyM2E0IDQgMCAwIDAgNCA0aDE2YTQgNCAwIDAgMCA0LTRWMTIuMDAzYTQgNCAwIDAgMC00LTRoLTEuNDY1TDIxLjEzIDUuODkxQTIgMiAwIDAgMCAxOS40NjQgNWgtNi45MjlaTTE2IDEwLjVBNi4yNSA2LjI1IDAgMSAwIDE2IDIzYTYuMjUgNi4yNSAwIDAgMCAwLTEyLjVabS0zLjc1IDYuMjVhMy43NSAzLjc1IDAgMSAxIDcuNSAwIDMuNzUgMy43NSAwIDAgMS03LjUgMFoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii45Ii8+PC9zdmc+);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 32px 32px;
        cursor: pointer;
        display: block;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 1;
      }
    }

    .upload-text {
      color: var(--color-text-t3);
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .username {
    margin-top: 16px;
    width: 100%;

    .title {
      color: var(--color-text-t1);
      font-size: 14px;
    }
    .input-box {
      margin-top: 4px;
      position: relative;
      width: 100%;

      input {
        // background: #f2f2f4;
        background: var(--color-bg-b2);
        // background: rgba(242, 242, 243, 1);
        border: none;
        border-radius: 4px;
        // caret-color: rgba(22, 24, 35, 0.75);
        caret-color: var(--color-text-t2);
        // color: rgba(22, 24, 35, 0.75);
        color: var(--color-text-t2);
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        outline: none;
        padding-left: 8px;
        width: 100%;
      }

      .size {
        color: var(--color-text-t4);
        font-size: 12px;
        line-height: 32px;
        position: absolute;
        right: 8px;
      }
    }
  }

  .signature {
    margin-top: 24px;
    width: 100%;

    .title {
      color: var(--color-text-t1);
      font-size: 14px;
    }

    .input-box {
      margin-top: 4px;
      position: relative;
      width: 100%;

      :deep(.el-textarea) {
        all: unset !important;
        border: none !important;

        .el-textarea__inner {
          background: var(--color-bg-b2);
          border: none;
          box-shadow: none;
          border-radius: 4px;
          // caret-color: rgba(22, 24, 35, 0.75);
          caret-color: var(--color-text-t2);
          // color: rgba(22, 24, 35, 0.75);
          color: var(--color-text-t2);
          font-size: 14px;
          max-height: 300px;
          height: 128px;
          min-height: 128px !important;
          padding: 8px 8px 16px;
          position: relative;
          width: 100%;

          &:focus {
            border: none;
            box-shadow: none;
          }
        }

        .el-textarea__inner::placeholder {
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          // color: #9197a3;
          color: var(--color-bg-b2);
        }
      }
    }
  }

  .btn-content {
    margin-top: 32px;

    .common {
      border-radius: 4px;
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
      font-size: 14px;
      font-weight: 500;
      height: 36px;
      line-height: 22px;
      min-width: 88px;

      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      margin: 0 8px;
      outline: none;
      padding: 0 16px;
      position: relative;
    }
    .save {
      // background-color: #fe2c55;
      background-color: var(--color-primary);
      // color: #fff;
      color: var(--color-const-text-white);
      margin: 0 !important;

      &:hover {
        // background-color: #d21b46;
        background-color: var(--color-primary-hover);
      }
      &:disabled {
        // background-color: #ffc2c6;
        background-color: var(--color-primary-disable);
        cursor: not-allowed;
      }
    }

    .cancel {
      // background-color: #ebedef;
      background-color: var(--secondary-bg-color);
      // color: rgba(22, 24, 35, 0.6);
      color: var(--color-text-t3);

      margin-left: 16px;
    }
  }
}
</style>
