import { Button, Empty, Select } from '@douyinfe/semi-ui'
import styles from './style/follower.module.scss'
import { IconChevronRight } from '@douyinfe/semi-icons'

const Follower = () => {
  const list = [
    {
      value: 'ulikecam',
      label: '视频消费贡献',
      otherKey: 0
    },
    { value: 'jianying', label: '互动分', otherKey: 1 }
  ]
  return (
    <div className={styles.container}>
      <div className={styles.title}>粉丝列表</div>
      <div className={styles['sub-title']}>
        <Select
          prefix={<span className={styles['select-prefix']}>排序</span>}
          placeholder={list[0].label}
          style={{ width: 170 }}
          optionList={list}
        />
        <span
          style={{
            marginLeft: '8px',
            fontSize: '14px',
            color: 'rgba(37, 38, 50, 0.6)'
          }}
        >
          仅展示视频消费贡献分值&gt;0的粉丝，视频消费贡献排序最多看到500个粉丝
        </span>
      </div>

      <div className={styles.empty}>
        <div className={styles['empty-icon']}></div>
        <div className={styles['empty-button']}>
          <Empty
            image={
              <img
                style={{ width: 100, height: 100 }}
                alt="暂无数据，快去发布新的作品获得更多粉丝的关注吧"
                src="//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator_data/imgs/noResult.233fc127.svg"
              />
            }
            description={'暂无数据，快去发布新的作品获得更多粉丝的关注吧'}
          />
          <Button
            type="primary"
            theme="solid"
            icon={<IconChevronRight />}
            iconPosition="right"
          >
            去发作品
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Follower
