import { Carousel, Layout, Modal, Nav } from '@douyinfe/semi-ui'

import styles from './style/index.module.scss'
import HotCard from './HotCard'
import ShowCase from './ShowCase'
import FooterCompoent from './footer'
import LoginModal from './LoginModal'
import { useState } from 'react'

const { Header, Footer, Content } = Layout
const style = {
  width: '100%',
  height: '490px',
}

const imgList = [
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/home_page_pic/first-banner.png',
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/home_page_pic/second-banner.png',
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/home_page_pic/third-banner.png',
]

const hotdata = [
  {
    billboard_type: 1,
    element_list: [
      {
        billboard_id: '王楚钦已经痛失本名',
        hot_value: '11574776.00',
        rank: 1,
        sec_id: '王楚钦已经痛失本名',
        title: '王楚钦已经痛失本名',
      },
      {
        billboard_id: '中国篮球最不缺的就是道歉',
        hot_value: '10939436.00',
        rank: 2,
        sec_id: '中国篮球最不缺的就是道歉',
        title: '中国篮球最不缺的就是道歉',
      },
      {
        billboard_id: '遥感三十九号卫星发射成功',
        hot_value: '10926582.00',
        rank: 3,
        sec_id: '遥感三十九号卫星发射成功',
        title: '遥感三十九号卫星发射成功',
      },
      {
        billboard_id: '当古装男主走进现实',
        hot_value: '9247337.00',
        rank: 4,
        sec_id: '当古装男主走进现实',
        title: '当古装男主走进现实',
      },
      {
        billboard_id: '日企利用人造子宫培育出鲨鱼',
        hot_value: '9182757.00',
        rank: 5,
        sec_id: '日企利用人造子宫培育出鲨鱼',
        title: '日企利用人造子宫培育出鲨鱼',
      },
    ],
  },
  {
    billboard_type: 10,
    element_list: [
      {
        author: '梅视网',
        billboard_id: '7285247084192844559',
        hot_value: '29928357055.00',
        img_url:
          'http://p9-webcast-sign.douyinpic.com/webcast-cover/7207832910978616125~tplv-qz53dukwul-image.image?x-expires=1699094531&x-signature=PukRJWt%2FXBF2b9DQ%2BnKE440Vp6A%3D',
        link: 'snssdk1128://live?room_id=7285247084192844559',
        rank: 1,
        sec_id:
          '@jupv7r5IREr+scRf7rLptsx6pyuZXRLMFJYWBJ9Ss5JClyYFmoJzb9+KDCkSu6kU',
        title: '2023',
      },
      {
        author: '图图猫',
        billboard_id: '7285512353691568951',
        hot_value: '24005392593.00',
        img_url:
          'http://p6-webcast-sign.douyinpic.com/webcast-cover/7231569560258906935~tplv-qz53dukwul-image.image?x-expires=1699094531&x-signature=rDfjjFNV3NwC1dc8G39SkFbBipQ%3D',
        link: 'snssdk1128://live?room_id=7285512353691568951',
        rank: 2,
        sec_id:
          '@jupv7r5IQ0/7sslY6bLqu852qyuRXRLMFJYWBJ9Ss5Kl8kmonOp8ZiFtdN6sasvl',
        title: '可爱小猫猫',
      },
      {
        author: 'ZS.171',
        billboard_id: '7286403912955972388',
        hot_value: '16147848554.00',
        img_url:
          'http://p9-webcast-sign.douyinpic.com/webcast-cover/7204322195793775420~tplv-qz53dukwul-image.image?x-expires=1699094531&x-signature=%2FGbOy2DqW7w6lV%2BZ2vJe9G8J6kE%3D',
        link: 'snssdk1128://live?room_id=7286403912955972388',
        rank: 3,
        sec_id:
          '@jupv7r5LQk76uM1Z5r7ut898oSaYXRLMFJYWBJ9Ss5I8bJMgRzhKPpR5j7EE4w0z',
        title: '内有凶兽，如若被咬概不负责。',
      },
      {
        author: '晴晴小公主',
        billboard_id: '7285515248486845224',
        hot_value: '4641789197.00',
        img_url:
          'http://p6-webcast-sign.douyinpic.com/webcast-cover/7234364059804601148~tplv-qz53dukwul-image.image?x-expires=1699094531&x-signature=ef4rik3Pqx52MlpawKKoOFqh8hA%3D',
        link: 'snssdk1128://live?room_id=7285515248486845224',
        rank: 4,
        sec_id:
          '@jupv7r5IQ0/8s8hT67Pttsx7oCyUXRLMFJYWBJ9Ss5LlDaRZ66u9qhpgpiDpDk0O',
        title: '小小猫咪',
      },
      {
        author: '柱子VC的姥姥',
        billboard_id: '7285251155926485812',
        hot_value: '3032414449.00',
        img_url:
          'http://p9-webcast-sign.douyinpic.com/webcast-cover/7278098714413779768~tplv-qz53dukwul-image.image?x-expires=1699094531&x-signature=ehFeFEp9cMCwa0k28tJhgbnM7z4%3D',
        link: 'snssdk1128://live?room_id=7285251155926485812',
        rank: 5,
        sec_id:
          '@jupv7r5IREv4sMle5rntusB7qi+SXRLMFJYWBJ9Ss5K5XMKLhBJ/dbjBQqJTuIEw',
        title: '新白娘子传奇，正在直播',
      },
    ],
  },
  {
    billboard_type: 9,
    element_list: [
      {
        billboard_id: '揭阳一店铺发生火灾',
        hot_value: '8543218.00',
        rank: 1,
        sec_id: '揭阳一店铺发生火灾',
        title: '揭阳一店铺发生火灾',
      },
      {
        billboard_id: '南阳迷笛被盗失主称营地没监控',
        hot_value: '8494348.00',
        rank: 2,
        sec_id: '南阳迷笛被盗失主称营地没监控',
        title: '南阳迷笛被盗失主称营地没监控',
      },
      {
        billboard_id: '媒体：迷笛音乐节盗窃案7人被抓',
        hot_value: '8327490.00',
        rank: 3,
        sec_id: '媒体：迷笛音乐节盗窃案7人被抓',
        title: '媒体：迷笛音乐节盗窃案7人被抓',
      },
      {
        billboard_id: '雅思组合晋级半决赛',
        hot_value: '7934520.00',
        rank: 4,
        sec_id: '雅思组合晋级半决赛',
        title: '雅思组合晋级半决赛',
      },
      {
        billboard_id: '杭州亚运会显眼包大盘点',
        hot_value: '7927500.00',
        rank: 5,
        sec_id: '杭州亚运会显眼包大盘点',
        title: '杭州亚运会显眼包大盘点',
      },
    ],
  },
  {
    billboard_type: 5,
    element_list: [
      {
        author: '余佳运',
        billboard_id: '6876280390860933134',
        hot_value: '958092.00',
        img_url:
          'https://p26.douyinpic.com/aweme/200x200/tos-cn-v-2774c002/af35d190e4144544a21fcaf5628f68d7.jpeg',
        link: 'https://www.iesdouyin.com/share/music/6876280390860933134',
        rank: 1,
        sec_id:
          '@jupu5LFLREb5ssVb573rt8t9oy2UXRLMFJYWBJ9Ss5I8yViQUCYxrkJ7MKQi4OS9',
        title: '九月底',
      },
      {
        author: 'G-Dragon',
        billboard_id: '6929556987924219905',
        hot_value: '430107.00',
        img_url:
          'https://p6.douyinpic.com/aweme/200x200/tos-cn-v-2774c002/224f9882a16f40afac6123d6133b4aec.jpeg',
        link: 'https://www.iesdouyin.com/share/music/6929556987924219905',
        rank: 2,
        sec_id:
          '@jupu5bREQ0v/uMRc5rnvvMl3qy6VXRLMFJYWBJ9Ss5JOn+R14J8yPAuWrlV2VYJV',
        title: 'Black (Feat. 제니 of BLACKPINK)',
      },
      {
        author: 'GooGoo/王之睿',
        billboard_id: '7272282216930035714',
        hot_value: '470467.00',
        img_url:
          'https://p6.douyinpic.com/aweme/200x200/tos-cn-v-2774c002/ocE3GZBk47sVY8h0eaDnjgAtQhBbCxWALEAeDF.jpeg',
        link: 'https://www.iesdouyin.com/share/music/7272282216930035714',
        rank: 3,
        sec_id:
          '@jupv7rFPREb7s81d5rjrvst7pS+UXRLMFJYWBJ9Ss5KBj1uwzUufA19y+VPRRb/N',
        title: '我的纸飞机（片段2）',
      },
      {
        author: '皮卡丘多多',
        billboard_id: '7210316799659902977',
        hot_value: '4559814.00',
        img_url:
          'https://p6.douyinpic.com/aweme/200x200/tos-cn-v-2774c002/349a49646bfc4f268e657993c629790d.jpeg',
        link: 'https://www.iesdouyin.com/share/music/7210316799659902977',
        rank: 4,
        sec_id:
          '@jupv7rdNRU//tsVS6b7it8h8qymXXRLMFJYWBJ9Ss5I+9z6xf3AKOGPF215Wmy4P',
        title: '落日亲吻银光海(剪辑版)',
      },
      {
        author: '赵雷',
        billboard_id: '6702439833182145293',
        hot_value: '201914.00',
        img_url:
          'https://p11.douyinpic.com/aweme/200x200/tos-cn-v-2774c002/5308db48caa340669af1d73529f92da9.jpeg',
        link: 'https://www.iesdouyin.com/share/music/6702439833182145293',
        rank: 5,
        sec_id:
          '@jupu67ZPQk3wuc9Y7rPpv8x7oCeTXRLMFJYWBJ9Ss5J3AiQj2/1LCq1IoFTOQh6g',
        title: '朵',
      },
    ],
  },
]

