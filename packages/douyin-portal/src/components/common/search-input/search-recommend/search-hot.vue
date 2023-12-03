<script setup lang="ts">
import { ref } from 'vue'
// 热榜
const hotList = ref([
  {
    id: 1,
    text: '习近平向2023北京文化论坛致贺信',
    num: '',
    isFirstRelease: false,
    isHot: false,
    isNew: false
  },
  {
    id: 2,
    text: '央行15日降准0.25个百分点',
    num: '1017.2万',
    isFirstRelease: false,
    isHot: true,
    isNew: false
  },
  {
    id: 3,
    text: '欧文开通抖音账号',
    num: '1017.2万',
    isFirstRelease: true,
    isHot: false,
    isNew: false
  },
  {
    id: 4,
    text: '亚运会吉祥物3小只宣传片',
    num: '1003.8万',
    isFirstRelease: false,
    isHot: false,
    isNew: true
  },
  {
    id: 5,
    text: '中国航天回应墨西哥外星遗骸',
    num: '1001.1万',
    isFirstRelease: false,
    isHot: false,
    isNew: false
  },
  {
    id: 6,
    text: '无锋首领竟是点竹',
    num: '985.4万',
    isFirstRelease: false,
    isHot: false,
    isNew: false
  },
  {
    id: 7,
    text: '67岁演员马卫军去世',
    num: '979.3万',
    isFirstRelease: false,
    isHot: true,
    isNew: false
  },
  {
    id: 8,
    text: '赖益烨回应收入争议',
    isFirstRelease: false,
    num: '961.6万',
    isHot: true,
    isNew: false
  },
  {
    id: 9,
    text: '郁美净涨粉速度有多快',
    num: '960.0万',
    isFirstRelease: false,
    isHot: true,
    isNew: false
  },
  {
    id: 10,
    text: '周口辟谣河中发现巨型长虫',
    num: '948.4万',
    isFirstRelease: false,
    isHot: false,
    isNew: false
  },
  {
    id: 11,
    text: '抖音严惩虚假动植物科普信息',
    num: '934.4万',
    isFirstRelease: false,
    isHot: false,
    isNew: false
  }
])
</script>
<template>
  <div class="search-hot-top" style="height: 24px; margin-top: 4px">
    <svg
      width="54"
      height="13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class=""
      viewBox="0 0 54 13"
    >
      <path
        d="M1.699 3.616H0V2.151h1.699V0H3.15v2.15h1.493v1.466H3.15v2.768l1.493-.233v1.548l-1.493.219v3.384c0 .337-.119.625-.356.863a1.175 1.175 0 01-.863.356H.205v-1.452H1.33c.1 0 .187-.037.26-.11a.356.356 0 00.11-.26V8.137L0 8.397V6.85l1.699-.26V3.616zM11.452 0v7.52l1.48-.136v1.548l-1.48.137v3.575H9.986V9.192l-4.808.425V8.069l4.808-.411V0h1.466zM5.781 5.85V4.3l3.452.617v1.548l-3.452-.617zm0-3.22V1.096l3.452.616v1.535L5.781 2.63z"
        fill="url(#hot-title_svg__paint0_linear_2723_113227)"
      ></path>
      <path
        d="M13.63 5.754V4.288h2.918l-.178-1.151h1.548l.178 1.15h4.041l.22-1.15h1.547l-.232 1.15h2.863v1.467H13.63zm.411-3.26V1.04h5.288l-.233-.973h1.89l.233.973h4.905v1.452H14.04zm.767 5.534c0-.338.12-.626.357-.864.237-.237.525-.356.863-.356h8.11c.337 0 .625.119.862.356.238.238.357.526.357.864v3.328c0 .338-.12.626-.357.863-.237.247-.525.37-.863.37h-8.11c-.337 0-.625-.123-.862-.37a1.175 1.175 0 01-.357-.863V8.028zm1.37 2.274v.602c0 .1.037.188.11.26.073.074.16.11.26.11h7.083c.1 0 .182-.036.246-.11a.355.355 0 00.11-.26v-.602h-7.809zm7.809-1.22v-.589c0-.1-.037-.187-.11-.26a.313.313 0 00-.246-.11h-7.083c-.1 0-.187.037-.26.11a.355.355 0 00-.11.26v.59h7.809z"
        fill="url(#hot-title_svg__paint1_linear_2723_113227)"
      ></path>
      <path
        d="M39.932 9.384h-1.301c-.338 0-.626-.119-.863-.356a1.175 1.175 0 01-.357-.864V2.782c0-.1-.036-.187-.11-.26a.356.356 0 00-.26-.11h-1.136l-.562 2.493 1.52.274v1.548l-1.849-.329-.685 2.987h-1.602l.74-3.274-.658-.11V4.452l.986.178.507-2.219h-1.493V.973h1.808l.205-.918h1.617l-.206.918h1.411c.338 0 .626.118.863.356.238.237.357.525.357.863v5.383c0 .1.036.188.11.26.072.074.159.11.26.11h.698v1.439zm-12.356 3.191l.589-2.41h1.822l-.59 2.41h-1.821zm.178-6.205V4.836l1.616-.22V2.412h-1.616V.973h1.616V.055h1.466v.918h1.48V2.41h-1.48v2.014l1.48-.206v1.535l-1.48.205v2.22c0 .337-.123.625-.37.862a1.175 1.175 0 01-.863.356h-1.575V7.96H29c.1 0 .188-.032.26-.096a.356.356 0 00.11-.26V6.15l-1.616.219zm3.192 3.795h1.822l.589 2.41h-1.822l-.59-2.41zm3.37 0h1.822l.589 2.41h-1.822l-.59-2.41zm3.37 0h1.821l.59 2.41h-1.822l-.59-2.41z"
        fill="url(#hot-title_svg__paint2_linear_2723_113227)"
      ></path>
      <path
        d="M52.398 8.233c.338 0 .626.123.863.37.237.237.356.525.356.863v1.863c0 .338-.118.625-.356.863a1.175 1.175 0 01-.863.356H50.48v-1.356h1.411c.1 0 .187-.037.26-.11a.355.355 0 00.11-.26V9.96c0-.1-.037-.183-.11-.247a.356.356 0 00-.26-.11h-3.41c-.266 1.152-.6 2.143-1 2.973h-1.604a18.311 18.311 0 001.425-5.068h-1.164V6.15h2.959l-.137-.562h1.465l.137.562h2.822v1.356h-4.561l-.096.726h3.671zm-11.302-.301c.567-.411 1.01-.987 1.33-1.726.319-.75.483-1.599.492-2.548h-1.822V2.206h1.822V.055h1.466v2.15h1.247v1.453h-1.247v2.561l1.123.206v1.534l-1.123-.192v4.808h-1.466V8.123c-.52.658-1.127 1.137-1.822 1.439v-1.63zm4.713-2.343v-.753c0-.338.119-.626.356-.863.238-.238.525-.357.863-.357h.575l-.205-1.068h1.438l.206 1.068h1.438l.206-1.068h1.438l-.206 1.068h.48c.338 0 .626.12.863.357s.356.525.356.863v.698H52.22v-.191c0-.247-.073-.37-.22-.37h-4.424c-.1 0-.187.036-.26.11a.356.356 0 00-.11.26v.246H45.81zm.329-3.438V.808h3.013l-.178-.753h1.466l.192.753h2.753v1.343h-7.246z"
        fill="url(#hot-title_svg__paint3_linear_2723_113227)"
      ></path>
      <defs>
        <linearGradient
          id="hot-title_svg__paint0_linear_2723_113227"
          x1="45.489"
          y1="2.147"
          x2="23.573"
          y2="-24.358"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF4D74"></stop>
          <stop offset="0.446" stop-color="#FD6D5D"></stop>
          <stop offset="1" stop-color="#FAB14A"></stop>
        </linearGradient>
        <linearGradient
          id="hot-title_svg__paint1_linear_2723_113227"
          x1="45.489"
          y1="2.147"
          x2="23.573"
          y2="-24.358"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF4D74"></stop>
          <stop offset="0.446" stop-color="#FD6D5D"></stop>
          <stop offset="1" stop-color="#FAB14A"></stop>
        </linearGradient>
        <linearGradient
          id="hot-title_svg__paint2_linear_2723_113227"
          x1="45.489"
          y1="2.147"
          x2="23.573"
          y2="-24.358"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF4D74"></stop>
          <stop offset="0.446" stop-color="#FD6D5D"></stop>
          <stop offset="1" stop-color="#FAB14A"></stop>
        </linearGradient>
        <linearGradient
          id="hot-title_svg__paint3_linear_2723_113227"
          x1="45.489"
          y1="2.147"
          x2="23.573"
          y2="-24.358"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF4D74"></stop>
          <stop offset="0.446" stop-color="#FD6D5D"></stop>
          <stop offset="1" stop-color="#FAB14A"></stop>
        </linearGradient>
      </defs>
    </svg>
  </div>
  <div class="search-hot-container">
    <div
      v-for="(item, index) in hotList"
      :key="item.id"
      class="search-hot-box"
      :class="{
        'hot-box-top': index === 0,
        'hot-box-rank': index > 0 && index < 4
      }"
    >
      <div class="search-hot-box-title">
        <svg-icon v-if="index === 0" icon="hot-top" class="num-icon" />
        <svg-icon v-if="index === 1" icon="hot-1" class="num-icon" />
        <svg-icon v-if="index === 2" icon="hot-2" class="num-icon" />
        <svg-icon v-if="index === 3" icon="hot-3" class="num-icon" />
        <div class="hot-box-icon-num" v-if="index >= 4">
          {{ index }}
        </div>
        <span class="hot-box-text">{{ item.text }}</span>
        <img
          src="data:image/png;base64,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"
          class="hot-box-img"
          style="width: 18px; height: 18px"
          v-if="item.isHot"
        />
        <img
          src="data:image/png;base64,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"
          class="hot-box-img"
          style="width: 30px; height: 18px"
          v-if="item.isFirstRelease"
        />
        <img
          src="data:image/png;base64,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"
          class="hot-box-img"
          style="width: 18px; height: 18px"
          v-if="item.isNew"
        />
      </div>
      <div
        class="hot-box-num"
        :class="{
          'hot-box-rank-num': index > 0 && index < 4
        }"
        v-if="item.num !== ''"
      >
        {{ item.num }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-hot-top {
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;
}
.hot-box-top {
  // background: linear-gradient(90deg, #323f5a, rgba(50, 63, 90, 0) 100%);
  background: var(--linear-gradient-bg-top) !important;
  // background: linear-gradient(
  //   90deg,
  //   #ebf0fd,
  //   rgba(215, 228, 255, 0)
  // ) !important;
  flex-shrink: 0;
}

.search-hot-box {
  // background: linear-gradient(
  //   90deg,
  //   hsla(0, 0%, 99%, 0.06),
  //   hsla(0, 0%, 96%, 0)
  // );
  background: var(--linear-gradient-bg-1);
  border-radius: 4px;
  cursor: pointer;
  height: 32px;
  justify-content: space-between;
  margin: 6px 20px 0;
  padding: 0 8px;

  &,
  & .search-hot-box-title {
    align-items: center;
    display: flex;
  }

  .search-hot-box-title {
    flex-shrink: 1;
    overflow: hidden;
  }

  .hot-box-rank-num {
    color: #ad9692;
  }
  .hot-box-num {
    // color: rgba(22, 24, 35, 0.6);
    color: var(--color-text-t3);
    flex-shrink: 0;
    font-size: 10px;
    padding-left: 8px;
  }

  &.z9qGEsHa,
  &:hover {
    //background: #41424c;
    background: var(--color-bg-b3) !important;
    // background-color: rgba(228, 228, 230, 1) !important;
  }
}

.hot-box-text {
  // color: hsla(0, 0%, 100%, 0.9);
  color: var(--color-text-t1);
  // color: rgba(22, 24, 35, 1);
  flex-shrink: 1;
  font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-box-rank {
  // background: linear-gradient(90deg, #403a3a, rgba(64, 58, 58, 0) 100%);
  background: var(--linear-gradient-bg-num);
  // background: linear-gradient(90deg, #faf4ef, #f9f9fa);
  flex-shrink: 0;
}

.hot-box-img {
  background-repeat: no-repeat;
  background-size: cover;
}
._mLDXtMc,
.hot-box-img {
  flex-shrink: 0;
  margin-left: 4.8px;
}

.num-icon {
  margin-right: 4px;
  width: 16px;
  height: 16px;
}

.hot-box-icon-num {
  align-items: center;
  //color: hsla(0, 0%, 100%, 0.5);
  // color: rgba(22, 24, 35, 0.6);
  color: var(--color-text-t3);
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  height: 16px;
  justify-content: center;
  margin-right: 4px;
  width: 16px;
}
</style>
