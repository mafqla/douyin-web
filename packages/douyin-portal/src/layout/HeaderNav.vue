<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
  HeaderAvatar,
  LoginButton,
  MessageBox,
  NotificationBox,
  CooperateBox,
  QuickBox,
  ClientBox
} from '@/components/header'
import { login } from '@/components/auth'
import { userStore } from '@/stores/user'
//是否登录
let isLogin: any = ref(false)

let dialogTableVisible: any = ref(false)
const store = userStore()

watchEffect(() => {
  // console.log(store.isLogin())
  isLogin.value = store.isLogin()
  //关闭登录弹窗
  if (isLogin.value) {
    dialogTableVisible.value = false
  }
})

const handlePost = () => {
  //跳转到发布页面
  window.location.href = '/post'
}
</script>

<template>
  <div class="header">
    <div class="header-main">
      <div class="header-content">
        <div class="header-left">
          <search-input />
        </div>
        <div class="header-right">
          <div class="header-right-item">
            <div class="header-right-item-content">
              <div class="header-right-item-overplay">
                <svg-icon class="icon expand" icon="expand" />
              </div>
              <p>更多</p>
            </div>
          </div>
          <div class="header-right-item">
            <div class="header-right-item-content">
              <div class="header-right-item-overplay">
                <svg-icon class="icon" icon="header-1" />
              </div>
              <p>充抖币</p>
            </div>
          </div>
          <div class="header-right-item">
            <el-popover :show-arrow="false" placement="bottom-end">
              <template #reference>
                <div class="header-right-item-content">
                  <div class="header-right-item-overplay">
                    <svg-icon class="icon" icon="header-2" />
                  </div>
                  <p>客户端</p>
                </div>
              </template>
              <template #default> <client-box /></template>
            </el-popover>
          </div>
          <div class="header-right-item">
            <el-popover :show-arrow="false" placement="bottom-end">
              <template #reference>
                <div class="header-right-item-content">
                  <div class="header-right-item-overplay">
                    <svg-icon class="icon" icon="header-3" />
                  </div>
                  <p>快捷访问</p>
                </div>
              </template>
              <template #default><quick-box /> </template>
            </el-popover>
          </div>

          <div class="header-right-item">
            <el-popover :show-arrow="false" placement="bottom-end">
              <template #reference>
                <div class="header-right-item-content">
                  <div class="header-right-item-overplay">
                    <svg-icon class="icon" icon="header-4" />
                  </div>
                  <p>通知</p>
                </div>
              </template>
              <template #default> <notification-box /> </template>
            </el-popover>
          </div>

          <div class="header-right-item">
            <el-popover :show-arrow="false" placement="bottom-end">
              <template #reference>
                <div class="header-right-item-content">
                  <div class="header-right-item-overplay">
                    <svg-icon class="icon" icon="header-5" />
                  </div>
                  <p>私信</p>
                </div></template
              >
              <template #default> <message-box /> </template>
            </el-popover>
          </div>
          <div class="header-right-item" @click="handlePost">
            <el-popover :show-arrow="false" placement="bottom-end">
              <template #reference>
                <div class="header-right-item-content">
                  <div class="header-right-item-overplay">
                    <svg-icon class="icon" icon="header-6" />
                  </div>
                  <p>投稿</p>
                </div>
              </template>
              <template #default> <cooperate-box /> </template>
            </el-popover>
          </div>
          <!-- <el-divider direction="vertical" /> -->

          <template v-if="isLogin">
            <header-avatar />
          </template>
          <template v-else>
            <login-button @click="dialogTableVisible = true" />
            <el-dialog
              v-model="dialogTableVisible"
              title="登录后免费畅享高清视频"
              align-center
              center
              :append-to-body="true"
              :destroy-on-close="true"
              :modal="false"
              class="login-pannel"
            >
              <div class="login-pannel__header-title-desc">
                <ul id="sub-title">
                  <li id="comment">点赞评论随心发</li>
                  <li id="live">直播间畅聊打赏</li>
                  <li id="friend">朋友视频一键览</li>
                </ul>
              </div>
              <login />
            </el-dialog>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  -webkit-app-region: no-drag;
  align-items: center;
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: transparent;
  transition: background-color 0.3s, height 0.4s;
  background-image: none !important;
  width: 100%;
  height: 100%;
  // border-bottom: rgba(231, 231, 236, 0.4) 1px solid;
  margin-right: 16px;

  // position: fixed;

  .header-main {
    align-items: center;
    display: flex;
    height: 100%;
    margin: 0 32px 0 22px;
    width: 100%;

    .header-content {
      align-items: center;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      height: 100%;
      justify-content: space-between;
      position: relative;
      width: 100%;

      .header-left {
        -webkit-app-region: no-drag;
        align-items: center;
        display: flex;
        height: 100%;
        max-width: 520px;
        padding: 0 8px;
        width: 333px;
      }

      @media (min-width: 1320px) {
        .header-left {
          left: calc(
            50vw - var(--navigation-expend-width) / 2 - 34px -
              (100% + 32px + var(--navigation-expend-width)) * 0.278 / 2
          );
          width: calc((100% + 32px + var(--navigation-expend-width)) * 0.278);
        }
      }
      @media (min-width: 1240px) {
        .header-left {
          left: unset;
          position: absolute;
          right: 400px;
          width: calc((100% + 32px + var(--navigation-expend-width)) * 0.278);
          padding: 0px;
        }
      }
      @media (min-width: 1197px) {
        .header-left {
          // left: calc(50vw - 84.456px - 13.9%);
          width: calc(27.8% + 28.912px);
        }
      }
      @media (min-width: 869px) {
        .header-left {
          padding: 0;
          position: absolute;
          right: 400px;
        }
      }
      .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .header-right-item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: auto;
          min-width: 32px;
          margin-left: 8px;
          position: relative;

          &:nth-child(1) {
            display: none;
          }

          .header-right-item-content {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: auto;
            min-width: 32px;

            .header-right-item-overplay {
              // background-color: #e7e7ec;
              background: transparent;
              border-radius: 72px;
              display: flex;
              height: 24px;
              align-items: center;
              justify-content: center;
              width: 24px;
            }

            p {
              font-size: 10px;
              font-weight: 500;
              line-height: 20px;
              text-align: center;
              word-break: keep-all;
              color: var(--color-text-t3);
              user-select: none;
            }
            .icon {
              // opacity: 0.6;
              path {
                fill: var(--color-text-t3);
              }
            }
            & .icon {
              width: 24px;
              height: 24px;
            }
            & .icon.expand {
              width: 12.44px;
              height: 12.44px;
            }

            &:hover {
              .header-right-item-overplay {
                // background-color: #e7e7ec;
                background-color: transparent;
                cursor: pointer;
              }
              p {
                color: var(--color-text-t0);
              }
              .icon {
                opacity: 1;
                path {
                  fill: var(--color-text-t0) !important;
                }
              }
            }
          }
        }
        .header-right-item:first-child {
          margin-left: 4.5px;
          margin-right: 4.5px !important;
        }
      }
    }

    @media (min-width: 0) {
      .header-right {
        width: auto;
      }
    }
    @media (min-width: 869px) {
      .header-content {
        justify-content: flex-end;
      }
    }
    @media (min-width: 1032px) {
      .header-content {
        padding-right: 0 !important;
        // padding-right: 40px;
      }
    }
  }
}
.main.user {
  .header-right-item {
    .icon {
      color: var(--color-text-t2);
      fill-opacity: 1;
    }

    &:hover {
      .icon,
      p {
        color: var(--color-text-t0) !important;
      }
    }
    // }
  }

  .header.scrolled {
    .header-right-item {
      .icon {
        // color: rgba(22, 24, 35, 0.6);
        color: var(--color-text-t3);
        fill-opacity: 1;
      }
      p {
        color: var(--color-text-t3) !important;
      }

      &:hover {
        .icon,
        p {
          color: var(--color-text-t0) !important;
        }
      }
    }
  }
}
@media screen and (max-width: 840px) {
  .header {
    .header-main {
      .header-content {
        .header-right {
          .header-right-item:nth-child(1) {
            display: flex;
          }

          .header-right-item:nth-child(2),
          .header-right-item:nth-child(3),
          .header-right-item:nth-child(4) {
            display: none;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.login-pannel {
  background: url(@assets/login-resetpwd-bg.png) 0% 0% / 100% no-repeat
    rgb(255, 255, 255);
  border-radius: 8px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  // min-height: 568px;
  min-height: 600px;
  padding: 24px 38px 40px;
  // transform: scale(1);
  transform: scale(0.75) !important;
  width: 480px;

  .el-dialog__header {
    padding: 0;

    .el-dialog__title {
      font-size: 24px;
      font-weight: 500;
      height: 34px;
      line-height: 34px;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .login-pannel__header-title-desc {
    font-size: 14px;
    font-weight: 400;
    height: 22px;
    line-height: 22px;
    margin-top: 12px;
    margin-bottom: 24px;

    #sub-title {
      display: flex;
      justify-content: center;

      li:first-child {
        margin-left: -7px;
        padding-left: 22px;
        position: relative;
      }

      li:not(:last-child) {
        margin-right: 16px;
      }

      li:nth-child(2) {
        padding-left: 22px;
        position: relative;
      }

      li:nth-child(3) {
        padding-left: 22px;
        position: relative;
      }

      #comment:before {
        background: url(data:image/png;base64,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)
          no-repeat 50% / contain;
        content: '';
        height: 20px;
        left: 0;
        position: absolute;
        top: 1px;
        width: 20px;
      }

      #live:before {
        background: url(data:image/png;base64,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)
          no-repeat 50% / contain;
        content: '';
        height: 20px;
        left: 0;
        position: absolute;
        top: 1px;
        width: 20px;
      }

      #friend:before {
        background: url(data:image/png;base64,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)
          no-repeat 50% / contain;
        content: '';
        height: 20px;
        left: 0;
        position: absolute;
        top: 1px;
        width: 20px;
      }
    }
  }
}
</style>
