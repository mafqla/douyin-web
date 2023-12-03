<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import xgplayer, { Events } from 'xgplayer'
import 'xgplayer/dist/index.min.css'

import { v4 as uuidv4 } from 'uuid'
const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  isPlay: {
    type: Boolean,
    required: false
  }
})

const player = ref<any>(null)
const uniqueId = uuidv4()
onMounted(() => {
  props.options.fullscreen = {
    target: document.getElementById('modalall')
  }
  //@ts-ignore
  player.value = new xgplayer({
    ...props.options,
    id: `xgplayer-${uniqueId}`
  })
  const playerRef = ref<HTMLDivElement | null>(null)
  playerRef.value?.appendChild(player.value.root)

  // player.value.on(Events.FULLSCREEN_CHANGE, (isFullscreen: any) => {
  //   const carousel = document.getElementsByClassName('carousel') as any
  //   if (isFullscreen) {
  //     carousel[0].style.height = '100%'
  //     carousel[0].style.top = '0'
  //     carousel[0].style.padding = '0'
  //   } else {
  //     carousel[0].style.height = 'calc(100% - 24px)'
  //     carousel[0].style.top = 'calc(0% + 12px)'
  //     carousel[0].style.padding = '0 60px 0 30px '
  //   }
  // })
})

onBeforeUnmount(() => {
  player.value.destroy()
})

const playerId = ref(`xgplayer-${uniqueId}`)

watch(
  () => props.isPlay,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if (newVal) {
        player.value.play()
      } else {
        player.value.pause()
      }
    }
  }
)
console.log(props.isPlay)
</script>
<template>
  <div class="modal" ref="player" :id="playerId"></div>
</template>

<style lang="scss" scoped>
.modal {
  position: relative;
  background: transparent;
}

// @media screen and (min-width: 1440px) and (max-width: 2560px) {
//   .modal {
//     width: 71.4285714286%;
//   }
// }

// @media screen and (min-width: 2560px) {
//   .modal {
//     width: calc(100% - 656px);
//   }
// }
</style>

<style lang="scss">
// .modal video {
//   position: absolute;
//   bottom: 48px;
// }

// .xgplayer-volume-active,
// .xgplayer-playbackrate-active {
//   video {
//     position: absolute;
//     z-index: 100;
//   }
// }

// .xgplayer-skin-default .xgplayer-playbackrate {
//   margin-top: unset;
//   height: 30px;

//   .name {
//     font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;

//     color: #e4e4e6;
//     background: unset;
//     font-size: 14px;
//     font-weight: 500;
//     line-height: 32px;
//     text-align: center;
//     vertical-align: top;
//     opacity: 1;

//     border-radius: unset;
//     bottom: 6px;
//   }
// }

// .xgplayer-skin-default .xgplayer-progress-played {
//   background: rgba(255, 255, 255, 0.4);
// }
// .xgplayer-skin-default .xgplayer-progress-cache {
//   background: transparent;
// }
// .xgplayer-skin-default .xgplayer-playbackrate ul {
//   width: 48px;
//   border-radius: 4px;
// }

// .xgplayer-skin-default .xgplayer-playbackrate ul li.selected,
// .xgplayer-skin-default .xgplayer-playbackrate ul li:hover {
//   color: rgb(210, 27, 70);
//   pointer-events: all;
// }
</style>
