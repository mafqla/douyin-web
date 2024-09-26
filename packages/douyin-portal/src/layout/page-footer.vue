<script setup lang="ts">
import {} from 'vue'
import apis from '@/api/apis'
import type { LinkItem } from '@/api/tyeps/request_response/footerLinksRes'

const links = ref<LinkItem[]>([])

const getLinks = async () => {
  const res = await apis.getFooterLinks()
  links.value = res.link_data.flatMap((item) => {
    if (item.link_list) {
      return item.link_list
    }
    return []
  })
  // console.log(links.value)
}
onMounted(() => {
  getLinks()
})
// console.log(links.value)
</script>
<template>
  <div class="page-footer">
    <div class="footer-link">
      <div class="footer-link-title">
        <a
          href="https://www.oceanengine.com/resource/douyin"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >广告投放</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/agreements/?id=6773906068725565448"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >用户服务协议</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/agreements/?id=6773901168964798477"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >隐私政策</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/recovery_account/"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >账号找回</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/aboutus/"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >联系我们</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/aboutus/"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >加入我们</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/business_license/"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >营业执照</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/friend_links"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer "
          >友情链接</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/htmlmap/hotauthor_0_1"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer "
          >站点地图</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://www.douyin.com/downloadpage"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer "
          >下载抖音</a
        >
      </div>
      <div class="footer-link-title">
        <a
          href="https://mix.jinritemai.com/falcon/mix_page/index.html"
          class="footer-link-title-a"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >抖音电商</a
        >
      </div>
    </div>

    <div class="JXaUfgsM">
      <div class="cHlCoDpR">
        <a
          href="https://www.piyao.org.cn/yybgt/index.htm"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >网络谣言曝光台 ｜
        </a>
      </div>
      <div class="cHlCoDpR">
        <a
          href="https://www.12377.cn/"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >网上有害信息举报</a
        >
      </div>
      <div class="cHlCoDpR">
        <span
          >｜ 违法和不良信息举报：400-140-2108 ｜ 青少年守护专线：400-9922-556
          ｜ 算法推荐专项举报：sfjubao@bytedance.com ｜
          网络内容从业人员违法违规行为举报：feedback@douyin.com</span
        >
      </div>
    </div>
    <div class="JXaUfgsM">
      <div class="cHlCoDpR">
        <a
          href="https://beian.miit.gov.cn/"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >京ICP备16016397号-3</a
        >
      </div>
      <div class="cHlCoDpR">
        <a
          href="https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/jiemuzhizuojingying.jpeg"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          ｜ 广播电视节目制作经营许可证</a
        >
      </div>
      <div class="cHlCoDpR">
        <a
          href="https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/zengzhixuke.jpeg"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          ｜ 京B2-20170846</a
        >
      </div>
      <div class="cHlCoDpR">
        <a
          href="https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/wangluowenhuajingying.jpeg"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          ｜ 网络文化许可证-京网文-（2022）0938-030号 ｜
        </a>
      </div>
      <div class="cHlCoDpR">
        <img
          class="OqamRr48"
          src="//p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/emblem.png"
          alt="icon"
        /><a
          href="http://www.beian.gov.cn/portal/registerSystemInfo"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer nofollow"
          >京公网安备 11000002002046号</a
        >
      </div>
    </div>
    <div class="link-list">
      <span class="SBRU08_v"></span>
      <span class="link-list__label">热门：</span>
      <span class="link-list__item" v-for="link in links" :key="link.anchor">
        <a
          :href="link.url"
          class="link-list__link"
          target="_blank"
          rel="noopener noreferrer"
          >{{ link.anchor }}
        </a>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-footer {
  background-color: var(--color-bg-b1);
  border-top: 1px solid var(--color-secondary-default);
  color: var(--color-text-t3);
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 53px 0 64px;
  text-align: center;
  width: 100%;

  .footer-link {
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    flex-wrap: wrap;
    margin-bottom: 17px;
    width: 100%;

    .footer-link-title {
      color: var(--color-text-t3);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      margin-right: 30px;
      position: relative;

      .footer-link-title-a {
        position: relative;
      }
    }
  }

  .JXaUfgsM {
    align-items: center;
    // color: #000;
    color: var(--color-text-t0);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    opacity: 0.5;
    position: relative;

    .cHlCoDpR {
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      position: relative;

      .OqamRr48 {
        height: 15px;
        margin-right: 5px;
        width: 15px;
      }

      span,
      .link-list__link {
        opacity: 0.4;
      }
    }
  }

  .link-list {
    margin-top: 20px;
    width: calc(100% - 80px);

    .SBRU08_v {
      border-top: 1px solid var(--color-text-t1);
      display: block;
      margin-bottom: 20px;
      opacity: 0.03;
      width: 100%;
    }

    .link-list__item {
      max-width: 190px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-right: 1px solid var(--color-text-t3);
      margin-right: 12px;
      padding-right: 12px;
    }
  }

  .link-list .link-list__label,
  .link-list .link-list__item {
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    height: 12px;
    line-height: 20px;
    line-height: 12px;
    opacity: 0.4;
    overflow: hidden;
    position: relative;
  }
}
</style>
