import { Button, Dropdown, Icon, Nav } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useEffect, useMemo, useState } from 'react'
import {
  ContentIcon,
  CreationIcon,
  DataIcon,
  HelpIcon,
  HomeIcon,
  LiveIcon,
  MaterialIcon,
  RevenueIcon,
  ServiceIcon,
  StatsIcon
} from '../Icon'
import { useNavigate } from 'react-router-dom'

const Sider = () => {
  const items = useMemo(
    () => [
      {
        itemKey: 'home',
        text: '首页',
        icon: <Icon svg={<HomeIcon />} size="default" />,
        className: styles['bottom-line']
      },
      {
        itemKey: 'material',
        text: '云剪辑',
        icon: <Icon svg={<MaterialIcon />} size="default" />,
        className: styles['bottom-line']
      },
      {
        itemKey: 'content',
        text: '内容管理',
        className: styles['bottom-line'],
        icon: (
          <Icon
            svg={<ContentIcon />}
            size="default"
            className={styles['nav-icon']}
          />
        ),
        items: [
          {
            itemKey: 'content/manage',
            text: '作品管理'
          },
          {
            itemKey: 'content/collection/manage',
            text: '合集管理'
          },
          {
            itemKey: 'content/original_protection',
            text: '原创保护中心'
          }
        ]
      },
      {
        itemKey: 'data',
        text: '互动管理',
        className: styles['bottom-line'],
        style: {
          borderBottom: '1px solid rgba(201, 201, 204, 0.4)',
          paddingBottom: '12px',
          borderBottomRightRadius: '0px',
          borderBottomLeftRadius: '0px'
        },
        icon: (
          <Icon
            svg={<DataIcon />}
            size="default"
            className={styles['nav-icon']}
          />
        ),
        items: [
          {
            itemKey: 'data/following/following',
            text: '关注管理'
          },
          {
            itemKey: 'data/important/following',
            text: '重点关心'
          },
          {
            itemKey: 'data/following/follower',
            text: '粉丝管理'
          },
          {
            itemKey: 'data/following/comment',
            text: '评论管理'
          },
          {
            itemKey: 'data/following/chat',
            text: '私信管理'
          }
        ]
      },
      {
        itemKey: 'data/stats',
        text: '作品数据',
        className: styles['bottom-line'],
        icon: (
          <Icon
            svg={<StatsIcon />}
            size="default"
            className={styles['nav-icon']}
          />
        ),
        items: [
          {
            itemKey: 'data/stats/overview',
            text: '数据总览'
          },
          {
            itemKey: 'data/stats/video',
            text: '作品数据'
          },
          {
            itemKey: 'data/stats/follower/portrait',
            text: '粉丝画像'
          },
          {
            itemKey: 'data/stats/weekly',
            text: '创作周报'
          }
        ]
      },
      {
        itemKey: 'live',
        text: '直播数据',
        style: {
          borderBottom: '1px solid rgba(201, 201, 204, 0.4)',
          paddingBottom: '12px',
          borderBottomRightRadius: '0px',
          borderBottomLeftRadius: '0px'
        },
        icon: (
          <Icon
            svg={<LiveIcon />}
            size="default"
            className={styles['nav-icon']}
          />
        ),
        items: [
          {
            itemKey: 'live-data/data/overview',
            text: '数据总览'
          },
          {
            itemKey: 'data/live/video',
            text: '单场数据'
          }
        ]
      },
      {
        itemKey: 'revenue',
        icon: (
          <Icon
            svg={<RevenueIcon />}
            size="default"
            className={styles['nav-icon']}
          />
        ),
        text: '变现中心',
        style: {
          borderBottom: '1px solid rgba(201, 201, 204, 0.4)',
          paddingBottom: '12px',
          borderBottomRightRadius: '0px',
          borderBottomLeftRadius: '0px'
        },
        items: [
          {
            itemKey: 'revenue/overview',
            text: '我的收入'
          }
        ]
      },
      {
        itemKey: 'creation',
        icon: <Icon svg={<CreationIcon />} size="default" />,
        text: '创作中心'
      },
      {
        itemKey: 'market/home/recommend',
        icon: <Icon svg={<ServiceIcon />} size="default" />,
        text: '服务市场'
      },
      {
        itemKey: 'help',
        className: styles['bottom-line'],
        icon: <Icon svg={<HelpIcon />} className={styles['nav-icon']} />,
        text: '帮助中心',
        items: [
          {
            itemKey: 'creator/help/intro',
            text: '功能介绍'
          },
          {
            itemKey: 'creator/help/contact',
            text: '联系我们'
          },
          {
            itemKey: 'creator/help/convention',
            text: '抖音社区自律公约'
          },
          {
            itemKey: 'creator/help/editor',
            text: '抖音云剪使用帮助'
          }
        ]
      }
    ],
    []
  )
  const [openKeys, setOpenKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const router = useNavigate()

  const onSelect = (data) => {
    console.log('trigger onSelect: ', data)
    setSelectedKeys([...data.selectedKeys])

    router(data.itemKey)
  }
  const onOpenChange = (data) => {
    console.log('trigger onOpenChange: ', data)
    setOpenKeys([...data.openKeys])
  }
  const onCollapseChange = (isCollapsed) => {
    setIsCollapsed(isCollapsed)
  }

  //监听屏幕宽度变化，小于1080px时，收起侧边栏
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1080px)')

    const handleMediaQuery = (e) => {
      setIsCollapsed(e.matches)
    }

    mediaQuery.addEventListener('change', handleMediaQuery)
    handleMediaQuery(mediaQuery)

    // 清理监听器
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQuery)
    }
  }, [])

  return (
    <Nav
      className={styles['semi-nav']}
      header={{
        children: (
          <Dropdown
            className={styles['dropdown-wrapper']}
            render={
              <Dropdown.Menu>
                <Dropdown.Item className={styles['dropdown-item']}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.333 1.333a2 2 0 00-2 2v9.334a2 2 0 002 2h9.334a2 2 0 002-2V3.333a2 2 0 00-2-2H3.333zM6 5.246c0-.533.593-.85 1.036-.555l4.132 2.754a.667.667 0 010 1.11l-4.132 2.754A.667.667 0 016 10.754V5.246z"
                      fill="#232323"
                      fillOpacity="0.8"
                    ></path>
                  </svg>
                  发布视频
                </Dropdown.Item>
                <Dropdown.Item className={styles['dropdown-item']}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.333 1.333a2 2 0 00-2 2v9.334a2 2 0 002 2h9.334a2 2 0 002-2V3.333a2 2 0 00-2-2H3.333zM6.667 5a1.667 1.667 0 11-3.334 0 1.667 1.667 0 013.334 0zm4.471 2.805a.667.667 0 00-.943 0l-2.862 2.862-.862-.862a.667.667 0 00-.942 0L3.333 12v.667h9.334V9.333l-1.529-1.528z"
                      fill="#232323"
                      fillOpacity="0.8"
                    ></path>
                  </svg>
                  发布图文
                </Dropdown.Item>
                <Dropdown.Item className={styles['dropdown-item']}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M5.068 2c-.783 0-1.477.496-1.725 1.23l-.192.57h9.697l-.191-.57A1.817 1.817 0 0010.932 2H5.068z"
                      fill="currentColor"
                      fillOpacity="0.8"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.333 6.2c0-.994.814-1.8 1.818-1.8h9.697a1.81 1.81 0 011.819 1.8v6c0 .994-.814 1.8-1.819 1.8h-1.051c-.304 0-.604-.076-.87-.22L8.58 12.513a1.223 1.223 0 00-1.16 0L5.074 13.78c-.267.144-.567.22-.871.22H3.151a1.81 1.81 0 01-1.818-1.8v-6zm3.334 4.2c.836 0 1.515-.672 1.515-1.5s-.679-1.5-1.515-1.5c-.837 0-1.516.672-1.516 1.5s.679 1.5 1.516 1.5zm6.666 0c.837 0 1.515-.672 1.515-1.5s-.678-1.5-1.515-1.5c-.837 0-1.515.672-1.515 1.5s.678 1.5 1.515 1.5z"
                      fill="currentColor"
                      fillOpacity="0.8"
                    ></path>
                  </svg>
                  发布全景视频
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <Button
              theme="solid"
              size="large"
              block
              className={styles['header-button']}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="1.833"
                  y="3.5"
                  width="16.333"
                  height="13"
                  rx="2"
                  stroke="#fff"
                  strokeWidth="2"
                ></rect>
                <path
                  d="M10 7.5v5M12.5 10h-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
              </svg>
              <span className={styles['header-button-text']}>发布作品</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.down}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.72 5.065a1 1 0 011.415 0l3.77 3.772 3.772-3.772a1 1 0 111.414 1.415l-4.478 4.478a1 1 0 01-1.414 0L2.72 6.48a1 1 0 010-1.415z"
                  fill="#fff"
                ></path>
              </svg>
            </Button>
          </Dropdown>
        )
      }}
      defaultSelectedKeys={['home']}
      items={items}
      isCollapsed={isCollapsed}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
      onCollapseChange={onCollapseChange}
    />
  )
}

export default Sider
