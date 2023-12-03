<script setup lang="ts">
import { ref } from 'vue'
import { state } from './index'
//退出会话
const handleExit = () => {
  state.isShow = false
  state.widthPx = '320px'
}

const isShowMore = ref(false)
const handleMouseOver = () => {
  isShowMore.value = true
}
const handleMouseLeave = () => {
  isShowMore.value = false
}
</script>
<template>
  <div class="message-reply" v-if="state.isShow">
    <div class="conversaton-detail-content">
      <div class="action-bar">
        <div class="action-user">
          <div class="action-user-content">
            <div class="action-user-text-common action-user-text">
              <span>小虞干</span>
            </div>
            <div class="guMCwLUf"></div>
          </div>
        </div>
        <div class="TJ58phG3"></div>
        <span class="action-exit" @click="handleExit">退出会话</span>
        <div class="action-follow">关注</div>
        <div
          class="action-more"
          @mouseover="handleMouseOver"
          @mouseleave="handleMouseLeave"
        >
          <div class="action-more-content">
            <svg
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="action-more-content-icon"
              viewBox="0 0 16 4"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.556 1.778a1.778 1.778 0 11-3.556 0 1.778 1.778 0 013.556 0zm6.222 0a1.778 1.778 0 11-3.556 0 1.778 1.778 0 013.556 0zm4.444 1.778a1.778 1.778 0 100-3.556 1.778 1.778 0 000 3.556z"
                fill="#2F3035"
                fill-opacity="0.7"
              ></path>
            </svg>

            <action-more v-if="isShowMore" />
          </div>
        </div>
      </div>
      <div class="message-view qjvN52Cy" style="height: 529px">
        <div class="message-view-content">
          <div></div>
          <div class="MQoDyyMe"></div>
          <div class="message-view-reply paddingPx">
            <div class="message-view-date">2023-06-26 18:17</div>
            <div
              style="display: flex; justify-content: right; position: relative"
            >
              <div class="msg-item msg-item-right">
                <div class="right msg-item-content">
                  <div class="msg-item-text-content text-right">
                    <div>
                      <div class="first-text">
                        对方关注或回复你之前，可发送一条文字消息。请礼貌发言，自觉遵守《抖音自律公约》
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="message-view-reply paddingPx">
            <div
              style="display: flex; justify-content: right; position: relative"
            >
              <div class="msg-item msg-common msg-item-right">
                <div class="user-logo-box user-logo-box-size cursorAction">
                  <img
                    class="dIUpgpVW user-logo-box user-logo-box-size"
                    src="https://p6.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?from=3782654143"
                  />
                </div>
                <div class="right msg-item-content">
                  <div class="msg-item-text-content text-right">
                    <div>
                      <div class="reply-text reply-me">
                        <span class="reply-text-span"
                          ><span
                            ><span
                              ><span><pre>是啊</pre></span></span
                            ></span
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      class="qtQPgNmc LIotLtJ5 qoTdhsWp OG5i3RDU"
                      style="bottom: 0px"
                    >
                      <div class="zAJ75W4c">
                        <div class="gjzxrohn">
                          <img
                            class="J5JegD57"
                            src="data:image/png;base64,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"
                          />
                          <div class="Kg9QMT2u">点赞</div>
                        </div>
                        <div class="gjzxrohn">
                          <img
                            class="J5JegD57"
                            src="data:image/png;base64,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"
                          />
                          <div>回复</div>
                        </div>
                        <div class="gjzxrohn">
                          <img
                            class="J5JegD57"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA1CAYAAAADOrgJAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAe6SURBVHgB3VrNaxtHFJ/dlSx/1XIlFGPjODb4EhtMinsxNNQQAnEuvTSnHgpuC03/hRzydUkPPfTQ9NzQnkwggfZQenFCcjKmScGGgKkl2yTIttZSbDn63OnvzWoVaTUrrbRL8/GD0a52ZufNe/PmfcwsY+8JFOYvFPa6T7ryS5cuKdPT03xtbU1ZWlritXXWS4ZhcFVVrb+cdQA/GVGTyfREJNL3Ge4HmzXEwBUMvG7Auq7/MjQ0tMlMRjpixitIGOru7u4k5/yAdw59b2/vY/SlMf81pTWuXbumzs7OBkul0h3uEYVC4Q5js0ESDP76woyl62qLohET4+Pj3cVi8R/uEeVyOY4+u1GIGc1O7+rVq9V7tLXGp1gDrgNJgpBOZz/q6+v6ErocxjM7k6Ip3UPf6R21q6vrC+YDcrnCb8GgZtQOSUYXNNO6nv1xaGgwjv+GvR/B5eHh4ef83YCBsZ5j5uzVM0KqAik/5e8ISiVjeWpqqku1M5LJZGihNTWfbxPgfk6trxeUOkbIecH6KFhIW+wdQT5ffDQ+XqpnhDxvIBDgKysrl6Febz0zGGNidfXJrd7eXqPOanHTYmmjo6PB4+Pj4OPHjz8tFg0wW660sNaU/X/tM1ZT5/RMY637LDv2gaCAZ7PZ9MLCwhNd7y3Oz08W7eZXgYOjosI3BPL5vGoYMahaXgV/4LMMPnVhDiORiKLr9c9MxFD2xHVvL8VjMUtYMfFb/4x0XOXJJN0lWSwWU+x9RCJlJZViLBqlMMakd+KExlOpAN47LjEWhuldLTt5TwXrRV1aYmxqag1imWbHxyvq8PCwsr29LRqQCkaj0fLq6iqHpVPoOj8/L+qWl5fFlf5b99Z/jIQ9ePCANQP19+rVKwWeXqxZKkSPCvwVX19fJ1ocfZP/aBmXiZnBCwF0uAh9jNvKUxA7R/XUjlWiAW6GFtJCwSKBrjXtBXMWTcLi4qJ2dHR0XkJzEzS/gpBpahTO3ceWghGEHzdkNhx6+jXzMcijgZH0sUY19P2NjCbU/QaNyU5TbdU5po+meUdWB/0ehzPS2pFMM2AyWDAYZKdPn6ZxjUuacBoLvLlYy3VjadYxN0doqUID4G9U6KvQB+YPLNV0BLTjpex5oNlLNEAsPA5TnAiHww31mqaNsfqs0BOg+yQ4NZFIaFjYp2RtcrlcBoaFUalFK9USOoOw5aW8ml6frLbzCjhkUZpDIyvJZCNxBGkWcQ5G0rL6QEDFjGyI0Ib5mNVRroH1J52RnZ1Ewj4bhKaMkOoT95ubm1JGQGwQjlOpSNGvPJtjHTgK5dmzZ5Z2tEVPIVMHy9QvM4WQXGJ0dK6H+Ztna2fOnOmlviUkDWxQ9FGqYX+ppfklHBwcGOgkI6tDdkrM+rpZQFtD0IYG60JjoJAGqkUevT0/gviHW51ICJLVqgtDPEKsNXKKToyMjIxY7dpWZYqGe5w2F+7evTtcmWpfZgVmN3Dv3r0RGa1CofiQxsIkqa0b1eI7OzvEvVS1sNh9zSbBBxsbG5P2CdvjOAuu1ggGSzGQNNEaGIiEyRz6FKYocLKsp6dHyggijJcUAcvqXDEiGtq2OC309YXCZKL9ilJoRvr7+8OyOuw8pZ3ec8OIEo/HydRKVSsUCvmmWiQMmF6lu7tbykipVLC0okGoLRlBlMknJychDbn5BfFBqJbik2pRLKUgAnYUTseqBUbYxsYGKxTyWw4dk/S4V9UiQSDXED6EdjdlTXK5okhPKyFR/TiYC9CMOK0RLE4iamWIHU/L9evXxeZHE0ZAi/GNjS6UVoGlHArt5D1//vwCl2dsv4LREKWfzDvUs2fPhqBeP8nCk62t7QvM3OBu0CRXix3mkDuH8kykpzWnUZ4AwUi9uglTVtiVb6hxbX6RYjpFwGGyajK97QC0W8KcQvh4fIPWKYcatm+1XCBMobw1EOYBZDAGBgYcx7S29m/GCw0Rys/MzPRxh1B+bm5OGv+0TQi7gBcvXmwawjNzjTTA1YxQdIvzPe4Uylf27LxmiQq5oq2tvLQPizZtzMnqXZlfVjGr1Jl9IVIoTzkJ8wUc/e1V04O6GtBOJoNGMrnccawlXnzx4oWjVYLVqu40Up+VnUdxBlgxy9UzR2Y7F6R662yQ9shUNeY0JksbpEJzK0kaQBA5yV+wKp/YK2HRbmOmDlBnWI7TaS+sGSoCiSDWuiypezgxMXEBKUWBNW7Ru1ctCuXLZSMTkLwBP/Od/VnNlwyuEQg4D4dCeNYEbVEzjHKCvSGQJTt58qRjvWtG6FRod3f3D/ZmgLOQ1O/7+/sG1lPnEQQFc5SXkx0/PMz+zP9f0BH07ZptIG9Ol5mzF4pEJgd0Pf099w6jVQEO0un0LaJJX1ewJk63He4EM+gweHQUCl658m30/PmFmQ8//GDM5NFgr6/NYLZB2oqQnUy7qd21XwzBqMBK5dP37//56ObNH3RdL8FSxUtoU3ZKJ9qdpsqR3N+B4eGsRsQNIwqPvIt+oqLB/r6OM0JTHa1nzkhRWFI9k0zRYaFAlNG5JDJFA2uzjMQOZ4XVz598+wSKQgkSgPAt9DVPRXdFodzl9XW2erXamFermP+td2r7ofsaZ9pS4J5iI1b5wMV2zxzua585gbt89v7iPyumW7cnO5rjAAAAAElFTkSuQmCC"
                          />
                          <div>删除</div>
                        </div>
                      </div>
                    </div>
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAMCAYAAAAgT+5sAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFNSURBVHgBzZTNTcQwEIXfOHDPFU6hg7BbAAkNsB3wU8LeuEEFQAfZDraD5I5g3QHLCW7kyCHJMI6wFEUrkR8H+CRLluyx582zh9AiDCMf+wjA8BVUxOATmYdE5OMfwMw5CJpZrYHyVXLV+EROXQ8I59GCQAsRdI4/QAqaybhFAa11lrfXOwuxiGMBeXTzG4JM9eWeh6qo7ncl36S3EMvUgqT6KRd8JQK2XfYPFmIJZ9GFUnQnRzn5Q+LCBylePj9mSZ+40UIM3+6k4k6AEYiIFy75tKsLTRQcYC6WBGJ5DhoDkdiNnDEbIsLgxBGLad20J86Awj5xtYiidiLHQJw4YjGJSEKxPJFV1xjZm4wVYXDqSJPjeZz81NGMiM1TegkHeJiI97ft+uDwyBQq2rHMMpYi4hqOmMwRi+lo8Lwzpbj+N1VFGmW5GvuU2nwBNq2Y0DdeoYYAAAAASUVORK5CYII="
                      class="VHSuxEgt uTssHjf3 y4aMJftQ lDpjLOJS"
                      style="bottom: 0px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="message-view-reply paddingPx">
            <div
              style="
                display: flex;
                justify-content: space-between;
                position: relative;
              "
            >
              <div class="msg-item msg-common">
                <div class="user-logo-box user-logo-box-size cursorAction">
                  <img
                    class="dIUpgpVW user-logo-box user-logo-box-size"
                    src="https://p6.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_0c94be53de3889fb1c14c6ddcd1b9a68.jpeg?from=3782654143"
                  />
                </div>
                <div data-e2e="right" class="msg-item-content">
                  <div class="msg-item-text-content">
                    <div>
                      <div class="reply-text">
                        <span class="reply-text-span"
                          ><span
                            ><span
                              ><span><pre>你在那边工作了？</pre></span></span
                            ></span
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="input-box"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-reply {
  height: 70vh;
  max-height: 700px;
  max-width: 500px;
  min-height: 536px;
  min-width: 360px;
  opacity: 1;
  overflow: hidden;
  width: 40vw;
}
// .message-reply {
//   max-height: 700px;
//   max-width: 500px;
//   min-height: 536px;
//   opacity: 0;
//   width: 0;
// }

