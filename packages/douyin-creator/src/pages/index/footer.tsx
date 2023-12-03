import React from 'react'

import styles from './style/Footer.module.scss'

const Footer: React.FC = () => {
  return (
    <>
      <div className={styles['footer_nav']}>
        <a href="//creator.douyin.com/agreement/">账号授权协议</a>
        <a href="//www.douyin.com/agreement/">用户服务协议</a>
        <a href="//www.douyin.com/privacy/">隐私政策</a>
        <a href="//www.douyin.com/recovery_account/">账号找回</a>
        <a href="//www.douyin.com/aboutus/">联系我们</a>
      </div>
      <div className={styles['footer_info']}>
        <div>
          <span>2023 © 抖音</span>
          <span>京ICP备16016397号-3</span>
          <span>北京微播视界科技有限公司</span>
          <br />
        </div>
        <div>
          <a href="http://www.12377.cn/">中国互联网举报中心</a>
          <span>网络文化许可证-京网文-（2016）2282-264号</span>
          <span>违法和不良信息举报：400-140-2108</span>
          <span>举报邮箱：feedback@douyin.com</span>
          <br />
        </div>
        <div>
          <img
            src="//p3.douyinpic.com/aweme-server-static-resource/gongan_d0289dc.png~tplv-obj.image"
            alt="pic"
          />
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000002002046">
            京公网安备11000002002046号
          </a>
          <span>地址: 北京市海淀区知春路51号4层408</span>
          <br />
        </div>
      </div>
    </>
  )
}

export default Footer
