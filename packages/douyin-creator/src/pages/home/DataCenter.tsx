import Empty from '@/components/Empty'
import styles from './style/data-center.module.scss'
import { Select, TabPane, Tabs } from '@douyinfe/semi-ui'
const DataCenter = () => {
  return (
    <div className={styles['data-center']}>
      <div className={styles['data-center-content']}>
        <div className={styles['new-post']}>
          <div className={styles['new-psot-content']}>
            <div className={styles['new-post-title']}>最新作品</div>
            <div className={styles['new-post-detail']}>
              <Empty text="近30天未发布新作品，快去发布作品吧" />
            </div>
          </div>
        </div>
        <div className={styles['line']}></div>
        <div className={styles['data-show']}>
          <Tabs
            className={styles['data-tabs']}
            tabBarExtraContent={
              <Select size="small" defaultValue={'lastSevenDays'} prefix="时间">
                <Select.Option value="yesterday">昨日</Select.Option>
                <Select.Option value="lastSevenDays">近7日</Select.Option>
                <Select.Option value="lastThirtyDays">近30日</Select.Option>
              </Select>
            }
          >
            <TabPane tab="数据总览" itemKey="overview"></TabPane>
            <TabPane tab="近期作品" itemKey="recentWorks">
              <div className={styles['data-recent']}>
                <div className={styles['data-recent-empty']}>
                  <Empty text="近30天未发布新作品，暂无近期作品数据" />
                </div>
              </div>
            </TabPane>
            <TabPane tab="直播数据" itemKey="liveData">
              <Empty
                className={styles['data-live-empty']}
                text="近7日没有开播，暂无数据，去开直播吧"
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
export default DataCenter