.conversaton-detail-content {
  align-items: flex-start;
  background-color: var(--color-bg-b1-white);
  border-radius: 0 4px 4px 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 70vh;
  justify-content: flex-start;
  max-height: 700px;
  min-height: 536px;
  min-width: 360px;
  overflow: hidden;
  position: relative;
  width: 100%;
}
.action-bar {
  align-items: center;
  // background: linear-gradient(0deg, #f8f9fd, rgba(248, 249, 253, 0));
  background: linear-gradient(
    0deg,
    var(--im-header-bg-start) 0,
    var(--im-header-bg-end) 100%
  );
  border-bottom: 1px solid var(--color-line-l3);
  display: flex;
  flex-shrink: 0;
  font-size: 16px;
  height: 56px;
  justify-content: space-between;
  padding: 0 53px 0 16px;
  width: 100%;

  .action-user-text-common {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.action-user-text {
      cursor: pointer;
    }
  }

  &,
  .action-user-text-common {
    //color: #161823;
    color: var(--color-text-t1);

    flex-grow: 0;
    font-weight: 500;
  }
  .guMCwLUf {
    flex-shrink: 0;
    text-align: left;
  }

  .TJ58phG3 {
    flex-grow: 1;
    flex-shrink: 0;
  }
  .action-exit {
    color: var(--color-text-t3);
    cursor: pointer;
    font-size: 13px;
    font-weight: 400px;
    height: 32px;
    line-height: 32px;
    margin: 0 8px;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    white-space: nowrap;
  }

  .action-more {
    flex-grow: 0;
    flex-shrink: 0;
  }
  .action-follow,
  .xuf4J1YP {
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 600;
    margin: 0 15px 0 10px;
  }
  .action-follow {
    color: #ff2c55;
  }
  .action-more .ZVfHtcCZ {
    box-sizing: border-box;
    height: 32px;
    padding: 0 8px;
    width: 32px;
  }
}
.action-user {
  flex-direction: column;
  flex-grow: 0;
  overflow: hidden;
  .action-user-content {
    align-items: center;
    display: flex;
    justify-content: flex-start;
  }
}
.action-more-content {
  box-sizing: border-box;
  height: 32px;
  padding: 0 8px;
  width: 32px;

  svg path {
    fill: var(--color-text-t3);
  }
}

