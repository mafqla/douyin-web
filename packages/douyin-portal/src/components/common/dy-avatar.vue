<script setup lang="ts">
import { computed, ref } from 'vue'

type AvatarSize = 'small' | 'common' | 'medium' | 'large'

const props = defineProps({
  userLink: {
    type: String,
    required: false
  },
  src: {
    type: String,
    required: true
  },
  size: {
    type: String as () => AvatarSize,
    default: 'medium' as AvatarSize
  },
  enableTransition: {
    type: Boolean,
    default: false,
    required: false
  }
})

const sizeClass = computed(() => {
  return {
    'avatar-size-small': props.size === 'small',
    'avatar-size-common': props.size === 'common',
    'avatar-size-medium': props.size === 'medium',
    'avatar-size-large': props.size === 'large'
  }
})

const isImageLoadingFailed = ref(false)
const isImageLoading = ref(true)

const imageErrorHandler = () => {
  isImageLoadingFailed.value = true
  isImageLoading.value = false
}

const imageLoadHandler = () => {
  isImageLoadingFailed.value = false
  isImageLoading.value = false
}
</script>

<template>
  <div class="dy-avatar" :class="{ 'enable-transition': props.enableTransition }">
    <a v-if="props.userLink" :href="props.userLink" class="avatar-link" target="_blank">
      <div class="avatar-wrapper" :class="sizeClass">
        <img class="avatar-image" :src="props.src" :alt="`用户头像`" @error="imageErrorHandler" @load="imageLoadHandler"
          v-show="!isImageLoadingFailed" />
        <div class="default-img" v-if="isImageLoadingFailed"></div>
      </div>
    </a>
    <div v-else class="avatar-wrapper" :class="sizeClass">
      <img class="avatar-image" :src="props.src" :alt="`用户头像`" @error="imageErrorHandler" @load="imageLoadHandler"
        v-show="!isImageLoadingFailed" />
      <div class="default-img" v-if="isImageLoadingFailed"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.enable-transition {
  transition: all 0.3s ease-in;
  transform: scale(1);

  &:hover {
    transition: all 0.3s ease-out;
    transform: scale(1.1);
  }
}

.dy-avatar {
  cursor: pointer;
  flex: 0;
  margin-right: 12px;

  .avatar-link {
    position: relative;
    text-decoration: none;
    color: inherit;
  }

  .avatar-wrapper {
    box-sizing: content-box;
    border-radius: 50%;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--color-line-l3) !important;
  }

  .avatar-size-small {
    width: 40px;
    height: 40px;
  }

  .avatar-size-common {
    width: 50px;
    height: 50px;
  }

  .avatar-size-medium {
    width: 60px;
    height: 60px;
  }

  .avatar-size-large {
    width: 80px;
    height: 80px;
  }

  .avatar-image {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .default-img {
    background: var(--avatarimg);
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
}
</style>
