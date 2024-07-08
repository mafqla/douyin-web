<script setup lang="ts">
import { } from 'vue'
import useTheme from '@/hooks/useTheme'


const { theme, switchTheme } = useTheme()
const themeMode = computed(() => {
  return theme.value
})

const isShowKeyboard = ref(false)
const showKeyboard = () => {
  isShowKeyboard.value = true
}
const hideKeyboard = () => {
  isShowKeyboard.value = false

}
</script>
<template>
  <div class="coop-panel" style="top: 660px;">
    <div class="coop-panel-item ">
      <a class="panel-link" target="_blank">
        <div class="xxbkuAal">
          <div class="icon-container">
            <svg-icon icon="theme-mode" class="icon" />
            深浅模式
          </div>
          <div class="mode-options">
            <div class="mode-icon-container" :class="{ 'active': themeMode === 'light' }" @click="switchTheme('light')">

              <svg-icon icon="light-mode" class="icon" />
            </div>
          </div>
          <div class="mode-options">
            <div class="mode-icon-container" :class="{ 'active': themeMode === 'dark' }" @click="switchTheme('dark')">
              <svg-icon icon="dark-mode" class="icon" />
            </div>
          </div>
        </div>
      </a>
    </div>
    <div class="coop-panel-item">
      <a class="panel-link " target="_blank">
        <div class="icon-container">
          <svg-icon icon="setting-general" class="icon" />
          通用设置
        </div>
        <svg-icon icon="chevron-right" class="icon" />
      </a>
      <div class="general-panel" style="top: -12px;">
        <div class="general-panel-content">
          <div class="coop-panel-item ">
            <a class="panel-link " target="_blank">
              <div class="icon-container">
                <svg-icon icon="setting-privacy" class="icon" />
                隐私设置
              </div>
            </a>
          </div>
          <div class="coop-panel-item ">
            <a class="panel-link " target="_blank">
              <div class="icon-container">
                <svg-icon icon="setting-notification" class="icon" />
                通知设置
              </div>
            </a>
          </div>
          <div class="coop-panel-item "><a class="panel-link " target="_blank">
              <div class="icon-container">
                <svg-icon icon="setting-default" class="icon" />
                默认页面
              </div>
            </a>
          </div>
        </div>
      </div>

    </div>
    <div class="coop-panel-item ">
      <a class="panel-link " target="_blank" @click="showKeyboard">
        <div class="icon-container">
          <svg-icon icon="setting-keyboard" class="icon" />
          键盘快捷键
        </div>

        <dy-dialog v-model="isShowKeyboard" dialogTitle="键盘快捷键">
          <shortcut-keys />
        </dy-dialog>
      </a>
    </div>
    <div class="coop-panel-item "><a class="panel-link " target="_blank">
        <div class="icon-container">
          <svg-icon icon="faq" class="icon" />
          常见问题
        </div>
      </a>
    </div>
    <div class="coop-panel-item "><a class="panel-link " target="_blank">
        <div class="icon-container">
          <svg-icon icon="setting-feedback" class="icon" />
          意见反馈
        </div>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.coop-panel {
  z-index: 999;
  user-select: none;
  color: var(--color-text-t3);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  position: fixed;
  left: var(--navigation-width);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 24px;
  background: var(--color-bg-b1-white);
  border-radius: 12px;
  padding: 12px 0px;
  min-width: 204px;

  .general-panel-content {
    color: var(--color-text-t3);
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 24px;
    background: var(--color-bg-b1-white);
    border-radius: 12px;
    padding: 12px 0px;

    &::before {
      content: "";
      width: 6px;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0px;
      left: -6px;
    }
  }
}



.coop-panel-item {
  position: relative;

  &:not(:last-child) {
    height: 41px;
  }

  .general-panel {
    position: absolute;
    left: calc(100% + 4px);
    width: 204px;
    display: none;

  }

  &:hover .general-panel {
    display: block;
  }
}


.panel-link {
  position: relative;
  // width: 180px;
  width: auto !important;
  height: 39px;
  color: var(--color-text-t3);
  justify-content: space-between;
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: 10px;
  margin: 0px 12px;
  padding: 9px 6px 9px 12px;

  &:hover {
    color: var(--color-text-t0);
    background: var(--color-fill-hover);
    transition: background 0.2s ease-in 0s;
  }
}

.xxbkuAal {
  width: 100%;
  display: flex;
  gap: 8px;

  &:first-child {
    margin-right: auto;
  }
}



.icon-container {
  align-items: center;
  display: flex;
  gap: 4px;

  .icon {
    width: 24px;
    height: 24px;
  }
}

.mode-options {
  position: relative;
}

.mode-icon-container {
  color: var(--color-text-t3);
  position: relative;
  border-radius: 24px;

  &.active {
    background: var(--color-bg-b2);
  }

  &:hover,
  &.active {
    color: var(--color-text-t0);
  }

  .icon {
    width: 24px;
    height: 24px;
  }
}
</style>