.action-more-content-icon {
  cursor: pointer;
  height: 100%;
  width: 100%;
}

.message-view {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: flex-start;
  overflow: hidden;
  width: 100%;

  &.qjvN52Cy {
    flex-grow: 0;
    flex-shrink: 1;
  }
}
.message-view-content {
  background-color: var(--color-bg-b1-white);
  display: flex;
  flex-direction: column-reverse;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-top: 15px;
  width: 100%;
  & .MQoDyyMe {
    flex-grow: 1;
  }
}

.message-view-reply.paddingPx {
  padding: 0 16px;
}
.message-view-reply .message-view-date,
.message-view-reply .ZYWoyIKO {
  color: var(--color-text-t4);
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  width: 100%;
}
.message-view-reply .message-view-date {
  margin-bottom: 12px;
}
.msg-item {
  flex-grow: 1;
}
.first-text {
  color: var(--color-text-t4);
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  width: 100%;
  letter-spacing: 0.6px;
  margin-bottom: 18px;
  white-space: pre-wrap;
}
.input-box {
  background-color: var(--color-bg-b1-white);
  flex-grow: 0;
  flex-shrink: 0;
  padding: 16px;
  width: 100%;
}

.msg-item.msg-common {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
  position: relative;

  & .user-logo-box {
    border: 1px solid var(--color-line-l3);
    border-radius: 20px;
    height: 40px;
    width: 40px;
    &.cursorAction {
      cursor: pointer;
    }
    &.user-logo-box-size {
      border-radius: 14px;
      height: 28px;
      width: 28px;
    }
  }

  & .msg-item-content {
    color: var(--color-text-t2);
    font-size: 13px;
    font-weight: 400;
    margin-left: 8px;
    margin-right: 8px;
    max-width: 224px;
    position: relative;

    .msg-item-text-content {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
    }

    .qtQPgNmc {
      height: 0;
      overflow-y: hidden;
    }
    .text-right {
      align-items: flex-end;
    }
    .VHSuxEgt {
      display: none;
    }
  }

  &.msg-item-right {
    justify-content: flex-end;
  }
  .right {
    color: var(--color-const-text-white);
    order: -1;
  }
}

