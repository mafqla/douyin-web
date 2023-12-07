import {
  IconChevronRight,
  IconEyeClosed,
  IconEyeOpened
} from '@douyinfe/semi-icons'
import Creator from './Creator'
import Help from './Help'
import InteractionManagement from './InteractionManagement'
import UserInfo from './UserInfo'
import styles from './style/index.module.scss'
import DateContent from './DateContent'
import { useState } from 'react'
import NavigationMenu from './NavigationMenu'
import { Modal } from '@douyinfe/semi-ui'

const Home = () => {
  const [isShowPrice, setIsShowPrice] = useState(false)

  const toggleShowPrice = () => {
    setIsShowPrice(!isShowPrice)
  }
  const currentIcon = isShowPrice ? (
    <IconEyeOpened className={styles['eye-open']} />
  ) : (
    <IconEyeClosed className={styles['eye-close']} />
  )
  //是否显示快捷导航
  const menuItems = [
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/douyin.png',
      alt: '抖音官网',
      label: '抖音官网'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/xingtu.png',
      alt: '巨量星图',
      label: '巨量星图'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/qiyehao.png',
      alt: '企业号',
      label: '企业号'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/zhibo.png',
      alt: '直播开放平台',
      label: '直播开放平台'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/buyin.png',
      label: '巨量百应',
      alt: '巨量百应'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/juliangyinqiong.png',
      label: '巨量引擎',
      alt: '巨量引擎'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/jianying.png',
      label: '剪映',
      alt: '剪映'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/doudian.png',
      label: '抖店',
      alt: '抖店'
    },
    {
      src: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-yvahlyj-upfbvk/ljhwZthlaukjlkulzlp/pc/navigation/lingji.png',
      label: '抖音灵机',
      alt: '抖音灵机'
    }
  ]

  const visibleItems = menuItems.slice(0, 3)
  const [isShortcutNavigationVisible, setShortcutNavigationVisible] =
    useState(false)

  const handleShowShortcutNavigation = () => {
    setShortcutNavigationVisible(true)
  }
  const handleCancelShortcutNavigation = () => {
    setShortcutNavigationVisible(false)
  }
  return (
    <div className={styles.home}>
      <div className={styles.bg}></div>
      <div className={styles.container}>
        <UserInfo />
        <div className={styles.content}>
          <div className={styles['left-content']}>
            <div className={styles['content-item']}>
              <div className={styles.title}>新的创作</div>
              <Creator />
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>数据中心</div>
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>互动管理</div>
              <InteractionManagement />
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>
                <div className={styles.text}>
                  收入概况 <span onClick={toggleShowPrice}>{currentIcon}</span>
                </div>
                <div className={styles['show-more']}>
                  查看详情
                  <IconChevronRight />
                </div>
              </div>
              <DateContent isShow={isShowPrice} />
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>创作中心</div>
            </div>
          </div>

          <div className={styles['right-content']}>
            <div className={styles['content-item']}>
              <Help />
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>
                <div className={styles.text}>活动中心</div>
                <div className={styles['show-more']}>
                  查看更多
                  <IconChevronRight />
                </div>
              </div>
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>
                <div className={styles.text}>快捷导航</div>
                <div
                  className={styles['show-more']}
                  onClick={handleShowShortcutNavigation}
                >
                  查看更多
                  <IconChevronRight />
                </div>
              </div>
              <NavigationMenu menus={visibleItems} />
              <Modal
                title="快捷导航"
                visible={isShortcutNavigationVisible}
                onCancel={handleCancelShortcutNavigation}
                footer={null}
                centered
                width={600}
                height={300}
              >
                <NavigationMenu
                  menus={menuItems}
                  className="navigation-modal"
                />
              </Modal>
            </div>
            <div className={styles['content-item']}>
              <div className={styles.title}>
                <div className={styles.text}>重点关心</div>
                <div className={styles['show-more']}>
                  查看更多
                  <IconChevronRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
