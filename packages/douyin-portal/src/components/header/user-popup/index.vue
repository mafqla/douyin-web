<script setup lang="ts">


const { src, nickname, likeCount, followersCount, followingsCount,
  postsCount
} = defineProps({
  isLogin: {
    type: Boolean,
    required: true,
    default: false
  },
  src: {
    type: String,
    default: ''
  },
  nickname: {
    type: String,
  },
  likeCount: {
    type: Number,
  },
  // 关注
  followingsCount: {
    type: Number,
  },
  // 粉丝
  followersCount: {
    type: Number
  },
  postsCount: {
    type: Number,

  },
  //收藏数量
  collectCount: {
    type: Number
  },
  // 稍后再看
  watchLaterCount: {
    type: Number
  }


})
</script>
<template>
  <div class="right-popover">
    <ul class="right-popover-content">
      <div class="user-menu-panel">
        <div class="popover-content">
          <div class="popover-content-header">
            <svg-icon class="icon-user" icon="user-avatar" v-if="!isLogin" />
            <router-link to="/user/self?showTab=post" class="content-center-link" v-if="isLogin">
              <dy-avatar :src="src" size="common" />
            </router-link>
            <div class="popover-userinfo" v-if="isLogin">
              <router-link to="/user/self?showTab=post" class="content-center-link">
                {{ nickname }}
              </router-link>
              <div class="social-metrics">
                <p class="metric-item">
                  <span class="label">关注</span>
                  <span class="value">{{ followingsCount }}</span>
                </p>
                <div class="separator"></div>
                <p class="metric-item">
                  <span class="label">粉丝</span>
                  <span class="value">{{ followersCount }}</span>
                </p>
              </div>
            </div>

            <div class="user-authentication" v-if="!isLogin">
              <div class="login-status">
                未登录
              </div>
              <div class="login-benefits">
                <span>登录后即可观看喜欢、收藏作品</span>
              </div>
            </div>
          </div>
          <div class="user-profile-actions">
            <router-link to="/user/self?showTab=like" class="action-link">
              <svg-icon class="icon" icon="like" />
              <p class="action-link-text">我的喜欢</p>
              <p class="action-link-num">
                {{ likeCount }}
              </p>
              <svg-icon class="chevron-right" icon="chevron-right" />
            </router-link>
            <router-link to="/user/self?showTab=favorite_collection" class="action-link ">
              <svg-icon class="icon" icon="my-collect" />
              <p class="action-link-text">我的收藏</p>
              <p class="action-link-num">
                {{ collectCount }}
              </p>
              <svg-icon class="chevron-right" icon="chevron-right" />
            </router-link>
            <router-link to="/user/self?showTab=record" class="action-link">
              <svg-icon class="icon" icon="history" />
              <p class="action-link-text">观看历史</p>
              <p class="action-link-num" v-if="isLogin">
                30天内
              </p>
              <svg-icon class="chevron-right" icon="chevron-right" />
            </router-link>
            <router-link to="/user/self?showTab=watch_later" class="action-link ">
              <svg-icon class="icon" icon="watch-later" />
              <p class="action-link-text">稍后再看</p>
              <p class="action-link-num">
                {{ watchLaterCount }}
              </p>
              <svg-icon class="chevron-right" icon="chevron-right" />
            </router-link>
            <router-link to="/user/self?showTab=post" class="action-link ">
              <svg-icon class="icon" icon="zuopin" />
              <p class="action-link-text">我的作品</p>
              <p class="action-link-num">
                {{ postsCount }}
              </p>
              <svg-icon class="chevron-right" icon="chevron-right" />
            </router-link>
          </div>

          <div class="divider"></div>
          <div class="order-actions">
            <div class="order-link">
              <svg-icon class="order-icon" icon="order" />
              <p class="order-text">我的订单</p>
            </div>
          </div>
          <div class="divider"></div>

          <div class="order-actions" v-if="!isLogin">
            <div class="order-link">
              <svg-icon class="order-icon" icon="keyboard" />
              <p class="order-text">键盘快捷键</p>
            </div>
          </div>
          <div class="order-actions" v-if="!isLogin">
            <div class="order-link">
              <svg-icon class="order-icon" icon="live-small" />
              <p class="order-text">直播伴侣</p>
            </div>
          </div>

          <div class="user-actions" v-if="isLogin">
            <div class="logout-action">
              <svg-icon icon="logout" class="logout-icon" />
              <p class="logout-text" @click="$emit('logout')">退出登录</p>
            </div>
            <div class="trust-login">
              <div class="login-tips">
              </div>
              <SwitchButton />
            </div>


          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.right-popover {
  background: var(--color-bg-b1-white);
  border-radius: 16px;
  box-shadow: var(--shadow-1);
  display: block;
  overflow: hidden;
  padding: 0 !important;
  position: absolute;
  right: -2px;

  .right-popover-content {
    background: var(--color-bg-b1-white);
    border-radius: 4px;
    box-shadow: none;
    animation: 0.4s cubic-bezier(0.34, 0.69, 0.1, 1) 0s 1 normal forwards running identifier;
  }

  @keyframes identifier {
    0% {
      transform: translateY(-80px);
    }

    100% {
      transform: translateY(0px);
    }
  }


  .user-menu-panel {
    background-color: var(--color-bg-b1-white);
    border-radius: 16px;
    padding: 16px 0px 14px;
  }

  .popover-content {
    min-height: 250px;
    max-height: calc(100vh - 12px - var(--header-height) - 30px);
    overflow-y: auto;

    .popover-content-header {
      display: flex;
      margin: 0px 16px;

      .icon-user {
        width: 50px;
        height: 50px;
        margin-right: 16px;
      }

      .popover-userinfo {
        width: 185px;
        margin-left: 16px;

        .content-center-link {
          width: 157px;
          color: var(--color-text-t1);
          text-overflow: ellipsis;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
        }

        .social-metrics {
          color: var(--color-text-t3);
          height: 21px;
          font-size: 13px;
          font-weight: 400;
          line-height: 21px;
          display: flex;

          .metric-item {
            max-width: 80px;
            cursor: pointer;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            .label {
              margin-right: 4px;
            }
          }

          .separator {
            width: 1px;
            background-color: var(--color-line-l3);
            height: 13px;
            margin: 4px 12px;
          }
        }
      }

      .user-authentication {
        width: 185px;
        margin-left: 16px;

        .login-status {
          font-size: 16px;
          line-height: 24px;
          width: 157px;
          color: var(--color-text-t1);
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 6px;
          font-weight: 500;
          overflow: hidden;
        }

        .login-benefits {
          color: var(--color-text-t3);
          height: 21px;
          font-size: 13px;
          font-weight: 400;
          line-height: 21px;
          display: flex;

          width: auto;
          max-width: auto;
          font-size: 12px;
          line-height: 20px;
        }
      }
    }

    .user-profile-actions {
      cursor: pointer;
      margin: 12px 16px;

      &> :not(:last-child) {
        margin-bottom: 8px;
      }

      .action-link {
        color: var(--color-text-t1);
        background-color: var(--color-bg-b2);
        align-items: center;
        display: flex;
        border-radius: 12px;
        padding: 8px;
        position: relative;

        &:hover {
          color: var(--color-text-t0);
          background-color: var(--color-bg-b3);
        }

        .icon {
          width: 24px;
          height: 24px;
        }

        .action-link-text {
          margin-left: 4px;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
        }

        .action-link-num {
          text-align: right;
          font-size: 13px;
          font-weight: 500;
          line-height: 21px;
          flex: 1 1 0%;
        }

        .chevron-right {
          width: 16px;
          height: 17px;
        }
      }
    }

    .divider {
      width: 100%;
      height: 1px;
      min-height: 1px;
      background-color: var(--color-line-l3);
      display: block;
      position: relative;
    }


    .order-actions {
      position: relative;
      margin: 4px 0px;
      padding: 0px 16px;



      .order-link {
        color: var(--color-text-t3);
        cursor: pointer;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        display: flex;
        padding: 8px;

        &:hover {
          color: var(--color-text-t0);
          border-radius: 12px;
          background-color: var(--color-fill-hover);

          .order-icon {
            color: var(--color-text-t0);
          }
        }

        .order-icon {
          width: 24px;
          height: 24px;

        }

        .order-text {
          margin-left: 4px;
        }
      }
    }

    .user-actions {
      align-items: center;
      display: flex;
      margin: 12px 16px 0px;

      .logout-action {
        color: var(--color-text-t3);
        cursor: pointer;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        display: flex;
        height: 24px;
        margin: 0px auto 0px 8px;
        padding: 0px;

        &:hover {
          color: var(--color-text-t0);
          border-radius: 12px;

          .logout-icon {
            color: var(--color-text-t0);
          }
        }

        .logout-icon {
          width: 24px;
          height: 24px;
        }

        .logout-text {
          margin-left: 5px;

        }
      }

      .trust-login {
        align-items: center;
        display: inline-flex;
        position: relative;
        justify-content: flex-end;
        flex: 1 1 0%;

      }
    }
  }
}
</style>