.reply-text {
  word-wrap: break-word;
  background-color: var(--color-bg-b3);
  border-radius: 6px;
  display: inline-block;
  font-size: 14px;
  line-height: 21px;
  max-width: 224px;
  padding: 8px 14px;
  word-break: break-all;

  &.reply-me {
    background-color: #298cff;
    color: #fff;
  }
}
.reply-text-span {
  font-size: 13px;
  line-height: 21px;

  pre {
    word-wrap: break-word;
    display: inline;
    font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
    font-weight: 400;
    white-space: pre-wrap;
  }
}

.qoTdhsWp.r3NshgWi {
  left: 0;
  transform: translate(-48px, -75px);
}
.zAJ75W4c,
.zAJ75W4c .gjzxrohn {
  display: flex;
  justify-content: space-between;
}
.zAJ75W4c {
  // background-color: #41424c;
  background-color: var(--color-bg-toast);
  border-radius: 6px;
  color: var(--color-const-text-white);
  font-size: 13px;
  height: 67px;
  padding: 16px 16px 10px;
}
.zAJ75W4c .gjzxrohn {
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  height: 38px;
  margin-right: 24px;
  min-width: 26px;
}
.zAJ75W4c,
.zAJ75W4c .gjzxrohn {
  display: flex;
  justify-content: space-between;
}
.zAJ75W4c .gjzxrohn .J5JegD57 {
  height: 17px;
  width: 17px;
}
.zAJ75W4c .gjzxrohn .Kg9QMT2u {
  white-space: nowrap;
}

.y4aMJftQ.bP9c7nYX,
.y4aMJftQ.lDpjLOJS {
  left: 50%;
  top: 0;
  transform: translate(-50%, -9px);
}
</style>
