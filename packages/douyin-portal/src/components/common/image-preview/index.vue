<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface ImageItem {
  url: string
  alt?: string
}

const props = withDefaults(
  defineProps<{
    open: boolean
    images: ImageItem[]
    initialIndex?: number
  }>(),
  {
    initialIndex: 0
  }
)

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(props.initialIndex)
const scale = ref(1)

watch(
  () => props.open,
  (val) => {
    if (val) {
      currentIndex.value = props.initialIndex
      scale.value = 1
    }
  }
)

watch(
  () => props.initialIndex,
  (val) => {
    currentIndex.value = val
  }
)

const currentImage = computed(() => props.images[currentIndex.value])
const scalePercent = computed(() => Math.round(scale.value * 100) + '%')
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < props.images.length - 1)

const prev = () => {
  if (canPrev.value) {
    currentIndex.value--
  }
}

const next = () => {
  if (canNext.value) {
    currentIndex.value++
  }
}

const zoomOut = () => {
  if (scale.value > 0.2) {
    scale.value = Math.max(0.2, +(scale.value - 0.1).toFixed(1))
  }
}

const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = Math.min(3, +(scale.value + 0.1).toFixed(1))
  }
}

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="image-preview-overlay"
        @click="handleBackdropClick"
      >
        <!-- 图片容器 -->
        <div class="preview-container">
          <img
            v-if="currentImage"
            class="preview-image"
            :src="currentImage.url"
            :alt="currentImage.alt || 'preview'"
            :style="{ transform: `scale(${scale})` }"
          />
        </div>

        <!-- 左箭头 -->
        <div 
          class="nav-btn nav-prev" 
          :class="{ disabled: !canPrev }"
          @click.stop="prev"
        >
          <svg
            width="56"
            height="56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#arrowLeft_clip)">
              <path
                d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z"
                fill="rgba(0, 0, 0, .18)"
              />
              <path
                class="arrow-icon"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M31.402 18.573a2 2 0 0 1 .024 2.829l-6.598 6.713 6.574 6.458a2 2 0 1 1-2.804 2.854l-8-7.86a2 2 0 0 1-.024-2.829l8-8.14a2 2 0 0 1 2.828-.024z"
                fill="rgba(255, 255, 255, .25)"
              />
            </g>
            <defs>
              <clipPath id="arrowLeft_clip">
                <path fill="#fff" d="M0 0h56v56H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <!-- 右箭头 -->
        <div 
          class="nav-btn nav-next" 
          :class="{ disabled: !canNext }"
          @click.stop="next"
        >
          <svg
            width="56"
            height="56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#arrowRight_clip)">
              <path
                d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z"
                fill="rgba(0, 0, 0, .18)"
              />
              <path
                class="arrow-icon"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24.598 37.426a2 2 0 0 1-.024-2.828l6.598-6.713-6.574-6.458a2 2 0 1 1 2.804-2.854l8 7.86a2 2 0 0 1 .024 2.829l-8 8.14a2 2 0 0 1-2.828.024z"
                fill="rgba(255, 255, 255, .25)"
              />
            </g>
            <defs>
              <clipPath id="arrowRight_clip">
                <path fill="#fff" d="M0 0h56v56H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <!-- 缩放控制 -->
        <div class="zoom-controls" @click.stop>
          <svg
            class="zoom-icon"
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="zoomOut"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zm6.32-1.594a8 8 0 1 0-1.414 1.414l3.387 3.387a1 1 0 0 0 1.414-1.414l-3.387-3.387zM7.25 11a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75z"
              fill="currentColor"
            />
          </svg>
          <span class="zoom-percent">{{ scalePercent }}</span>
          <svg
            class="zoom-icon"
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="zoomIn"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zm6.32-1.594a8 8 0 1 0-1.414 1.414l3.387 3.387a1 1 0 0 0 1.414-1.414l-3.387-3.387zM11.75 8a.75.75 0 0 0-1.5 0v2.25H8a.75.75 0 0 0 0 1.5h2.25V14a.75.75 0 0 0 1.5 0v-2.25H14a.75.75 0 0 0 0-1.5h-2.25V8z"
              fill="currentColor"
            />
          </svg>
        </div>

        <!-- 关闭按钮 -->
        <div class="close-btn" @click.stop="handleClose">
          <svg
            width="48"
            height="48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              d="M32.801 32.801c-.71.71-1.86.71-2.569 0l-5.565-5.566-5.566 5.566a1.817 1.817 0 0 1-2.569-2.569l5.566-5.566-5.566-5.565a1.817 1.817 0 0 1 2.569-2.57l5.566 5.567 5.566-5.566A1.816 1.816 0 1 1 32.8 19.1l-5.566 5.565 5.566 5.566c.71.71.71 1.86 0 2.57z"
              fill="#fff"
              fill-opacity=".8"
            />
          </svg>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
}

.preview-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 70%;
  max-height: 85%;
}

.preview-image {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 4px;
  user-select: none;
  transition: transform 0.15s ease;
  object-fit: contain;
}

.nav-btn {
  width: 56px;
  height: 56px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100%;
  position: absolute;
  top: 50%;
  transition: all 0.2s;

  svg {
    display: block;
  }

  .arrow-icon {
    transition: fill 0.2s;
  }

  &:hover:not(.disabled) .arrow-icon {
    fill: #fff;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
}

.nav-prev {
  left: 19.1%;
  transform: translate(-50%, -50%);
}

.nav-next {
  right: 19.1%;
  transform: translate(50%, -50%);
}

.zoom-controls {
  color: #fff;
  width: 150px;
  height: 40px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  display: flex;
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translate(-50%);
}

.zoom-icon {
  color: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
}

.zoom-percent {
  // color: rgba(255, 255, 255, 0.9);
  // font-size: 13px;
  // min-width: 36px;
  // text-align: center;
  // font-weight: 500;
}

.close-btn {
  width: 56px;
  height: 56px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-app-region: no-drag;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  top: 35px;
  right: 35px;

  &:hover {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
