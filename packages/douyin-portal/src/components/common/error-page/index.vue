<script setup lang="ts">
import { type CSSProperties } from 'vue'

type layoutEnum = 'vertical' | 'horizontal'

type imageEnum =
  | 'unfollow-image'
  | 'emptyList-image'
  | 'commentTmptyList-image'
  | 'emptySearch-image'
  | 'noLogin-image'
  | 'notFound-image'
  | 'noNetwork-image'
  | 'serverError-image'

interface EmptyProps {
  title?: string
  description?: string
  image?: imageEnum
  imageStyle?: CSSProperties
  layout?: layoutEnum
  show: boolean // 是否显示
  //自定义style
  style?: CSSProperties
}

defineProps<EmptyProps>()
defineOptions({
  name: 'error-page'
})
defineSlots<{
  // 默认插槽
  default(): any
  // loading 插槽
  actionBtns(): any
}>()
</script>

<template>
  <div class="error-page" v-if="!show" :style="style">
    <div :class="['container', layout || 'vertical']">
      <div class="error-content" aria-label="Error Message">
        <div class="icon-placeholder">
          <div class="error-icon" :style="imageStyle" :class="image"></div>
        </div>
        <div class="error-message">
          {{ title }}
        </div>
        <div class="additional-info">
          {{ description }}
        </div>
        <div class="action-buttons"><slot name="actionBtns" /></div>
      </div>
    </div>
  </div>
  <slot name="default" v-if="show" />
</template>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  width: 100%;
  background-color: var(--color-bg-b0);
  background-position: top;
  background-size: cover;
  flex-direction: column;
  align-items: stretch;
  display: flex;
  &:before {
    content: '';
    height: 300px;
    width: 100vw;
    pointer-events: none;
    background-image: url(//lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/personal_light.26636f02e04ac5a3.png);
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100% 140%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}
html[dark] .error-page::before {
  background-image: url(//lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/ies/douyin_web/media/personal_dark.c51f24015d4c942c.png);
}
.container {
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;

  &.horizontal {
    flex-direction: row;
  }
}

.error-content {
  min-height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;

  .icon-placeholder {
    margin-bottom: 27px;
    position: relative;

    .error-icon {
      width: 240px;
      height: 160px;
      background-size: 100% 100%;

      &.unfollow-image {
        background-image: var(--unfollow-image);
      }
      &.emptyList-image {
        background-image: var(--emptyList-image);
      }
      &.commentTmptyList-image {
        background-image: var(--commentTmptyList-image);
      }
      &.emptySearch-image {
        background-image: var(--emptySearch-image);
      }
      &.noLogin-image {
        background-image: var(--noLogin-image);
      }
      &.notFound-image {
        background-image: var(--notFound-image);
      }
      &.noNetwork-image {
        background-image: var(--noNetwork-image);
      }
      &.serverError-image {
        background-image: var(--serverError-image);
      }
    }
  }

  .error-message {
    color: var(--color-text-t1);
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    text-align: center;
  }

  .additional-info {
    color: var(--color-text-t3);
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
  }

  .action-buttons {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
}
</style>
