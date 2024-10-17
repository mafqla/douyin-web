<script setup lang="ts">
import {} from 'vue'
import PageFooter from '@/layout/page-footer.vue'

defineProps<{
  backgroundurl: string
}>()
</script>
<template>
  <div class="user">
    <div class="user-detail user-newui">
      <div class="user-detail">
        <div class="user-detail-content max">
          <div class="user-header-background">
            <div class="header-img-content">
              <div
                class="header-img"
                :style="{
                  backgroundImage: `url(${backgroundurl})`
                }"
              ></div>
            </div>
            <div class="header-down-bg"></div>
            <div class="header-down-bg-1"></div>
            <div class="header-down-bg-2"></div>
            <div class="header-down-bg-3"></div>
          </div>
          <slot name="user-header"></slot>
          <div class="user-container">
            <div class="user-content">
              <slot name="user-content"></slot>
            </div>
          </div>
        </div>
      </div>
      <page-footer />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  margin-top: calc(-1 * var(--header-height));
  overflow: auto;
  flex: 1;
}
:root[dark] {
  .header-img {
    opacity: 1 !important;
  }

  .user-newui {
    --btn-bg: rgba(255, 255, 255, 0.35);
    --btn-color: #fff;
    --btn-bg-hover: rgba(255, 255, 255, 0.2);
    --card-background-horizontal: linear-gradient(
      270deg,
      rgba(16, 16, 20, 0.87) 0%,
      #161722 17.15%
    );
    --card-background-vertical: linear-gradient(
      0deg,
      rgba(16, 16, 20, 0.87) 0%,
      #161722 17.15%
    );
  }
  .header-down-bg {
    background-image: linear-gradient(
      89deg,
      rgba(26, 28, 39, 0) 230px,
      hsl(205deg 40% 15%) calc(100% - 672px),
      rgba(32, 32, 53, 0.35) 74.08%,
      rgba(33, 33, 57, 0.2) 99.53%
    ) !important;
  }
  .header-down-bg-1 {
    background-image: linear-gradient(
      rgba(29, 29, 36, 0) 0%,
      #161823 100%
    ) !important;
    top: auto !important;
  }
  .header-down-bg-2 {
    background-image: linear-gradient(
      #161823 -4.05999%,
      rgba(25, 26, 36, 0) 72.92%
    ) !important;
  }
  .header-down-bg-3 {
    background-image: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 0, 0, 0.5) 100%
    ) !important;
  }
}

:root .user-newui {
  --btn-bg: rgba(22, 24, 35, 0.05);
  --btn-color: rgba(22, 24, 35, 0.75);
  --btn-bg-hover: rgba(22, 24, 35, 0.25);
  --card-background-horizontal: linear-gradient(270deg, #f9f9f9, #fff);
  --card-background-vertical: linear-gradient(0deg, #f9f9f9, #fff);
}
.user-detail {
  width: 100%;
  min-height: 100%;
}

.user-detail-content {
  width: 100%;
  // max-width: 1208px;
  min-width: 1024px;
  min-height: calc(100vh - 60px);
  position: relative;
  padding-top: var(--header-height);
  margin: 0 auto;
  &.max {
    max-width: none !important;
    width: 100% !important;
  }

  .user-header-background {
    height: 233px;
    margin-top: -68px;
    overflow: hidden;
    position: relative;
    width: 100%;

    @media (max-width: 1024px) {
      .header-img-content {
        width: calc(100% - 280px);
      }
    }
    .header-img-content {
      height: 281px;
      position: absolute;
      right: 0;
      top: 0;
      width: 672px;

      .header-img {
        background-repeat: no-repeat;
        background-size: cover;
        height: 377px;
        margin-top: -48px;
        opacity: 1;
        width: 672px;
      }
    }

    .header-down-bg {
      width: 100%;
      height: 100%;
      background-image: linear-gradient(
        89deg,
        rgba(var(--neutral-50), 0) calc(50% - 474px),
        rgb(var(--neutral-50)) calc(100% - 672px),
        rgba(var(--neutral-50), 0) 73.58%,
        rgba(204, 204, 235, 0.2) 99.53%
      );
      position: absolute;
      top: 0;
      right: 0;
    }

    .header-down-bg-1 {
      height: 126px;
      width: calc(50% + 494px);
      background-image: linear-gradient(
        180deg,
        rgba(var(--neutral-50), 0) 0%,
        rgb(var(--neutral-50)) 100%
      );
      position: absolute;
      top: 110px;
      bottom: -48px;
      right: 0;
    }

    .header-down-bg-2 {
      height: 244px;
      width: calc(50% + 494px);
      background-image: linear-gradient(
        0deg,
        rgba(var(--neutral-50), 0) 0%,
        rgb(var(--neutral-50)) 100%
      );
      position: absolute;
      top: 0;
      right: 0;
    }

    @media (max-width: 1024px) {
      .header-down-bg {
        background-image: linear-gradient(
          89deg,
          rgba(var(--neutral-50), 0) 230px,
          rgb(var(--neutral-50)) 280px,
          rgba(var(--neutral-50), 0.2) 73.58%,
          rgba(204, 204, 235, 0.2) 99.53%
        );
      }
    }
    @media (max-width: 1475px) {
      .header-down-bg-1,
      .header-down-bg-2 {
        width: calc(100% - 230px);
      }
    }
    :root[dark] .header-down-bg {
      background-image: linear-gradient(
        89deg,
        rgba(26, 28, 39, 0) 230px,
        hsl(205deg 40% 15%) calc(100% - 672px),
        rgba(32, 32, 53, 0.35) 74.08%,
        rgba(33, 33, 57, 0.2) 99.53%
      );
    }

    .header-down-bg-3 {
      width: 281px;
      height: 240px;
      background-image: linear-gradient(
        90deg,
        rgba(var(--neutral-50), 0) 0%,
        rgba(var(--neutral-50), 0.3) 100%
      );
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
html[dark] .user-container {
  background: linear-gradient(
    270deg,
    #161823 0%,
    #161823 14.66%,
    rgba(22, 24, 35, 0) 87.32%
  );
  margin-top: -16px;
  padding-top: 16px;
}
.user-container {
  .user-content {
    margin: 0 auto;
    max-width: 1520px;
  }
}
@media (max-width: 1740px) {
  .user-content {
    width: calc(100% - 60px);
    max-width: none;
  }
}
</style>
