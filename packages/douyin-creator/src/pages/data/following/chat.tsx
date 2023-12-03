import {
  Avatar,
  Button,
  Checkbox,
  List,
  TabPane,
  Tabs,
  Tag
} from '@douyinfe/semi-ui'
import styles from './style/chat.module.scss'
import cs from 'classnames'
import { useState } from 'react'

const Chat = () => {
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckall] = useState(false)
  const onCheckAllChange = (e) => {
    console.log(e)
    setIndeterminate(false)
    setCheckall(e.target.checked)
  }

  const dataSource = [
    {
      avatar:
        'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813_osAec7cGnQAlEXEkAP8ANe9r1CbtlAAID1gUAC.jpeg?from=2956013662',
      name: '小明',
      content: '你好',
      time: '2021-07-21 12:00:00'
    },
    {
      avatar:
        'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813_osAec7cGnQAlEXEkAP8ANe9r1CbtlAAID1gUAC.jpeg?from=2956013662',
      name: '小明',
      content: '你好',
      time: '2021-07-21 12:00:00'
    },
    {
      avatar:
        'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813_osAec7cGnQAlEXEkAP8ANe9r1CbtlAAID1gUAC.jpeg?from=2956013662',
      name: '小明',
      content: '你好',
      time: '2021-07-21 12:00:00'
    },
    {
      avatar:
        'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813_osAec7cGnQAlEXEkAP8ANe9r1CbtlAAID1gUAC.jpeg?from=2956013662',
      name: '小明',
      content: '你好',
      time: '2021-07-21 12:00:00'
    },
    {
      avatar:
        'https://p26.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813_osAec7cGnQAlEXEkAP8ANe9r1CbtlAAID1gUAC.jpeg?from=2956013662',
      name: '小明',
      content: '你好',
      time: '2021-07-21 12:00:00'
    }
  ]
  return (
    <div className={cs(styles.container, styles['container--chat'])}>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <div className={styles['tabs-extra--chat']}>
            {checkAll && (
              <div className={styles['tab-header-btns--chat']}>
                <a type="secondary">已读</a>
                <a type="primary">删除</a>
              </div>
            )}
            全选
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
              style={{ marginLeft: '8px' }}
              aria-label="全选"
            />
          </div>
        }
      >
        <TabPane tab="全部" itemKey="1">
          <div className={styles['list--chat']}>
            <List
              dataSource={dataSource}
              renderItem={(item) => {
                return (
                  <List.Item
                    header={
                      <Avatar
                        style={{ marginRight: '8px' }}
                        size="medium"
                        src={item.avatar}
                      >
                        {item.name}
                      </Avatar>
                    }
                    main={
                      <div className={styles['item--chat']}>
                        <div className={styles['item-left--chat']}>
                          <div className={styles['item-header--chat']}>
                            <div className={styles['item-header-left--chat']}>
                              <span
                                className={styles['item-header-name--chat']}
                                style={{
                                  color: 'var(--semi-color-text-0)',
                                  fontWeight: 500,
                                  cursor: 'pointer'
                                }}
                              >
                                {item.name}
                              </span>
                              <Tag className={styles['top--chat']} type="ghost">
                                置顶
                              </Tag>
                            </div>
                            <span className={styles['item-header-time--chat']}>
                              {item.time}
                            </span>
                          </div>
                          <div className={styles['item-content--chat']}>
                            <div className={styles['text--chat']}>
                              {item.content}
                            </div>
                          </div>
                        </div>
                        <div className={styles['item-footer--chat']}>
                          <Button theme="borderless" type="tertiary">
                            置顶
                          </Button>
                          <Button theme="borderless" type="tertiary">
                            已读
                          </Button>
                          <Button theme="borderless" type="danger">
                            删除
                          </Button>
                          <Checkbox
                            aria-label="选择"
                            style={{ marginRight: '8px' }}
                          />
                        </div>
                      </div>
                    }
                  />
                )
              }}
            />
          </div>
        </TabPane>
        <TabPane tab="朋友私信" itemKey="2">
          <div className={styles['empty--chat']}>
            <span className={styles['empty--content']}>
              <img src="//p3.douyinpic.com/aweme-server-static-resource/null-pic.1633680636984.png~tplv-noop.image" />
              还没有收到私信
            </span>
          </div>
        </TabPane>
        <TabPane tab="陌生人私信" itemKey="3"></TabPane>
        <TabPane tab="群消息" itemKey="4"></TabPane>
      </Tabs>
    </div>
  )
}

export default Chat
