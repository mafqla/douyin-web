<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import SwitchButton from '@/components/my/user-header/switch-button.vue'
import { userStore } from '@/stores/user'
import { videoStore } from '@/stores/videos'
import useTheme from '@/hooks/useTheme'

//是否登录
let isLogin: any = ref(false)
const src = ref('')
const store = userStore()

watchEffect(() => {
  // console.log(store.isLogin())
  isLogin.value = store.isLogin()
  src.value = store.userInfo.avatar
})
const { toggleTheme } = useTheme()
</script>
<template>
  <div class="header-right-avatar">
    <el-popover :show-arrow="false" placement="bottom-end">
      <template #reference>
        <el-avatar size="small" :src="src" />
      </template>
      <template #default>
        <div class="right-popover">
          <ul class="right-popover-content">
            <div class="popover-content">
              <div class="popover-content-header">
                <div class="content-header"></div>
                <switch-button />
              </div>
              <ul class="popover-content-center">
                <ul class="content-center-content">
                  <router-link
                    to="/user/self?showTab=post"
                    class="content-center-link"
                  >
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="zuopin" />
                      <p class="content-center-num">
                        {{ store.userInfo.uploadVideosCount }}
                      </p>
                      <p class="content-center-subtitle">我的作品</p>
                    </li>
                  </router-link>
                  <div class="content-cneter-blank"></div>
                </ul>
                <ul class="content-center-content">
                  <router-link
                    to="/user/self?showTab=like"
                    class="content-center-link"
                  >
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="like" />
                      <p class="content-center-num">
                        {{ store.userInfo.likeVideosCount }}
                      </p>
                      <p class="content-center-subtitle">我的喜欢</p>
                    </li>
                  </router-link>
                  <div class="content-cneter-blank"></div>
                </ul>
                <ul class="content-center-content">
                  <router-link
                    to="/user/self?showTab=favorite_collection"
                    class="content-center-link"
                  >
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="my-collect" />
                      <p class="content-center-num">
                        {{ store.userInfo.collectVideosCount }}
                      </p>
                      <p class="content-center-subtitle">我的收藏</p>
                    </li>
                  </router-link>
                  <div class="content-cneter-blank"></div>
                </ul>
                <ul class="content-center-content">
                  <router-link
                    to="/user/self?showTab=record"
                    class="content-center-link"
                  >
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="history" />
                      <p class="content-center-num">
                        <span>30</span><span class="num-title">天内</span>
                      </p>
                      <p class="content-center-subtitle">观看历史</p>
                    </li>
                  </router-link>
                </ul>
              </ul>
              <div class="popover-content-center-t"></div>
              <ul class="popover-content-footer">
                <li>
                  <div class="footer-item">
                    <router-link
                      to="/user/self?showTab=post"
                      class="content-center-link"
                    >
                      个人主页
                    </router-link>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li>
                  <div class="footer-item">
                    <router-link
                      to="/user/self?showTab=post"
                      class="content-center-link"
                      >抖币充值
                    </router-link>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li>
                  <div class="footer-item">
                    <router-link
                      to="/user/self?showTab=post"
                      class="content-center-link"
                      >直播伴侣
                    </router-link>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li>
                  <div class="footer-item">
                    <span @click="store.logout()">退出登录</span>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li class="huanfu" @click="toggleTheme">
                  <div class="huanfu-content">
                    <svg-icon class="huanfu-icon" icon="huanfu" />
                    <span class="huanfu-title">换肤</span>
                  </div>
                </li>
                <li class="shezhi">
                  <div class="shezhi-content">
                    <svg-icon class="shezhi-icon" icon="shezhi" />
                    <span class="shezhi-title">设置</span>
                  </div>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.header-right-avatar {
  width: 32px;
  height: 32px;
  margin-left: 16px;

  .el-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    user-select: none;
  }
}
</style>
<style lang="scss">
.el-popover,
.el-popover.el-popper,
.el-popper.is-light {
  width: 0 !important;
  height: 0 !important;
  border: none !important;
  padding: 0;
}
.right-popover {
  //background: #fff;
  // background: rgba(249, 249, 249, 1);
  background: var(--color-bg-b1-white);
  border-radius: 4px;
  // box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  box-shadow: var(--shadow-1);
  display: block;
  overflow: hidden;
  padding: 8px;
  padding: 0 !important;
  position: absolute;
  right: -2px;

  .right-popover-content {
    // background: #fff;
    background: var(--color-bg-b1-white);
    border-radius: 4px;
    box-shadow: none;
  }
  .popover-content {
    display: flex;
    flex-direction: column;
    z-index: 2;

    .popover-content-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 20px 24px 2px;
      width: 100%;

      .content-header {
        color: rgba(22, 24, 35, 0.34);
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;
        max-width: 145px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .popover-content-center {
      display: flex;
      margin: 14px 16px;

      .content-center-content {
        align-items: center;
        display: flex;
        .content-center-link {
          .content-center-item {
            display: flex;
            flex-direction: column;
            height: 98px !important;
            justify-content: center !important;
            margin: 0 !important;
            width: 72px;
            align-items: center;
            // color: rgba(22, 24, 35, 0.75);
            color: var(--color-text-t2);
            display: flex;
            font-size: 14px;
            height: auto;
            justify-content: flex-start;
            line-height: 22px;
            margin: 16px 17px;
            padding: 0;
            position: relative;
            white-space: nowrap;

            .icon {
              width: 32px;
              height: 32px;
            }
            .content-center-num {
              align-items: center;
              //color: #161823;
              color: var(--color-text-t1);
              display: flex;
              font-size: 16px;
              font-weight: 500;
              line-height: 24px;
              margin-bottom: 2px;
              margin-top: 2px;

              .num-title {
                font-size: 13px;
              }
            }
            .content-center-subtitle {
              //color: rgba(22, 24, 35, 0.34);
              color: var(--color-text-t4);
              font-size: 12px;
              line-height: 20px;
            }
          }
        }

        .content-cneter-blank {
          display: block;
          height: 32px;
          min-width: 0.5px;
          position: relative;
          width: 0.5px;
        }
      }

      .content-center-content:not(:last-of-type) {
        flex-grow: 1;
      }
    }

    .popover-content-center-t {
      background-color: rgba(22, 24, 35, 0.06);
      display: block;
      height: 1px;
      min-height: 1px;
    }

    .popover-content-footer {
      display: flex;
      flex-wrap: nowrap;
      width: unset;

      li {
        margin: 24px 16px 24px 0 !important;
        width: 56px;
      }
      li:first-child {
        margin-left: 24px !important;
      }
      .footer-item {
        //color: #161823;
        color: var(--color-text-t1);
        cursor: pointer;
        font-weight: 400;

        .footer-item-b {
          cursor: default;
        }
      }

      .huanfu {
        .huanfu-content {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: flex-start;

          .huanfu-icon {
            width: 24px;
            height: 20px;
            margin-left: 8px;
            transform: scale(0.7);
            fill: currentColor;
            color: var(--color-text-t4);
          }

          &::before {
            border-left: 1px solid;
            //color: #f2f2f4;
            color: var(--color-secondary-default);
            content: '';
            height: 12px;
          }
          .huanfu-title {
            color: var(--color-text-t4);
            font-size: 12px;
            margin-bottom: -1px;
          }
        }
      }

      .huanfu,
      .shezhi {
        align-items: center;
        display: flex;
        justify-content: flex-start;
        margin: 24px 16px 24px 0 !important;
        padding: 0;
        position: relative;
        white-space: nowrap;
        width: 56px;
      }
      .shezhi {
        margin: 24px 16px 24px -8px !important;
        .shezhi-content {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: flex-start;

          .shezhi-icon {
            width: 15.4px;
            height: 15.4px;
            margin: 0 4px -1px 0;
            transform: scale(1.1);
          }
          .shezhi-title {
            color: var(--color-text-t4);
            font-size: 12px;
            margin-bottom: -1px;
          }
        }
      }
    }
  }
}
</style>
