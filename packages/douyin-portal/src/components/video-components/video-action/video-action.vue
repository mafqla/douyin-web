<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { ElAvatar } from 'element-plus'
import { attention } from '@/service/attention'
import { applaud } from '@/service/applaud'
import { collection } from '@/service/collection'

const props = defineProps({
  id: Number,
  userId: Number,
  avatar: String,
  dianzan: Number,
  comment: Number,
  shoucang: Number,
  isLike: Boolean,
  isCollect: Boolean,
  isAttention: Number
})

const dianzan = ref(props.dianzan) as any
const liked = ref(props.isLike) as any
const addDianzan = async () => {
  try {
    await applaud(props.id as number)
    liked.value = !liked.value
    if (liked.value) {
      dianzan.value++
    } else {
      dianzan.value--
    }
  } catch (e) {
    console.log(e)
  }
}
// watchEffect(() => {
//   console.log(liked.value, dianzan.value)
// })
const shoucang = ref(props.shoucang) as any
const isCollect = ref(props.isCollect) as any

// console.log(isCollect.value)
const addShoucang = async () => {
  try {
    await collection({ video_id: props.id as number })
    isCollect.value = !isCollect.value
    if (isCollect.value) {
      shoucang.value++
    } else {
      shoucang.value--
    }
  } catch (e) {}
}

//默认284，如果是关注，就是384
const width = ref(312)
const maXWidth = ref('280px')
//是否关注
const isAttent = ref(props.isAttention)

// console.log(isAttention.value)
//关注
const handleAttention = async () => {
  //调用接口
  try {
    await attention(props.userId as number)
    if (isAttent.value === 1 || isAttent.value === 3) {
      isAttent.value = 2
    } else {
      isAttent.value = 1
    }
  } catch (e) {
    console.log(e)
  }
}

watchEffect(() => {
  console.log(isAttent.value)
  if (isAttent.value === 1 || isAttent.value === 3) {
    width.value = 384
    maXWidth.value = 'unset'
  } else {
    // width.value = 284
    width.value = 312
    maXWidth.value = '280px'
  }
})

//是否显示like-box
const showLikeBox = ref(false)
//是否显示comment-box
const showCommentBox = ref(false)
//是否显示collection-box
const showCollectionBox = ref(false)
//是否显示more-box
const showMoreBox = ref(false)
</script>

