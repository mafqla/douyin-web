<script setup lang="ts">
import PopUp from '../pop-up/index.vue'
import NoticeList from './notice-list.vue'
import { ref } from 'vue'
</script>
<template>
  <pop-up :title="'互动消息'">
    <template #icon>
      <notice-list />
    </template>
    <template #center>
      <div class="notification-container rmEibxTi active" style="height: 91px">
        <div class="notification-header user-info" style="height: 90px">
          <div class="user-avatar">
            <a
              href="//www.douyin.com/user/MS4wLjABAAAAL6NwL9wAFbzl4QCxahyCGZVcb7FTaOFhRHjkuUslTV8"
              class="user-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="user-avatar-card" data-e2e="user-avatar-card">
                <img
                  class="dIUpgpVW user-avatar-card"
                  src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_oYwBwk1BDujVAecDdADEAgAXALAwCenHAIAb9d.jpeg?from=2171131728"
                />
                <div class="GDTi27FS">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="kytoJBGY"
                    viewBox="0 0 22 22"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="10"
                      fill="url(#diggIcon_svg__paint0_linear_728_20419)"
                    ></circle>
                    <g filter="url(#diggIcon_svg__filter0_i_728_20419)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.378 7.021a2.503 2.503 0 00-.42.574 2.424 2.424 0 00-.419-.575 1.97 1.97 0 00-1.436-.591c-1.377 0-2.512 1.108-2.512 2.743 0 1.815 1.524 3.615 3.857 5.135.178.12.375.228.51.228.133 0 .334-.108.513-.228 2.333-1.52 3.856-3.32 3.856-5.135 0-1.635-1.135-2.743-2.511-2.743a1.97 1.97 0 00-1.438.592z"
                        fill="#fff"
                      ></path>
                    </g>
                    <defs>
                      <linearGradient
                        id="diggIcon_svg__paint0_linear_728_20419"
                        x1="10"
                        y1="0"
                        x2="10"
                        y2="20"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FFA189"></stop>
                        <stop offset="1" stop-color="#FF1F5F"></stop>
                      </linearGradient>
                      <filter
                        id="diggIcon_svg__filter0_i_728_20419"
                        x="5.591"
                        y="6.429"
                        width="8.736"
                        height="9.598"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feBlend
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        ></feBlend>
                        <feColorMatrix
                          in="SourceAlpha"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        ></feColorMatrix>
                        <feOffset dy="1.492"></feOffset>
                        <feGaussianBlur stdDeviation="2.238"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          operator="arithmetic"
                          k2="-1"
                          k3="1"
                        ></feComposite>
                        <feColorMatrix
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.34 0"
                        ></feColorMatrix>
                        <feBlend
                          in2="shape"
                          result="effect1_innerShadow_728_20419"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </div></div
            ></a>
            <div class="user-details">
              <div class="user-info-container user-name">
                <a
                  href="//www.douyin.com/user/MS4wLjABAAAAL6NwL9wAFbzl4QCxahyCGZVcb7FTaOFhRHjkuUslTV8"
                  class="user-link user-name-text"
                  target="_blank"
                  rel="noopener noreferrer"
                  ><div class="user-name-text" data-e2e="user-name-card">
                    Seele Vollerei
                  </div></a
                >
              </div>
              <div class="user-badge text-muted">赞了你的评论</div>
              <div class="notification-date text-secondary">08-31</div>
            </div>
          </div>
          <img
            class="dIUpgpVW user-avatar-image avatar-image"
            src="https://p6-pc-sign.douyinpic.com/image-cut-tos-priv/6031351329a8952f687feb3dd0a556d9~tplv-dy-resize-origshort-autoq-75:330.jpeg?x-expires=1695034800&amp;x-signature=42pvDekFaV0yj4uDZtqsvaQZPZI%3D&amp;from=2171131728&amp;se=false&amp;biz_tag=pcweb_cover&amp;l=202309181342314FC7A40066EBD50F9A73"
          />
        </div>
        <div class="show-on-hover">
          <div class="hoverable-element">
            <svg
              width="12"
              height="4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 12 4"
            >
              <path
                d="M2.667 2A1.333 1.333 0 110 2a1.333 1.333 0 012.667 0zM7.333 2a1.333 1.333 0 11-2.666 0 1.333 1.333 0 012.666 0zM10.667 3.333a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666z"
                fill="#2F3035"
                fill-opacity="0.9"
              ></path>
            </svg>
          </div>
        </div>
        <div class="horizontal-line"></div>
      </div>
      <div class="notification-container rmEibxTi active" style="height: 89px">
        <div class="notification-item notification-header">
          <div class="user-info">
            <a
              href="//www.douyin.com/user/MS4wLjABAAAABL7xpGm4gEgTOy5OSi2KyBvx73Mbe8yV98kA_PJj3Bk"
              class="user-link"
              target="_blank"
              rel="noopener noreferrer"
              ><div class="user-avatar-card" data-e2e="user-avatar-card">
                <img
                  class="dIUpgpVW user-avatar-card"
                  src="https://p3-pc.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813_33cd4fd0331f4210aa00bd8e6af40f0c.jpeg?from=2171131728"
                />
                <div class="GDTi27FS">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="kytoJBGY"
                    viewBox="0 0 22 22"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="10"
                      fill="url(#commentIcon_svg__paint0_linear_731_20419)"
                    ></circle>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10 13.464c2.627 0 4.757-1.85 4.757-4.133 0-2.282-2.13-4.133-4.757-4.133s-4.757 1.85-4.757 4.133 2.13 4.133 4.757 4.133zm-2.4-3.312a.618.618 0 100-1.237.618.618 0 000 1.237zm3.018-.624a.619.619 0 11-1.237 0 .619.619 0 011.237 0zm1.782.618a.619.619 0 100-1.237.619.619 0 000 1.237z"
                      fill="#fff"
                    ></path>
                    <path
                      d="M10.07 13.788v-.674l2.946-.599-2.138 1.667a.5.5 0 01-.807-.394z"
                      fill="#fff"
                    ></path>
                    <defs>
                      <linearGradient
                        id="commentIcon_svg__paint0_linear_731_20419"
                        x1="10"
                        y1="0"
                        x2="10"
                        y2="20"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#5FDAFF"></stop>
                        <stop offset="1" stop-color="#076EFF"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div></div
            ></a>
            <div class="user-details">
              <div class="user-info-container user-name">
                <a
                  href="//www.douyin.com/user/MS4wLjABAAAABL7xpGm4gEgTOy5OSi2KyBvx73Mbe8yV98kA_PJj3Bk"
                  class="user-link user-name-text"
                  target="_blank"
                  rel="noopener noreferrer"
                  ><div class="user-name-text" data-e2e="user-name-card">
                    沁菌
                  </div></a
                >
                <div class="DnOfko61">你的关注</div>
              </div>
              <div class="notification-text text-muted">
                <pre class="">[害羞]</pre>
              </div>
              <div class="notification-info text-secondary">
                <span>回复了你的评论</span><span>08-22</span>
              </div>
            </div>
          </div>
          <img
            class="dIUpgpVW user-avatar-image avatar-image"
            src="https://p6-pc-sign.douyinpic.com/image-cut-tos-priv/e708f194c41f8efe1d0df85e8a54f6dc~tplv-dy-resize-origshort-autoq-75:330.jpeg?x-expires=1695034800&amp;x-signature=Uv13SidjyTh2QbWseR7ThPoGKEo%3D&amp;from=2171131728&amp;se=false&amp;biz_tag=pcweb_cover&amp;l=202309181342314FC7A40066EBD50F9A73"
          />
        </div>
        <div class="show-on-hover">
          <div class="hoverable-element">
            <svg
              width="12"
              height="4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 12 4"
            >
              <path
                d="M2.667 2A1.333 1.333 0 110 2a1.333 1.333 0 012.667 0zM7.333 2a1.333 1.333 0 11-2.666 0 1.333 1.333 0 012.666 0zM10.667 3.333a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666z"
                fill="#2F3035"
                fill-opacity="0.9"
              ></path>
            </svg>
          </div>
        </div>
        <div class="horizontal-line"></div>
      </div>
    </template>
  </pop-up>
