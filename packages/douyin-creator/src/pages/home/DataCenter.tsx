import Empty from '@/components/Empty'
import styles from './style/data-center.module.scss'
import { Select, TabPane, Tabs } from '@douyinfe/semi-ui'
import { AreaChart } from 'bizcharts'
import cs from 'classnames'
import { useEffect, useRef, useState } from 'react'

const LineAreaItem = ({ title, setActiveItem, isActive }) => {
  const [isAdd, setIsAdd] = useState(false)
  const [isReduce, setIsReduce] = useState(false)

  useEffect(() => {
    setIsAdd(true)
    setIsReduce(false)
  }, [])

  return (
    <div
      className={cs(styles['line-area-items'], isActive && styles.active)}
      onMouseEnter={() => setActiveItem(title)}
    >
      <div className={styles['line-area-items-title']}>{title}</div>
      <div className={styles['line-area-items-count']}>
        <div className={styles['line-area-count-numc']}>
          <span className={styles['line-area-count-num']}>0</span>
        </div>
        <div className={styles['line-area-count-text']}>
          较前1日
          <span
            className={cs(
              styles['line-area-count-text-a'],
              isAdd && styles.add,
              isReduce && styles.reduce
            )}
          >
            +1
          </span>
        </div>
      </div>
    </div>
  )
}
const DataCenter = () => {
  const data = [
    { time: '12-1', count: 0 },
    { time: '12-2', count: 0 },
    { time: '12-3', count: 0 },
    { time: '12-4', count: 0 },
    { time: '12-5', count: 0 },
    { time: '12-6', count: 0 },
    { time: '12-7', count: 1 }
  ]

  const [activeItem, setActiveItem] = useState(null)
  const [width, setWidth] = useState(0)
  const widthRef = useRef(null)

  useEffect(() => {
    setWidth(widthRef.current.offsetWidth)
  }, [])

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
        <div className={styles['data-show']} ref={widthRef}>
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
            <TabPane tab="数据总览" itemKey="overview">
              <div className={styles['line-area']}>
                <div className={styles['line-area-container']}>
                  <div className={styles['line-area-legend']}>作品评论</div>
                  <div className={styles['line-area-content']}>
                    <AreaChart
                      data={data}
                      height={112}
                      width={width}
                      yAxis={{ tickLine: null, label: null, grid: null }}
                      xAxis={{
                        tickLine: null,
                        range: [0, 1],

                        tickInterval: 1,
                        maxTickCount: 8,
                        label: {
                          offsetX: 5,
                          offsetY: 12,
                          style: {
                            textAlign: 'center'
                          }
                        }
                      }}
                      areaStyle={{
                        fill: 'rgba(192 229 255)'
                      }}
                      smooth
                      xField="time"
                      yField="count"
                    />
                  </div>
                  <div className={styles['line-area-footer']}>
                    <LineAreaItem
                      title="播放量"
                      setActiveItem={setActiveItem}
                      isActive={activeItem === '播放量'}
                    />
                    <LineAreaItem
                      title="主页访问量"
                      setActiveItem={setActiveItem}
                      isActive={activeItem === '主页访问量'}
                    />
                    <LineAreaItem
                      title="作品分享"
                      setActiveItem={setActiveItem}
                      isActive={activeItem === '作品分享'}
                    />
                    <LineAreaItem
                      title="作品评论"
                      setActiveItem={setActiveItem}
                      isActive={activeItem === '作品评论'}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
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
