<script setup lang="ts">
import { } from 'vue'
</script>
<template>
  <div class="player-controls">
    <div class="player-controls__time">
      <div class="player-controls__clock">
        <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 32 32">
          <path
            d="M10 7.882a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-14a1 1 0 0 0-1-1h-3zM19 7.882a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-14a1 1 0 0 0-1-1h-3z"
            fill="#fff" fill-opacity="0.9"></path>
        </svg>
        <span>00:00</span>/<span>00:19</span>
      </div>
      <div class="player-controls__mute-icon">
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 24 24">
          <g filter="url(#mute_svg__filter0_d_42764_243856)">
            <path
              d="M4 10a2 2 0 0 1 2-2h1l4.36-3.633a1 1 0 0 1 1.64.768v13.73a1 1 0 0 1-1.64.768L7 16H6a2 2 0 0 1-2-2v-4z"
              fill="#fff"></path>
          </g>
          <g filter="url(#mute_svg__filter1_d_42764_243856)">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M18.002 13.55l2.499 2.954 1.502-1.316-2.693-3.185 2.694-3.185-1.503-1.316-2.499 2.955-2.5-2.955L14 8.818l2.694 3.185-2.693 3.185 1.502 1.316 2.499-2.955z"
              fill="#fff"></path>
          </g>
          <defs>
            <filter id="mute_svg__filter0_d_42764_243856" x="3" y="4.133" width="11" height="17.734"
              filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha">
              </feColorMatrix>
              <feOffset dy="1"></feOffset>
              <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_42764_243856"></feBlend>
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_42764_243856" result="shape"></feBlend>
            </filter>
            <filter id="mute_svg__filter1_d_42764_243856" x="13" y="7.502" width="10.004" height="11.002"
              filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha">
              </feColorMatrix>
              <feOffset dy="1"></feOffset>
              <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="out"></feComposite>
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
              <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_42764_243856"></feBlend>
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_42764_243856" result="shape"></feBlend>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
    <div class="player-controls__progress">
      <div class="player-controls__progress-bar" style="width: 1.98336%;">
        <div class="player-controls__handle">
          <div class="player-controls__handle-dot"></div>
        </div>
      </div>
      <div class="player-controls__buffer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.player-controls {
  height: 36px;
  width: 100%;
  z-index: 1;
  position: absolute;
  bottom: 0;

  &__time {
    height: 100%;
    justify-content: space-between;
    align-items: center;
    transition-property: visibility, opacity;
    transition-duration: .3s;
    display: flex;

    .player-controls__clock {
      z-index: 1;
      color: #fff;
      text-shadow: 0 1px 1px rgba(0, 0, 0, .25);
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      display: flex;
    }

    .player-controls__mute-icon {
      z-index: 1;
      vertical-align: bottom;
      align-items: center;
      margin-right: 8px;
      display: flex;
    }
  }

  .player-controls__progress {
    height: 2px;
    background-color: rgba(255, 255, 255, .3);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    .player-controls__progress-bar {
      height: 100%;
      background-color: #fff;
      position: absolute;

      .player-controls__handle {
        width: 18px;
        height: 18px;
        background-color: rgba(255, 255, 255, .2);
        border-radius: 50%;
        display: none;
        position: absolute;
        bottom: 50%;
        right: 0;
        transform: translate(50%, 50%);

        .player-controls__handle-dot {
          width: 12px;
          height: 12px;
          background-color: #fff;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .player-controls__buffer {
      height: 12px;
      width: 100%;
      z-index: 1;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
</style>