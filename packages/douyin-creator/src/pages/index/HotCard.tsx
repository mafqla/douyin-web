import React from 'react'
import { Typography } from '@douyinfe/semi-ui'
import { IconChevronRight } from '@douyinfe/semi-icons'
import styles from './style/HotCard.module.scss'
import cs from 'classnames'

const { Paragraph } = Typography

interface HotCardItem {
  billboard_id: string
  hot_value: string
  rank: number
  sec_id: string
  title: string
  img_url?: string
}

interface HotCardProps {
  billboard_type: number
  items: HotCardItem[]
}

const billboardType = [
  {
    billboard_type: 10,
    category_name: '直播',
    sort: 1,
  },
  {
    billboard_type: 5,
    category_name: '热歌榜',
    sort: 1,
  },

  {
    billboard_type: 1,
    category_name: '热点榜',
  },
  {
    billboard_type: 9,
    category_name: '上升榜',
  },
]

const HotCard: React.FC<HotCardProps> = ({ items, billboard_type }) => {
  const categoryObj = billboardType.find(
    (type) => type.billboard_type === billboard_type,
  )
  const category = categoryObj ? categoryObj.category_name : '其他分类'
  return (
    <a className={styles.hotlist}>
      <h3>
        {category}
        <small>
          更多
          <IconChevronRight />
        </small>
      </h3>
      {items.map((item) => (
        <li key={item.rank} id={item.sec_id}>
          <span className={cs(styles.rank, item.rank)}>{item.rank}.</span>
          {item.img_url && (
            <img src={item.img_url} style={{ borderRadius: '2px' }} />
          )}
          <Paragraph ellipsis={{ rows: 2 }}>{item.title}</Paragraph>
          <span>
            <img src="//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator/svgs/fire.0bb57697.svg" />
            {(parseFloat(item.hot_value) / 10000).toFixed(1)}w
          </span>
        </li>
      ))}
    </a>
  )
}

export default HotCard
