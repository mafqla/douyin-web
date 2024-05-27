<template>
  <div class="video-search-btn">
    <div class="video-search-btn-content">
      <svg
        width="36"
        height="36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="video-search-btn-icon"
        viewBox="0 0 28 28"
      >
        <path
          d="M12.633 11.444a.5.5 0 00-.776-.417l-4.182 2.779a.5.5 0 00.028.85l4.182 2.391a.5.5 0 00.748-.434v-5.17zM8.738 9.116h11.208A1.06 1.06 0 0021 8.058 1.06 1.06 0 0019.945 7H8.737a1.06 1.06 0 00-1.055 1.058 1.06 1.06 0 001.055 1.058zm11.22 9.768H8.738a1.06 1.06 0 00-1.055 1.058A1.06 1.06 0 008.737 21h11.208A1.06 1.06 0 0021 19.942c0-.582-.462-1.058-1.042-1.058zm0-5.688h-4.474a1.06 1.06 0 00-1.055 1.058 1.06 1.06 0 001.055 1.058h4.462A1.06 1.06 0 0021 14.254c0-.582-.462-1.058-1.042-1.058z"
          fill="#fff"
        ></path>
      </svg>
      <span class="video-search-btn-text">相关内容</span>
    </div>
  </div>
</template>

<script setup>
import {} from 'vue'
</script>
<style lang="scss" scoped>
.video-search-btn {
  // background-color: var(--color-bg-b2);
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  height: 36px;
  position: absolute;
  // right: -80px;
  top: 10px;
  // width: 124px;
  z-index: 999;
  // transition: right 0.3s ease 0s;
  right: 0px;
  transform: translate(calc(100% - 45px));
  width: auto;
  background: rgba(18, 18, 18, 0.5);
  transition: all 0.3s ease 0s;

  &:hover {
    transform: translate(0px);
  }

  .video-search-btn-content {
    align-items: center;
    color: var(--color-text-t1);
    display: flex;
    padding-left: 9px;
    .video-search-btn-icon {
      rect,
      path {
        fill: var(--color-text-t1);
      }
    }
    .video-search-btn-text {
      font-size: 15px;
      font-weight: 400;
      line-height: 23px;
      padding-right: 5px;
    }
  }
}
</style>