const Index = () => {
  const [visible, setVisible] = useState(false)
  const showDialog = () => {
    setVisible(true)
  }
  return (
    <div className={styles['creator-container']}>
      <Layout>
        <Header className={styles['creator-header']}>
          <div className={styles['creator-header-wrapper']}>
            <div className={styles['creator-header-nav']}>
              <Nav
                mode={'horizontal'}
                header={{
                  logo: (
                    <a href="/">
                      <img src="//p3.douyinpic.com/aweme-server-static-resource/ies_douyin_opencn_tiktok_creator_header_logo.png~tplv-obj.image" />
                    </a>
                  ),
                }}
                footer={
                  <span className={styles.login} onClick={showDialog}>
                    登录
                  </span>
                }
              />
            </div>
          </div>

          <Modal
            visible={visible}
            closeOnEsc={true}
            onCancel={() => setVisible(false)}
            closable={false}
            footer={null}
            centered
            className={styles['account-modal']}
          >
            <LoginModal />
          </Modal>
        </Header>
        <Layout>
          <Content>
            <div className={styles.home}>
              <Carousel
                style={style}
                speed={1000}
                animation="fade"
                theme="light"
                autoPlay={true}
                showArrow={false}
              >
                {imgList.map((src, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        margin: '0 auto',
                        padding: '0 50px 0 122px',
                      }}
                    >
                      {index === 2 && (
                        <>
                          <h2
                            style={{
                              width: '50%',
                              fontSize: '48px',
                              fontWeight: 400,
                              margin: '130px 0 23px',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          >
                            抖音创作服务平台
                          </h2>
                          <p
                            style={{
                              width: '50%',
                              fontSize: '18px',
                              lineHeight: '32px',
                              color: 'rgba(22,24,35,0.7)',
                              textAlign: 'justify',
                              position: 'relative',
                              zIndex: 1,
                            }}
                          >
                            抖音创作服务平台是抖音创作者的一站式服务平台，致力于助力创作者高效运营！
                          </p>
                        </>
                      )}
                      <img
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          height: '100%',
                          transform: 'translate(-50%, 0)',
                        }}
                        src={src}
                      />
                      {index === 2 && (
                        <span
                          style={{
                            display: 'inline-flex',
                            height: '32px',
                            color: 'rgba(22,24,35,0.7)',
                            fontSize: '14px',
                            justifyContent: 'center',
                            WebkitBoxAlign: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            marginRight: '36px',
                          }}
                        >
                          <img
                            style={{
                              width: '24px',
                              fontSize: '24px',
                              marginRight: '12px',
                            }}
                            src="//p3.douyinpic.com/aweme-server-static-resource/ies_douyin_opencn_icon_douyin_icon.svg~tplv-obj.image"
                          />
                          抖音
                        </span>
                      )}
                    </div>
                  )
                })}
              </Carousel>

              <div className={styles['boards-more']}>
                <h3>抖音排行榜</h3>
                <div className={styles['boards-more-btn']}>
                  查看全部榜单
                  <img src="//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator/svgs/arrow.3ac16458.svg" />
                </div>
              </div>

              <div className={styles['boards']}>
                {hotdata.map((item) => {
                  return (
                    <HotCard
                      key={item.billboard_type}
                      items={item.element_list}
                      billboard_type={item.billboard_type}
                    />
                  )
                })}
              </div>

              <ShowCase />
            </div>
          </Content>
        </Layout>
        <Footer className={styles['creator-footer']}>
          <FooterCompoent />
        </Footer>
      </Layout>
    </div>
  )
}

export default Index
