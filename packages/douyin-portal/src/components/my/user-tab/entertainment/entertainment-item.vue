<script setup lang="ts">
import {} from 'vue'
</script>
<template>
  <div class="entertainment-item">
    <a
      href="#"
      class="entertainment-item-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="entertainment-item-content">
        <div class="entertainment-item-content-left">
          <div class="entertainment-item-content-left-i">
            <img
              src="https://p3-sign.bdxiguaimg.com/tos-cn-p-0026/2949fd98dd4f4319352f66ecc57e1a69~tpl-1_0x480_q75.jpeg?x-expires=1682429413&amp;x-signature=J7RDiFeECSxvAzmPAh5IBxCBUsY%3D"
              alt="人是铁饭是钢"
              class="entertainment-item-content-left-i-img"
            />
          </div>
          <span class="entertainment-item-content-left-time">00:00:00</span>
        </div>
        <div class="entertainment-item-content-right">
          <div class="entertainment-item-content-right-title">
            第27集 | 电视剧《人是铁饭是钢》
          </div>
          <div class="entertainment-item-content-right-blank"></div>
          <div class="entertainment-item-content-right-time-content">
            <svg
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 20 20"
            >
              <g opacity="0.9" fill="#AEAFB3">
                <path
                  d="M14.873 15.507h-.45V14.21a4.28 4.28 0 00-2.398-3.846 4.28 4.28 0 002.398-3.845V5.22h.45c.232 0 .42-.191.42-.428a.424.424 0 00-.42-.429H5.42a.424.424 0 00-.42.429c0 .237.188.428.42.428h.442V6.52a4.28 4.28 0 002.398 3.845 4.28 4.28 0 00-2.398 3.846v1.297H5.42a.424.424 0 00-.42.429c0 .236.188.428.42.428h9.453c.232 0 .42-.192.42-.428a.424.424 0 00-.42-.429zM6.719 6.492v-1.27h6.872v1.27a3.436 3.436 0 01-6.872 0zm6.872 9.015H6.719v-1.27a3.436 3.436 0 016.872 0v1.27z"
                ></path>
                <path
                  d="M10.578 8.656a.429.429 0 00-.43-.429c-.96 0-1.712-.752-1.712-1.712a.429.429 0 00-.858 0c0 1.441 1.13 2.57 2.57 2.57a.429.429 0 00.43-.429z"
                ></path>
              </g></svg
            ><span class="entertainment-item-content-right-time-content-d"
              >观看到1%</span
            >
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.entertainment-item {
  display: inline-block;
  margin-bottom: 16px;
  vertical-align: top;
  width: calc(50% - 8px);
  &:nth-child(odd) {
    margin-left: 16px;
  }

  .entertainment-item-link {
    position: relative;

   .entertainment-item-content {
      background-color: #f2f2f4;
      background-color: rgba(242, 242, 243, 1);
      border-radius: 6px;
      display: flex;
      height: 112px;
      overflow: hidden;
      padding: 16px;
      &-left {
        border-radius: 4px;
        flex: none;
        overflow: hidden;
        position: relative;
        width: 161px;
        &-i {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
          &-img {
            color: #161722;
            max-height: 100%;
            max-width: 100%;
            position: relative;
            transition: all 0.3s linear;
          }
        }
        &-time {
          bottom: 2px;
          color: #fff;
          font-size: 12px;
          letter-spacing: 0.6px;
          position: absolute;
          right: 16px;
        }
      }
      &-right {
        flex: 1 1;
        margin-left: 8px;
        width: calc(100% - 130px);
        &-title {
          color: #161823;
          color: rgba(22, 24, 35, 1);
          font-size: 14px;
          font-weight: 500;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &-blank {
          display: flex;
          height: 22px;
          margin: 6px 0;
        }
        &-time-content {
          display: flex;
          &-d {
            color: rgba(22, 24, 35, 0.6);
            font-size: 12px;
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>
