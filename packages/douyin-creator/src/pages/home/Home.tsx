import {
  IconChevronRight,
  IconEyeClosed,
  IconEyeOpened,
  IconHelpCircle,
  IconPlusCircle
} from '@douyinfe/semi-icons'
import cs from 'classnames'
import Creator from './Creator'
import Help from './Help'
import InteractionManagement from './InteractionManagement'
import UserInfo from './UserInfo'
import styles from './style/index.module.scss'
import DateContent from './DateContent'
import { useState } from 'react'
import NavigationMenu from './NavigationMenu'
import { Button, Modal, Tooltip } from '@douyinfe/semi-ui'
import ImportantUser from './ImportantUser'
import CreatorTab from './CreatorTab'
import DataCenter from './DataCenter'
import ActivityCenter from './ActivityCenter'

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

  const visibleItems = menuItems.slice(0, 4)
  const [isShortcutNavigationVisible, setShortcutNavigationVisible] =
    useState(false)

  const handleShowShortcutNavigation = () => {
    setShortcutNavigationVisible(true)
  }
  const handleCancelShortcutNavigation = () => {
    setShortcutNavigationVisible(false)
  }

  // 重点关心列表
  // const users = [
  //   {
  //     uid: '1',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '2',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '3',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '4',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '5',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '6',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '7',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '8',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '9',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   },
  //   {
  //     uid: '10',
  //     name: '章若楠',
  //     avatar:
  //       'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/f5d59bdfb9352cfdb5eabddf5ca03bad.jpeg?from=4010531038',
  //     followers: '1548.10万',
  //     works: '128',
  //     yesterdayFollowers: '+1.39万',
  //     yesterdayWorks: '0'
  //   }
  // ]
  const users = []
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
              <div className={styles.title}>
                <div className={styles.text}>
                  数据中心
                  <span className={styles['data-center-info']}>
                    <Tooltip
                      content="更新周期：每日10点更新截止到前一日的数据"
                      position="top"
                    >
                      <IconHelpCircle
                        size="small"
                        style={{
                          color: 'rgba(37, 38, 50, 0.35)',
                          marginRight: '4px'
                        }}
                      />
                    </Tooltip>
                    统计周期：2023.12.02-2023.12.08 （每天10点更新）
                  </span>
                </div>
                <div className={styles['show-more']}>
                  查看更多
                  <IconChevronRight />
                </div>
              </div>
              <DataCenter />
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
              <CreatorTab />
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
              <ActivityCenter />
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
            <div className={cs(styles['content-item'], styles['import-f'])}>
              <div className={styles.title}>
                <div className={styles.text}>重点关心</div>
                <div className={styles['show-more']}>
                  查看更多
                  <IconChevronRight />
                </div>
              </div>

              <ImportantUser users={users} />

              {users.length > 0 && users.length < 10 && (
                <div className={styles['add-follow']}>
                  <Button
                    type="tertiary"
                    block
                    icon={<IconPlusCircle />}
                    style={{
                      color: 'var(--semi-color-text-2)'
                    }}
                  >
                    添加关心(3/10)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
