<script setup lang="ts">
import {} from 'vue'
</script>
<template>
  <svg
    width="56"
    height="56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56 56"
    class="arrow-right-icon"
  >
    <g clip-path="url(#arrowRight_svg__clip0_1683_162494)">
      <path
        d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z"
        fill="#000"
      ></path>
      <g filter="url(#arrowRight_svg__filter0_d_1683_162494)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.598 37.426a2 2 0 0 1-.024-2.828l6.598-6.713-6.574-6.458a2 2 0 1 1 2.804-2.854l8 7.86a2 2 0 0 1 .024 2.829l-8 8.14a2 2 0 0 1-2.828.024z"
          fill="#fff"
        ></path>
      </g>
    </g>
    <defs>
      <filter
        id="arrowRight_svg__filter0_d_1683_162494"
        x="23"
        y="18"
        width="14"
        height="22"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        ></feColorMatrix>
        <feOffset dy="1"></feOffset>
        <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        ></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1683_162494"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_1683_162494"
          result="shape"
        ></feBlend>
      </filter>
      <clipPath id="arrowRight_svg__clip0_1683_162494">
        <path fill="#fff" d="M0 0h56v56H0z"></path>
      </clipPath>
    </defs>
  </svg>
</template>

<style lang="scss" scoped>
.arrow-right-icon {
  width: 56px;
  height: 56px;

  g > path {
    fill: rgba(0, 0, 0, 0.18);
  }
  g > g > path {
    fill: rgba(255, 255, 255, 0.25);
  }

  &:hover {
    opacity: 1;
    pointer-events: auto;
    g > path {
      fill: rgba(0, 0, 0, 0.25);
    }
    g > g > path {
      fill: #fff;
    }
  }
}
</style>