</template>

<style lang="scss" scoped>
html.dark .notification-container.active:hover {
  background: linear-gradient(
    90deg,
    #252632,
    #33343f 33.44%,
    #33343f 66.56%,
    #252632
  );
}
.notification-container {
  background-color: var(--color-bg-b1-white);
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: auto;
  margin-left: 6px;
  opacity: 1;
  overflow-y: visible;
  position: relative;
  transition: opacity 0.2s linear, height 0.4s cubic-bezier(0.34, 0.69, 0.1, 1);
  &.rmEibxTi {
    margin-left: 6px;
    padding-left: 10px;
    padding-right: 10px;
  }
  &.active:hover {
    background: linear-gradient(
      90deg,
      #fff,
      #f2f2f4 33.33%,
      #f2f2f4 66.67%,
      #fff
    );

    .show-on-hover {
      bottom: 5px;
      display: block;
      position: absolute;
      right: 22px;
    }
  }

  .notification-header {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 14px 12px;
    position: relative;
    width: 100%;

    &.user-info {
      padding: 13px 0;
    }
    .user-avatar {
      display: flex;
      flex-grow: 1;
      flex-shrink: 0;

      .user-details {
        flex-grow: 1;
        margin-left: 8px;
        width: 0;
        .user-name {
          // color: #161823;
          color: var(--color-text-t1);
          // color: rgba(22, 24, 35, 1);
        }

        .user-badge {
          // color: rgba(22, 24, 35, 0.75);
          color: var(--color-text-t2);
          flex-shrink: 0;
          font-size: 13px;
          font-weight: 400;
          line-height: 21px;
          max-width: 166px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notification-date {
          // color: rgba(22, 24, 35, 0.34);
          color: var(--color-text-t4);
          flex-shrink: 0;
          font-size: 12px;
          font-weight: 400;
          height: 20px;
          line-height: 20px;
        }
      }
    }

    .avatar-image {
      border-radius: 4px;
      height: 48px;
      margin-top: 1px;
      width: 48px;
    }
    .user-avatar-image {
      border-radius: 4px;
      height: 48px;
      -o-object-fit: cover;
      object-fit: cover;
      position: relative;
      width: 48px;
    }
    .dIUpgpVW {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  .user-link {
    position: relative;
    .user-avatar-card {
      border-radius: 72px;
      height: 40px;
      margin-top: 1px;
      position: relative;
      width: 40px;
      .dIUpgpVW {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      .GDTi27FS {
        // background-color: var(--color-bg-b0);
        background-color: var(--color-bg-b1);
        border-radius: 50%;
        bottom: -3px;
        height: 22px;
        position: absolute;
        right: -3px;
        width: 22px;

        .kytoJBGY {
          height: 20px;
          margin: -1px 0 0 2px;
          width: 20px;
        }
      }
    }
  }
  .user-info-container {
    align-items: center;
    display: flex;

    .user-link {
      position: relative;
    }
    .user-name-text {
      font-size: 13px;
      font-weight: 500;
      line-height: 21px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .DnOfko61,
    .O3poVr1_ {
      border-radius: 2px;
      flex-shrink: 0;
      font-size: 10px;
      height: 18px;
    }
    .DnOfko61 {
      // background-color: #f2f2f4;
      // background-color: var(--color-bg-b2);
      background-color: rgba(242, 242, 243, 1);
      // border: 1px solid #f2f2f4;
      // border: 1px solid var(--color-secondary-default);
      border: 1px solid rgba(242, 242, 243, 1);
      color: rgba(22, 24, 35, 0.34);
      // color: var(--color-text-t4);
      font-weight: 500;
      line-height: 18px;
      margin-left: 8px;
      margin-right: 8px;
      padding: 0 4px;
    }
  }
  .text-muted {
    // color: rgba(22, 24, 35, 0.75);
    color: var(--color-text-t2);
  }
  .notification-text {
    // color: rgba(22, 24, 35, 0.75);
    color: var(--color-text-t2);
    font-size: 13px;
    font-weight: 400;
    line-height: 21px;
    max-width: 216px;
    position: relative;

    pre {
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
  .text-secondary {
    // color: rgba(22, 24, 35, 0.34);
    color: var(--color-text-t4);
  }
  .notification-item {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 14px 12px;
    width: 100%;
    &.notification-header {
      padding: 13px 0;
    }
    .user-info {
      display: flex;
      flex-grow: 1;
      flex-shrink: 0;

      .user-details {
        flex-grow: 1;
        margin-left: 8px;
        width: 0;
      }
    }
    .avatar-image {
      border-radius: 4px;
      height: 48px;
      margin-top: 1px;
      width: 48px;
    }

    .notification-info {
      // color: rgba(22, 24, 35, 0.34);
      color: var(--color-text-t4);
      flex-shrink: 0;
      font-size: 12px;
      font-weight: 400;
      height: 20px;
      line-height: 20px;
      span:nth-child(2) {
        margin-left: 4px;
      }
    }
  }

  .show-on-hover {
    display: none;

    .hoverable-element {
      cursor: pointer;
      position: relative;
    }
  }
  .horizontal-line {
    align-self: flex-end;
    // background-color: rgba(22, 24, 35, 0.06);
    background-color: var(--color-line-l3);
    height: 1px;
    margin-right: 16px;
    width: 268px;
  }
}
</style>
