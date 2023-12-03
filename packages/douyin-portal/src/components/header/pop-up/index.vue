<script setup lang="ts">
import { ref } from 'vue'
import { state } from '@/components/header/message-box/index'
defineProps({
  title: String
})

//是否展开
const isExpand = ref(true)

//点击展开
const handleClick = () => {
  state.expand = !state.expand
  state.expand ? (state.widthPx = '240px') : (state.widthPx = '72px')
}
</script>
<template>
  <div class="pop-up">
    <div class="pop-up-content">
      <div class="pop-up-main heightPx">
        <div class="pop-up-left">
          <div class="list-container widthPx">
            <div class="head">
              <div class="head-title" :class="{ hide: !state.expand }">
                <span>{{ title }}</span>
              </div>
              <slot name="icon" />
            </div>
            <div class="center" style="padding-bottom: 4px">
              <download-btn v-if="!state.isShow" />
              <slot name="center" />
              <div class="nomore" v-if="state.expand">暂时没有更多了</div>

              <template v-if="false">
                <div class="error-page a0rPI9sE">
                  <div class="img-content">
                    <div class="img"></div>
                  </div>
                  <div class="error-text QsJounSG">暂无私信</div>
                  <div class="yCJWkVDx"></div>
                  <div class="nIacgv9o"></div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <slot name="right" />
        <template v-if="state.isShow">
          <svg
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="close-icon marginPx"
            viewBox="0 0 13 13"
          >
            <path
              d="M11.867 11.867a1.211 1.211 0 01-1.712 0l-3.71-3.71-3.711 3.71a1.211 1.211 0 11-1.713-1.712l3.71-3.71-3.71-3.711A1.21 1.21 0 112.734 1.02l3.71 3.71 3.71-3.71a1.211 1.211 0 011.713 1.713l-3.71 3.71 3.71 3.71c.473.474.473 1.24 0 1.713z"
              fill="#2F3035"
              fill-opacity="0.7"
            ></path>
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pop-up {
  // border-radius: 4px;
  border-radius: 12px;
  font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
  font-weight: 400;
  height: auto;
  position: fixed;
  right: 30px;
  // top: 60px;
  // top: var(--header-height);
  top: 68px;
  width: auto;
  z-index: 503;

  & {
    animation: identifier 0.4s ease-in;
    animation-fill-mode: forwards;
    overflow: hidden;
  }

  @keyframes identifier {
    0% {
      box-shadow: none;
    }

    100% {
      // box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
      box-shadow: var(--shadow-1);
    }
  }

  .pop-up-content {
    animation: Gx9BaeRM;
    animation-duration: 0.4s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.34, 0.69, 0.1, 1);
    cursor: auto;
    visibility: visible;

    .pop-up-main {
      background-color: var(--color-bg-b1);
      display: flex;
      height: 70vh;
      max-height: 700px;
      min-height: 536px;
      &.heightPx,
      .xGjPYgWx {
        height: auto;
      }
      .pop-up-left {
        // border-right: 1px solid rgba(22, 24, 35, 0.06);
        border-right: 1px solid var(--color-line-l3);
        position: relative;

        .list-container {
          align-items: center;

          background-color: var(--color-bg-b1-white);
          border-radius: 4px;
          height: 100%;
          overflow: hidden;
          width: 320px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          &.widthPx {
            width: v-bind('state.widthPx');
          }

          .head {
            align-items: center;

            background: linear-gradient(
              0deg,
              var(--im-header-bg-start) 0,
              var(--im-header-bg-end) 100%
            );

            border-bottom: 1px solid var(--color-line-l3);
            display: flex;
            flex-grow: 0;
            flex-shrink: 0;
            height: 56px;
            justify-content: space-between;
            padding: 0 16px;
            width: 100%;

            .head-title {
              // color: #161823;
              color: var(--color-text-t1);
              // color: rgba(22, 24, 35, 1);
              flex-shrink: 0;
              font-size: 16px;
              font-weight: 500;
              opacity: 1;
              transition: all 0.2s linear;
              white-space: nowrap;
              &.hide {
                opacity: 0;
                width: 0;
              }
            }
          }
          .center {
            flex-grow: 1;
            flex-shrink: 1;
            max-height: calc(70vh - 56px);
            min-height: 480px;
            overflow: hidden;
            overflow-y: scroll;
            width: 100%;

            & .nomore {
              // color: rgba(22, 24, 35, 0.34);
              color: var(--color-text-t4);
            }
            & .nomore {
              font-size: 12px;
              letter-spacing: 0.6px;
              line-height: 20px;
              margin: 24px 0 39px;
              text-align: center;
            }

            .center .nomore {
              font-size: 12px;
              letter-spacing: 0.6px;
              line-height: 20px;
              margin: 24px 0 39px;
              text-align: center;
              // color: rgba(22, 24, 35, 0.34);
              color: var(--color-text-t4);
            }

            .a0rPI9sE {
              left: 50%;
              min-height: auto;
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);

              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
            .error-page {
              --unfollow-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/Unfollow.05a1cb9c.png);
              --emptyList-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/EmptyList.82c3fe11.png);
              --commentTmptyList-image: url(data:image/png;base64,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);
              --emptySearch-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/EmptySearch.19da93c9.png);
              --noLogin-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/NoLogin.f32770e8.png);
              --notFound-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/NotFound.3933d7c5.png);
              --noNetwork-image: url(https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/NoNetwork.png);
              --serverError-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/ServerError.33c682c5.png);

              align-items: center;
              display: flex;
              flex-direction: column;
              justify-content: center;
              min-height: 100%;
              position: relative;
              width: 100%;

              .img-content {
                margin-bottom: 27px;
                position: relative;

                .img {
                  background-image: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/image/EmptyList.82c3fe11.png);
                  background-image: var(--emptyList-image);
                }
                .PSP9nKme,
                .img {
                  background-size: 100% 100%;
                  height: 160px;
                  width: 240px;
                }
              }
              .error-text,
              .yCJWkVDx {
                margin-bottom: 8px;
                position: relative;
              }

              .error-text {
                // color: #161823;
                color: var(--color-text-t1);
                // color: rgba(22, 24, 35, 1);
                font-family: sans-serif -apple-system, BlinkMacSystemFont,
                  Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
                  Droid Sans, Helvetica Neue;
                font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
                font-size: 18px;
                font-weight: 500;
                line-height: 26px;
              }
              .yCJWkVDx {
                // color: rgba(22, 24, 35, 0.6);
                color: var(--color-text-t3);
                font-family: sans-serif -apple-system, BlinkMacSystemFont,
                  Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
                  Droid Sans, Helvetica Neue;
                font-size: 14px;
                line-height: 22px;
              }
              .error-text,
              .yCJWkVDx {
                margin-bottom: 8px;
                position: relative;
              }
              .nIacgv9o {
                display: flex;
                margin-top: 24px;
                position: relative;
              }
            }
          }
        }
      }

      .close-icon.marginPx {
        margin-top: 11px;
      }
      .close-icon {
        cursor: pointer;
        height: 32px;
        margin-right: 16px;
        margin-top: 12px;
        padding: 9.5px;
        position: absolute;
        right: 0;
        top: 0;
        width: 32px;

        path {
          fill: var(--color-text-t3);
        }
      }
    }
  }
  @keyframes Gx9BaeRM {
    0% {
      transform: translateY(-80px);
    }
    100% {
      transform: translateY(0);
    }
  }
}
</style>