<template>
  <div
    class="video-action"
    style="
      transform-origin: center bottom;
      transform: scale(1.01765);
      height: auto;
      bottom: 60px;
    "
  >
    <slot />
    <div class="video-action-content">
      <div class="video-action-item">
        <div class="avatar-content">
          <div class="video-action-avatar">
            <ElAvatar size="small" :src="props.avatar" />
          </div>
          <div class="video-action-avatar-follow" @click="handleAttention">
            <svg-icon class="icon" icon="avfollow" v-show="isAttent === 2" />
          </div>
        </div>
      </div>
      <div
        class="video-action-item"
        @click="addDianzan"
        @mouseenter="showLikeBox = true"
        @mouseleave="showLikeBox = false"
      >
        <div class="like-box postion swiper" v-if="showLikeBox">
          <svg
            width="4"
            height="17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="like-box-icon postion"
            viewBox="0 0 4 17"
          >
            <path
              d="M0 0a8 8 0 002.168 5.476l1.174 1.25a2 2 0 010 2.738l-1.174 1.25A8 8 0 000 16.19V0z"
              fill="#323442"
            ></path>
          </svg>
          <div class="like-box-title">
            点赞<span class="like-box-text">Z</span>
          </div>
        </div>
        <svg-icon class="icon" :class="{ liked: liked }" icon="dianzan" />
        <span class="num">{{ dianzan }}</span>
      </div>
      <div
        class="video-action-item"
        @click="$emit('toggleComments')"
        @mouseenter="showCommentBox = true"
        @mouseleave="showCommentBox = false"
      >
        <div class="like-box postion swiper" v-if="showCommentBox">
          <svg
            width="4"
            height="17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="like-box-icon postion"
            viewBox="0 0 4 17"
          >
            <path
              d="M0 0a8 8 0 002.168 5.476l1.174 1.25a2 2 0 010 2.738l-1.174 1.25A8 8 0 000 16.19V0z"
              fill="#323442"
            ></path>
          </svg>
          <div class="like-box-title">
            评论<span class="like-box-text">X</span>
          </div>
        </div>
        <svg-icon class="icon" icon="comment" :class="{ liked: liked }" />
        <span class="num">{{ props.comment }}</span>
      </div>
      <div
        class="video-action-item"
        @click="addShoucang"
        @mouseenter="showCollectionBox = true"
        @mouseleave="showCollectionBox = false"
      >
        <svg-icon
          class="icon-collect"
          icon="collection"
          :class="{ collect: isCollect }"
        />
        <span class="num">{{ shoucang }}</span>

        <div class="collection-box" v-if="showCollectionBox">
          <div class="collection-box-content">
            <div class="collection-box-item">
              <div class="collection-box-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  class="box-icon-all collection-folder-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 7a2 2 0 012-2h3.338a2 2 0 01.791.163l2.777 1.195a4 4 0 001.582.326H19a2 2 0 012 2V17a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    stroke="#fff"
                    stroke-opacity="0.75"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M7 14h9M7 10h2"
                    stroke="#fff"
                    stroke-opacity="0.8"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </div>
              <p class="collection-box-title">收藏至收藏夹</p>
            </div>
            <div class="collection-box-item">
              <div class="collection-box-icon">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="box-icon-all video-collection"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.972 6.014l-.89 2.504-.012.032c-.04.112-.107.302-.196.482A3.259 3.259 0 018.487 10.8a4.344 4.344 0 01-.552.048l-2.74.126 2.284 1.91.025.02c.087.073.234.196.366.335.69.724 1.01 1.726.865 2.717-.027.19-.077.375-.106.484a6.606 6.606 0 00-.008.032l-.745 2.826 2.09-1.455.03-.02c.1-.07.27-.19.452-.286a3.26 3.26 0 013.047 0c.182.096.352.215.453.285l.029.02 2.09 1.456-.745-2.826a4.343 4.343 0 01-.114-.516 3.259 3.259 0 01.865-2.717 4.32 4.32 0 01.367-.334l.025-.021 2.283-1.91-2.74-.126-.034-.001a4.344 4.344 0 01-.518-.047 3.259 3.259 0 01-2.387-1.768c-.089-.18-.156-.37-.196-.482l-.01-.032-.891-2.504zm-1.048-2.91c-.086.13-.183.4-.376.943l-1.351 3.8c-.055.154-.082.23-.115.297-.18.363-.523.617-.922.683a2.867 2.867 0 01-.317.024l-3.995.183c-.532.025-.798.037-.943.08a1.259 1.259 0 00-.66 1.953c.09.122.295.293.703.635l3.247 2.716c.119.099.178.148.227.2.267.28.39.667.334 1.05-.01.07-.03.145-.07.294l-1.084 4.113c-.142.54-.214.81-.216.964-.012.89.876 1.511 1.707 1.194.144-.055.374-.214.833-.534l3.183-2.215c.138-.096.207-.144.274-.18a1.259 1.259 0 011.177 0c.068.037.137.085.274.18l3.184 2.215c.458.32.688.48.832.534a1.259 1.259 0 001.707-1.194c-.002-.154-.073-.424-.216-.965l-1.085-4.112c-.039-.15-.059-.224-.069-.294-.056-.383.068-.77.334-1.05.05-.052.109-.101.227-.2l3.247-2.716c.409-.342.613-.513.703-.635a1.259 1.259 0 00-.66-1.953c-.145-.043-.41-.055-.942-.08L16.1 8.851a2.869 2.869 0 01-.317-.024c-.399-.066-.742-.32-.922-.683-.033-.067-.06-.143-.115-.296l-1.351-3.801c-.193-.542-.29-.814-.376-.943a1.259 1.259 0 00-2.095 0z"
                    fill="rgba(22, 24, 35, 0.75)"
                    fill-opacity="0.75"
                  ></path>
                </svg>
              </div>
              <p class="collection-box-title">仅收藏视频</p>
            </div>
          </div>
        </div>
      </div>
      <div class="video-action-item">
        <svg-icon class="icon" icon="fenxiang" />
        <span class="num">9</span>
      </div>

      <div
        class="video-action-item"
        @mouseenter="showMoreBox = true"
        @mouseleave="showMoreBox = false"
      >
        <svg-icon class="icon" icon="more" />
        <div
          class="more-box"
          ref="more"
          :style="{ width: `${width}px`, display: 'flex' }"
          v-if="showMoreBox"
        >
          <div class="more-box-content">
            <div class="more-box-item">
              <div class="more-box-icon">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class=""
                  viewBox="0 0 36 36"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.749 8.693c1.775-.25 3.457.38 4.9 1.662a.95.95 0 01.32.693l.043 2.458 2.438 1.799a.95.95 0 01.208 1.316L17.86 19.14l1.21 2.554a.95.95 0 01-1.718.813l-1.448-3.059a.95.95 0 01.086-.958l1.579-2.212-2.063-1.522a.95.95 0 01-.386-.748l-.043-2.493c-1.018-.795-2.053-1.083-3.063-.94-2.102.294-3.808 2.711-3.408 5.558.011.081.021.141.03.193l.005.03v.001l.015.108.004.037c.052.28.175.692.335 1.12.172.461.353.848.467 1.031l.014.024c1.036 1.78 2.92 3.612 4.648 5.066a46.926 46.926 0 002.25 1.772c.3.223.552.404.74.54l.058.041c.14.1.282.203.349.26.075.065.125.106.172.142a.573.573 0 00.103.063h.01a.241.241 0 00.081-.013.951.951 0 01.277-.085h.002c.001-.001.01-.005.027-.017a.836.836 0 00.08-.066c.04-.035.08-.074.136-.13.07-.07.213-.184.337-.284l.031-.024.058-.046c.153-.124.348-.28.575-.466.514-.419 1.195-.99 1.935-1.662 1.477-1.34 3.134-3.037 4.186-4.713.103-.242.191-.406.344-.64.05-.115.106-.236.165-.35.04-.076.09-.169.154-.264.183-.58.285-1.006.332-1.5l.001-.047.007-.1.003-.03c.004-.05.01-.108.015-.187.195-2.783-1.623-5.003-3.667-5.146-1.16-.08-2.493.442-3.14 1.337a.95.95 0 01-1.54-1.111c1.104-1.53 3.133-2.238 4.813-2.12 3.366.234 5.676 3.641 5.43 7.172l-.019.228-.002.02c0 .03 0 .06-.003.09-.066.765-.229 1.384-.47 2.128a.95.95 0 01-.185.329l-.001.002a1.002 1.002 0 00-.042.075c-.04.076-.085.175-.14.302a.943.943 0 01-.081.152 2.119 2.119 0 00-.25.462.938.938 0 01-.07.137c-1.193 1.926-3.032 3.791-4.563 5.181a50.77 50.77 0 01-2.598 2.203c-.02.015-.04.03-.057.045l-.188.152-.038.03-.03.03c-.188.186-.555.55-1.125.68-.15.06-.31.102-.48.126-.923.13-1.502-.367-1.79-.616l-.03-.025-.04-.03-.243-.174c-.19-.136-.449-.324-.76-.554a48.738 48.738 0 01-2.341-1.845c-1.76-1.48-3.852-3.48-5.062-5.554-.21-.343-.44-.86-.625-1.356-.189-.505-.368-1.081-.442-1.542a.95.95 0 01-.01-.098l-.002-.011c-.008-.052-.022-.134-.037-.239-.504-3.589 1.611-7.225 5.025-7.704z"
                    fill="rgba(22,24,35,.6)"
                    fill-opacity="0.9"
                  ></path>
                </svg>
              </div>
              <div class="more-box-title">不感兴趣</div>
            </div>
            <div class="more-box-item">
              <div class="more-box-icon">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class=""
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M10 9a2 2 0 012-2h12a2 2 0 012 2v19a2 2 0 01-2 2H12a2 2 0 01-2-2V9zm2 2v16a1 1 0 001 1h10a1 1 0 001-1V11a1 1 0 00-1-1H13a1 1 0 00-1 1zm4.5-3a.5.5 0 000 1h3a.5.5 0 000-1h-3z"
                    fill="rgba(22,24,35,.6)"
                    fill-opacity="0.9"
                  ></path>
                </svg>
              </div>
              <div class="more-box-title">手机续播</div>
            </div>
            <div
              class="more-box-item"
              v-show="isAttent === 1 || isAttent === 3"
              @click="handleAttention"
            >
              <div class="more-box-icon">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class=""
                  viewBox="0 0 36 36"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.6 10.857c0-2.409 1.988-4.33 4.4-4.33 2.412 0 4.4 1.921 4.4 4.33V13c0 2.39-1.96 4.3-4.348 4.327h-.104C14.561 17.3 12.6 15.39 12.6 13v-2.143zm4.4-2.53c-1.453 0-2.6 1.15-2.6 2.53V13c0 1.366 1.128 2.508 2.564 2.527h.072C18.472 15.508 19.6 14.366 19.6 13v-2.143c0-1.38-1.148-2.53-2.6-2.53z"
                    fill="rgba(22,24,35,.6)"
                    fill-opacity="0.9"
                  ></path>
                  <path
                    d="M21.399 23.23c-.405 0-.732.382-.732.854 0 .471.327.854.732.854h3.66c.405 0 .733-.383.733-.854 0-.472-.328-.854-.732-.854h-3.661z"
                    fill="rgba(22,24,35,.6)"
                    fill-opacity="0.9"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M28.354 24.084a5.127 5.127 0 01-5.125 5.125 5.127 5.127 0 01-5.125-5.125 5.127 5.127 0 015.125-5.125 5.127 5.127 0 015.125 5.125zm-1.8 0a3.327 3.327 0 01-3.325 3.325 3.327 3.327 0 01-3.325-3.325 3.327 3.327 0 013.325-3.325 3.327 3.327 0 013.325 3.325zM16.414 20.525c.342-.654-.086-1.566-.825-1.566h-1.756A6.833 6.833 0 007 25.792a2.563 2.563 0 002.563 2.563h5.674c.683 0 1.109-.779.854-1.413a7.66 7.66 0 01-.55-2.859 7.65 7.65 0 01.873-3.558zm-2.58.234h.508a9.465 9.465 0 00-.6 3.324c0 .854.113 1.682.325 2.472H9.563a.763.763 0 01-.762-.763 5.033 5.033 0 015.033-5.033z"
                    fill="rgba(22,24,35,.6)"
                    fill-opacity="0.9"
                  ></path>
                </svg>
              </div>
              <div class="more-box-title">取消关注</div>
            </div>
            <div class="more-box-item">
              <div class="more-box-icon">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class=""
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M28.928 23.422c1.014 1.647-.225 3.843-2.367 3.843H9.315c-2.029 0-3.269-2.196-2.254-3.843l8.68-14.604c.45-.879 1.352-1.318 2.253-1.318.902 0 1.804.44 2.255 1.318l8.68 14.604zm-1.766 1.008l-.016-.027-8.68-14.604-.058-.106c-.07-.137-.213-.217-.414-.217-.2 0-.342.08-.413.217l-.058.106-8.696 14.63c-.216.352.077.86.488.86h17.246c.519 0 .82-.504.6-.86zm-9.368-10.545c-.513 0-.924.301-.924.678v5.343c0 .377.41.679.924.679H18c.513 0 .924-.302.924-.679v-5.343c0-.377-.411-.678-.924-.678h-.206zm-.924 8.872c0 .253.11.505.3.684a1.073 1.073 0 001.453 0 .95.95 0 00.3-.684.95.95 0 00-.3-.683 1.073 1.073 0 00-1.452 0 .95.95 0 00-.3.683z"
                    fill="rgba(22,24,35,.6)"
                    fill-opacity="0.9"
                  ></path>
                </svg>
              </div>
              <div class="more-box-title">举报</div>
            </div>
            <div class="more-box-item">
              <div class="more-box-icon">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="kuaijie-icon"
                  viewBox="0 0 36 36"
                >
                  <rect
                    x="6"
                    y="9"
                    width="24"
                    height="18"
                    rx="2"
                    stroke="rgba(22,24,35,.6)"
                    stroke-opacity="0.8"
                    stroke-width="2"
                  ></rect>
                  <path
                    stroke="rgba(22,24,35,.6)"
                    stroke-opacity="0.8"
                    stroke-width="2"
                    stroke-linecap="round"
                    d="M11 22h14M11 14h2M17 14h2M23 14h2M23 18h2M17 18h2M11 18h2"
                  ></path>
                </svg>
              </div>
              <div class="more-box-title">快捷键列表</div>
            </div>
          </div>
          <div class="more-music-detail" :style="{ maxWidth: `${maXWidth}` }">
            <div class="more-music-author">
              <div class="more-music-content">
                <div class="more-music-icon">
                  <svg
                    width="36"
                    height="36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class=""
                    viewBox="0 0 36 36"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8.783 8.886c.041.001.082.005.124.009V8.89l-.124-.004zm18.337 1.208a1.631 1.631 0 00-.537-1.24 1.589 1.589 0 00-1.277-.4h-.004l-10.57 1.641a1.58 1.58 0 00-1.365 1.553l-.215 11.82a3.2 3.2 0 00-2.438-1.241c-1.76-.048-3.212 1.355-3.244 3.134-.032 1.78 1.368 3.261 3.127 3.31 1.76.047 3.212-1.356 3.245-3.135l.17-9.368 12.307-2.026-.176 9.709a3.2 3.2 0 00-2.459-1.269c-1.76-.048-3.212 1.355-3.244 3.135-.033 1.779 1.368 3.26 3.127 3.309 1.76.048 3.212-1.356 3.244-3.135l.309-15.797z"
                      fill="rgba(22, 24, 35, 0.6)"
                      fill-opacity="0.8"
                    ></path>
                  </svg>
                  testsss阿萨
                </div>
                <div class="more-music-num">1人使用</div>
              </div>
            </div>
            <button
              type="button"
              class="favorite-button favorite-label favorite-badge favorite-button-container"
            >
              <svg
                width="12"
                height="13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class=""
                viewBox="0 0 12 13"
              >
                <path
                  d="M6 2.771l.78 1.945c.164.41.546.693.986.73l2.12.176-1.648 1.466a1.167 1.167 0 00-.362 1.134l.49 2.13-1.74-1.104a1.167 1.167 0 00-1.251 0l-1.74 1.103.489-2.13a1.167 1.167 0 00-.362-1.133L2.113 5.622l2.121-.177c.441-.037.823-.319.987-.729l.78-1.945zM6.512.913a.543.543 0 00-1.024 0l-1.35 3.37-3.455.287c-.501.042-.7.719-.313 1.063L2.987 7.96l-.806 3.51c-.12.516.398.932.824.662L6 10.232l2.995 1.9c.426.27.943-.146.825-.663L9.013 7.96l2.617-2.327c.387-.344.188-1.021-.312-1.063l-3.455-.288-1.35-3.37z"
                  fill="#fff"
                ></path>
              </svg>
              <span>收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-action {
  position: absolute;
  bottom: 60px;
  // right: 38px;
  right: 0;
  height: auto;
  padding-right: 38px;
  z-index: 100;
  color: #fff;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  flex-shrink: 0;

  align-items: center;
  height: 100%;
  justify-content: flex-end;
  // padding-right: 15px;

  .video-action-content {
    align-items: center;
    display: flex;
    filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
    flex-direction: column;
    flex-shrink: 0;
    justify-content: center;
    margin-bottom: 0;
    position: relative;

    .avatar-content {
      margin-bottom: 23px;
      margin-top: 24px;
      position: relative;
      .video-action-avatar {
        height: 40px;
        width: 40px;
        box-sizing: content-box;
        flex-grow: 0;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid rgba(231, 231, 236, 0.3) !important;
        transition: transform 0.35s cubic-bezier(0.34, 0.69, 0.1, 1);

        &:hover {
          transform: scale(1.1);
        }

        .el-avatar {
          height: 100%;
          width: 100%;
        }
      }
      .video-action-avatar-follow {
        bottom: -12px;
        cursor: pointer;
        height: 24px;
        left: 0px;
        position: absolute;
        right: 0px;
        width: 24px;
        margin: 0px auto;
        display: flex;
        justify-content: center;
        .icon {
          height: 20px;
          width: 20px;
          opacity: 1;
          color: #fff;
        }
        .icon.liked {
          color: red !important;
        }
      }
    }
  }
  .video-action-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    cursor: pointer;
    position: relative;

    .num {
      margin-left: 5px;
    }

    .icon {
      height: 50px;
      width: 50px;
      color: #fff;
      opacity: 1;

      &:hover {
        animation: swing 0.5s infinite;
      }
      @keyframes swing {
        0% {
          transform: translateX(-5px);
        }
        25% {
          transform: translateX(0) translateY(-5px);
          transform-origin: center;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        50% {
          transform: translateX(5px);
          transform-origin: center;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        75% {
          transform: translateX(0) translateY(-5px);
          transform-origin: center;
          animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        100% {
          transform: translateX(-5px);
        }
      }
    }
    .icon-collect {
      height: 50px;
      width: 26px;
      color: #fff;
      opacity: 1;
      margin-left: 5px;
    }

    .icon.liked {
      color: rgb(254, 44, 85);
    }
    .icon-collect.collect {
      color: rgb(255, 184, 2) !important;
    }
  }
}

.like-box {
  // background-color: #323442;
  background-color: var(--color-bg-toast);
  // background-color: rgba(65, 66, 67, 1);
  border-radius: 6px;
  // color: #fff;
  // color: rgba(255, 255, 255, 1);
  color: var(--color-const-text-white);
  font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 40px;
  position: absolute;
  text-align: center;

  &.postion {
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
  }
  &.swiper {
    // background-color: #41424c;
    background-color: var(--color-bg-toast);
    // background-color: rgba(65, 66, 67, 1);
    top: 10px !important;
    transform: translateY(0) !important;
  }

  .like-box-icon {
    position: absolute;

    &.postion {
      right: -4px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .like-box-title {
    padding: 0 16px;
    white-space: nowrap;
    .like-box-text {
      align-items: center;
      background: #fff;
      border: 1px solid #fff;
      border-radius: 3px;
      color: #323442;
      display: flex;
      display: inline-flex;
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
      font-size: 13px;
      font-weight: 500;
      height: 18px;
      justify-content: center;
      line-height: 21px;
      margin: 0 5px;
      vertical-align: baseline;
      width: 18px;
    }
  }
}

.more-box {
  align-items: center;
  // background: #fff;
  background: var(--color-bg-b1-white);
  // background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  bottom: 0;
  // box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  box-shadow: var(--shadow-1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 240px;
  padding: 16px;
  position: absolute;
  right: 50px;
  z-index: 10;

  & * {
    vertical-align: bottom;
  }

  .more-box-content {
    display: flex;
    justify-content: space-around;
    width: 100%;

    .more-box-item {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 8px;
      width: 64px;

      .more-box-icon {
        align-items: center;
        // background: #f2f2f4;
        background: var(--color-bg-b2);
        border-radius: 24px;
        display: flex;
        height: 48px;
        justify-content: center;
        position: relative;
        transition: 0.3s;
        width: 48px;

        &:hover {
          background: var(--color-bg-b3);
          // background: rgba(228, 228, 230, 1);
          transform: scale(1.05);
        }

        svg {
          rect {
            stroke: var(--color-text-t3);
          }
          path {
            fill: var(--color-text-t3);
          }
        }
        .kuaijie-icon {
          path {
            fill: var(--color-text-t3);
            stroke: var(--color-text-t3);
          }
          path rect {
            stroke: var(--color-text-t3);
          }
        }
      }

      .more-box-title {
        // color: rgba(22, 24, 35, 0.6);
        color: var(--color-text-t3);
        font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
        margin-top: 8px;
      }
    }
  }

  .more-music-detail {
    align-items: center;
    // border-top: 1px solid rgba(22, 24, 35, 0.06);
    border-top: 1px solid var(--color-line-l3);
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    width: 100%;

    .more-music-author {
      align-items: center;
      display: flex;
      flex: 1 1;
      height: 36px;
      margin-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .more-music-content {
        overflow: hidden;

        .more-music-icon {
          // color: rgba(22, 24, 35, 0.6);
          color: var(--color-text-t3);
          font-size: 12px;
          line-height: 18px;
          overflow: hidden;
          text-overflow: ellipsis;

          svg {
            rect {
              stroke: var(--color-text-t3);
            }
            path {
              fill: var(--color-text-t3);
            }
          }
        }

        .more-music-num {
          // color: rgba(22, 24, 35, 0.34);
          color: var(--color-text-t4);
          font-size: 12px;
          overflow: hidden;
          padding-left: 3px;
          text-overflow: ellipsis;
        }
      }

      svg {
        flex: 0 0 20px;
        height: 20px;
        width: 20px;
      }
    }

    .favorite-button {
      &,
      span {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      align-items: center;
      background: #fe2c55;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      display: flex;
      font-size: 12px;
      height: 28px;
      justify-content: center;
      margin: 0;
      min-width: unset;
      padding: 0;
      width: 64px;

      &:hover {
        //添加背景阴影
        // background: rgba(210, 27, 70, 1);
        background-color: var(--color-primary-hover);
      }
      .favorite-badge {
        // background-color: #fe2c55;
        background-color: var(--color-primary);
        // color: #fff;
        color: var(--color-const-text-white);
      }

      .favorite-label {
        border-radius: 4px;
        font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 36px;
        line-height: 22px;
        min-width: 88px;
      }

      .favorite-button-container {
        align-items: center;
        border: 0;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        margin: 0 8px;
        outline: none;
        padding: 0 16px;
        position: relative;
      }
    }
  }
}

.collection-box {
  background-color: var(--color-bg-b1);
  // background-color: rgba(249, 249, 249, 1);
  border-radius: 4px;
  bottom: 0;
  box-shadow: var(--shadow-2);
  // box-shadow: 0 0 24px rgba(0, 0, 0, 0.12);
  cursor: auto;
  overflow: hidden;
  position: absolute;
  right: 50px;

  &-content,
  &-item {
    align-items: center;
    display: flex;
  }

  &-content {
    gap: 18px;
    padding: 16px !important;
  }

  &-item {
    cursor: pointer;
    flex-direction: column;

    .collection-box-icon {
      align-items: center;
      background-color: var(--color-bg-b2);
      // background-color: rgba(242, 242, 243, 1);
      border-radius: 100%;
      cursor: pointer;
      display: flex;
      height: 48px;
      justify-content: center;
      transition: 0.3s;
      width: 48px;

      .box-icon-all {
        height: 24px;
        width: 24px;

        &.collection-folder-icon path {
          stroke: var(--color-text-1);
          // stroke: rgba(22, 24, 35, 0.75);
        }

        &.video-collection {
          // fill: rgba(22, 24, 35, 0.75);
          height: 24px;
          width: 24px;
          path {
            fill: var(--color-text-1);
          }
        }
      }
    }

    &:hover .collection-box-icon {
      background: var(--color-bg-b3);
      // background: rgba(228, 228, 230, 1);
      transform: scale(1.05);
    }

    .collection-box-title {
      color: var(--color-text-t3);
      // color: rgba(22, 24, 35, 0.6);
      font-size: 12px;
      line-height: 20px;
      margin-top: 8px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
</style>
