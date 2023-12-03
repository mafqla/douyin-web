<script setup lang="ts">
import {} from 'vue'
</script>

<template>
  <div class="video-sidebar-btn">
    <button class="video-sidebar-btn-cl" type="button">
      <!-- <div class="video-sidebar-btn-bg"></div> -->
      <svg
        width="32"
        height="48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="z8UOaKU4"
        viewBox="0 0 32 48"
      >
        <g
          opacity="0.18"
          clip-path="url(#shadow-arrow-left_svg__clip0_12_1531)"
        >
          <path
            d="M0 24C0 10.745 10.745 0 24 0h8v48h-8C10.745 48 0 37.255 0 24z"
            fill="#000"
          ></path>
          <path
            d="M24 .5h8.5v47H24C11.021 47.5.5 36.979.5 24S11.021.5 24 .5z"
            stroke="#fff"
            stroke-opacity="0.92"
          ></path>
        </g>
        <defs>
          <clipPath id="shadow-arrow-left_svg__clip0_12_1531">
            <path fill="#fff" d="M0 0h32v48H0z"></path>
          </clipPath>
        </defs>
      </svg>
      <svg-icon class="icon" icon="sidebar-btn" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.video-sidebar-btn {
  position: absolute;
  right: 0px;
  top: 50%;
  display: inline-block;
  transform: translateY(-50%);
  z-index: 200;
  cursor: pointer;
  height: 48px;
  width: 32px;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;

  .video-sidebar-btn-cl {
    // align-items: center;
    // background-color: unset;
    // display: flex;
    // height: 48px;
    // justify-content: space-around;
    // transform-origin: right center;
    // width: 32px;
    // border-width: 0px;
    // border-style: initial;
    // border-color: initial;
    // border-image: initial;
    // border-radius: 24px 0px 0px 24px;
    // transition: all 0.3s linear 0s;

    align-items: center;
    background-color: unset;
    border: 0;
    border-radius: 24px 0 0 24px;
    cursor: pointer;
    display: flex;
    height: 50px;
    justify-content: space-around;
    transform-origin: right;
    transition: all 0.3s linear;
    width: 32px;

    .video-sidebar-btn-bg {
      background: rgba(0, 0, 0, 0.18);
      border-radius: 24px 0 0 24px;
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    .icon {
      width: 32px;
      height: 48px;
      vertical-align: middle;
      color: #fff;
      transition: unset;

      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.2;

      &:hover {
        color: #fff;

        opacity: 1 !important;
      }
    }
  }
}

.video-sidebar-btn:hover {
  .video-sidebar-btn-cl {
    transform: scale(1.2);

    .video-sidebar-btn-bg {
      background: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
