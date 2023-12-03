<script setup lang="ts">
import PopUp from '@/components/header/pop-up/index.vue'
import MessageReply from '@/components/header/message-box/message-reply.vue'
import { ref } from 'vue'
import { state } from './index'

const isClick = ref(false)
const isHover = ref(false)

const handleClick = () => {
  state.isShow = true
  state.widthPx = '240px'
}
const handleExpand = () => {
  state.expand = !state.expand
  state.expand ? (state.widthPx = '240px') : (state.widthPx = '72px')
}
</script>
<template>
  <pop-up :title="'私信'">
    <template #icon>
      <span class="head-icon" @click="handleExpand">
        <template v-if="state.isShow">
          <template v-if="state.expand">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 24 24"
            >
              <rect
                y="4"
                width="14"
                height="2"
                rx="1"
                fill="#2F3035"
                fill-opacity="0.4"
              ></rect>
              <rect
                y="11"
                width="14"
                height="2"
                rx="1"
                fill="#2F3035"
                fill-opacity="0.4"
              ></rect>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.293 6.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L21.586 12l-4.293-4.293a1 1 0 010-1.414z"
                fill="#2F3035"
                fill-opacity="0.4"
              ></path>
              <rect
                y="18"
                width="14"
                height="2"
                rx="1"
                fill="#2F3035"
                fill-opacity="0.4"
              ></rect>
            </svg>
          </template>
          <template v-else="state.expand">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 24 24"
            >
              <rect
                width="14"
                height="2"
                rx="1"
                transform="matrix(-1 0 0 1 24 4)"
                fill="#2F3035"
                fill-opacity="0.4"
              ></rect>
              <rect
                width="14"
                height="2"
                rx="1"
                transform="matrix(-1 0 0 1 24 11)"
                fill="#2F3035"
                fill-opacity="0.4"
              ></rect>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.707 6.293a1 1 0 00-1.414 0l-5 5a1 1 0 000 1.414l5 5a1 1 0 001.414-1.414L2.414 12l4.293-4.293a1 1 0 000-1.414z"
                fill="#2F3035"
                fill-opacity="0.4"
              ></path>
              <rect
                width="14"
                height="2"
                rx="1"
                transform="matrix(-1 0 0 1 24 18)"
                fill="#2F3035"
                fill-opacity="0.4"
              ></rect>
            </svg>
          </template>
        </template>
      </span>
    </template>
    <template #center>
      <div class="message-list" style="height: 300px">
        <div
          class="message-list-item"
          style="height: 60px; transform: translateY(0px)"
          @click="handleClick"
          @mouseover="isHover = true"
          @mouseleave="isHover = false"
        >
          <div
            class="conversation-item"
            :class="{ clicked: isClick || isHover }"
          >
            <div class="conversation-item-content">
              <div class="conversation-item-content-left">
                <img
                  class="conversation-img img-radius"
                  src="https://p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_0c94be53de3889fb1c14c6ddcd1b9a68.jpeg?from=3782654143"
                />
              </div>
              <div
                class="conversation-item-content-right default"
                :class="{ hovered: isHover }"
              >
                <div class="author">
                  <div class="author-name">asfasf</div>
                </div>
                <div class="msg">
                  <div class="msg-content B5nTXsAM">
                    <pre class="msg-text">是啊</pre>
                  </div>
                  <div class="date">&nbsp;·&nbsp;06-27</div>
                </div>
              </div>
            </div>
            <div class="qoGdIX8w"></div>
          </div>
        </div>
      </div>
    </template>

    <template #right>
      <message-reply />
    </template>
  </pop-up>
</template>

<style lang="scss" scoped>
.head-icon {
  cursor: pointer;
  position: absolute;
  right: 24px;
  top: 16px;
}
html.dark .conversation-item.clicked {
  background: linear-gradient(
    90deg,
    #252632,
    #33343f 33.44%,
    #33343f 66.56%,
    #252632
  );
}
.message-list {
  position: relative;
  width: 100%;

  .message-list-item {
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .conversation-item {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 64px;
    overflow-x: visible;
    padding-left: 6px;
    width: 100%;

    &.clicked {
      background: linear-gradient(
        90deg,
        #fff,
        #f2f2f4 33.33%,
        #f2f2f4 66.67%,
        #fff
      );
    }

    .conversation-item-content {
      align-items: center;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      height: 60px;
      justify-content: space-between;
      padding: 10px;
      width: 100%;
    }
    .conversation-item-content-left {
      height: 40px;
      margin-right: 12px;
      position: relative;
      width: 40px;

      .conversation-img {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .img-radius {
        border-radius: 20px;
        height: 40px;
        width: 40px;
      }
    }

    .hovered {
      opacity: 1;
      width: 0;
    }
    .default {
      opacity: 0;
      overflow: hidden;
      width: 0;
    }

    .conversation-item-content-right {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 0;
      justify-content: center;
      max-width: calc(100% - 52px);
      opacity: 1;
      transition: all 0.4s;

      .author {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        position: relative;
        width: 100%;
        .author-name {
          // color: #161823;
          color: var(--color-text-t1);
          // color: rgba(22, 24, 35, 1);
          font-size: 13px;
          font-weight: 400;
          line-height: 21px;
          overflow-x: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .msg {
        align-items: center;
        // color: rgba(22, 24, 35, 0.6);
        color: var(--color-text-t3);
        display: flex;
        flex-direction: row;
        font-size: 12px;
        letter-spacing: 0.6px;
        line-height: 20px;
        overflow-x: hidden;
        width: 100%;
        .msg-content {
          flex-shrink: 1;
          overflow: hidden;

          .msg-text {
            font-size: 12px;
            letter-spacing: 0.6px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .date {
          // color: rgba(22, 24, 35, 0.34);
          color: var(--color-text-t4);
          flex-grow: 0;
          flex-shrink: 0;
          text-align: right;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
