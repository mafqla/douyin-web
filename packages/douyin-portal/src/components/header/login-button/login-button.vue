<script setup lang="ts">
import useTheme from '@/hooks/useTheme'
import {} from 'vue'
const { toggleTheme } = useTheme()
</script>
<template>
  <div class="login-button">
    <el-popover :show-arrow="false" placement="bottom-end">
      <template #reference>
        <el-button class="login-button" color="#fe2c55">
          <svg-icon class="user-avatar-icon" icon="circle_close" />
          <span class="login-button-title">登录</span>
        </el-button>
      </template>
      <template #default>
        <div class="right-popover">
          <ul class="right-popover-content">
            <div class="popover-content">
              <div class="popover-content-header">
                <div class="content-header"></div>
              </div>
              <ul class="popover-content-center">
                <ul class="content-center-content">
                  <a href="#" class="content-center-link">
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="zuopin" />
                      <p class="content-center-subtitle">我的作品</p>
                    </li>
                  </a>
                  <div class="content-cneter-blank"></div>
                </ul>
                <ul class="content-center-content">
                  <a href="#" class="content-center-link">
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="like" />
                      <p class="content-center-subtitle">我的喜欢</p>
                    </li>
                  </a>
                  <div class="content-cneter-blank"></div>
                </ul>
                <ul class="content-center-content">
                  <a href="#" class="content-center-link">
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="my-collect" />
                      <p class="content-center-subtitle">我的收藏</p>
                    </li>
                  </a>
                  <div class="content-cneter-blank"></div>
                </ul>
                <ul class="content-center-content">
                  <a href="#" class="content-center-link">
                    <li class="content-center-item">
                      <svg-icon class="icon" icon="history" />
                      <p class="content-center-subtitle">观看历史</p>
                    </li>
                  </a>
                </ul>
              </ul>
              <div class="popover-content-center-t"></div>
              <ul class="popover-content-footer">
                <li>
                  <div class="footer-item">
                    <a href="#" class="content-center-link">个人主页</a>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li>
                  <div class="footer-item">
                    <a href="#" class="content-center-link">抖币充值</a>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li>
                  <div class="footer-item">
                    <a href="#" class="content-center-link">直播伴侣</a>
                    <div class="footer-item-b"></div>
                  </div>
                </li>
                <li class="huanfu" @click="toggleTheme">
                  <div class="huanfu-content">
                    <svg-icon class="huanfu-icon" icon="huanfu" />
                    <span class="huanfu-title">换肤</span>
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
.login-button {
  width: 112px;
  height: 36px;
  line-height: 36px;
  margin-left: 16px;
  border-radius: 4px;
  color: rgb(255, 255, 255);
  font-size: 15px;
  font-weight: 400;
  display: flex;
  align-items: center;

  .user-avatar-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
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
  background: var(--color-bg-b1-white);
  border-radius: 4px;
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
