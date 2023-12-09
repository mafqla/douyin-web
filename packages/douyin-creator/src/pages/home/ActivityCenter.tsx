import React, { useState } from 'react'
import styles from './style/activity-center.module.scss'
import { Calendar } from '@douyinfe/semi-ui'
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons'
interface ActivityCenterProps {}
interface IActivity {
  iconClass: string
  title: string
  dateRange: string
}

const activities: IActivity[] = [
  {
    iconClass: 'UvCec',
    title: '宝藏餐厅藏不住',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'UvCec',
    title: '2023抖音直播年度嘉年华',
    dateRange: '11-23~01-02'
  },
  {
    iconClass: 'UvCec',
    title: '被冬季美食整心动了',
    dateRange: '12-08~12-16'
  },
  {
    iconClass: 'UvCec',
    title: '山野赏雪指南',
    dateRange: '12-06~01-29'
  },
  {
    iconClass: 'UvCec',
    title: '共赴五岳之巅',
    dateRange: '12-06~01-29'
  },
  {
    iconClass: 'UvCec',
    title: '冬日冰瀑指南',
    dateRange: '12-06~01-29'
  },
  {
    iconClass: 'RycJl',
    title: '秋冬美拉德美食地图',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '它唯一的缺点是本地限定',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '绝美赏秋餐厅地图',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '正式被确诊为碳水脑袋',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '干饭人的省钱美食信息差',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '就爱这一口暖呼呼美食',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '大学生吃啥我吃啥',
    dateRange: '10-30~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '假如你有冬日奇遇任意门',
    dateRange: '11-15~12-10'
  },
  {
    iconClass: 'RycJl',
    title: '抓住郑州初冬氛围感',
    dateRange: '12-01~12-31'
  },
  {
    iconClass: 'RycJl',
    title: '在郑州一切皆可两掺儿',
    dateRange: '12-01~12-31'
  },
  {
    iconClass: 'RycJl',
    title: '打开郑州隐藏款美食',
    dateRange: '12-04~12-31'
  },
  {
    iconClass: 'RycJl',
    title: '全城寻找最着急跨年的人',
    dateRange: '12-08~01-02'
  },
  {
    iconClass: 'OzRJd',
    title: '兰州到底有多少美食',
    dateRange: '11-03~12-01'
  },
  {
    iconClass: 'OzRJd',
    title: '它唯一的缺点是兰州限定',
    dateRange: '11-10~12-01'
  },
  {
    iconClass: 'OzRJd',
    title: '私藏在南京的地道美食',
    dateRange: '12-06~12-07'
  },
  {
    iconClass: 'OzRJd',
    title: '厦门街头的法式浪漫',
    dateRange: '12-07~12-08'
  }
]

const ActivityCenter: React.FC<ActivityCenterProps> = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleMonthChange = (increment) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + increment)
    setCurrentMonth(newMonth)
    setCurrentDate(newMonth)
  }

  return (
    <div className={styles['activity-center']}>
      <div className={styles['activity-center-head']}>
        <div>
          <span className={styles['activity-dot']}></span>
          活动中心
        </div>

        <div>
          <span className={styles['regular-activity-dot']}></span>
          常规活动
        </div>

        <div>
          <span className={styles['completed-dot']}></span>
          已结束
        </div>
      </div>
      <div className={styles['activity-center-content']}>
        <div className={styles['calendar-wrapper']}>
          <div className={styles['navigation-container']}>
            <IconChevronLeft
              className={styles['navigation-icon']}
              onClick={() => handleMonthChange(-1)}
            />
            <span
              className={styles['current-month']}
            >{`${currentMonth.getFullYear()}年${
              currentMonth.getMonth() + 1
            }月`}</span>
            <IconChevronRight
              className={styles['navigation-icon']}
              onClick={() => handleMonthChange(1)}
            />
          </div>
          <div
            className={styles['current-day']}
            onClick={() => {
              setCurrentDate(new Date()) // 设置为今天的日期
              setCurrentMonth(new Date()) // 设置为今天的日期
            }}
          >
            今天
          </div>
        </div>
        <Calendar
          height={320}
          mode="month"
          header={
            <div className={styles['week-date']}>
              <div>日</div>
              <div>一</div>
              <div>二</div>
              <div>三</div>
              <div>四</div>
              <div>五</div>
              <div>六</div>
            </div>
          }
          displayValue={currentDate}
          dateGridRender={(_dateString, date) => {
            const today = new Date()
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            return (
              <div className={styles['date-content']}>
                {isCurrentMonth && (
                  <div
                    className={`${styles['date-item']} ${
                      isToday ? styles['selected-day'] : ''
                    }`}
                  >
                    {date.getDate()}
                  </div>
                )}
              </div>
            )
          }}
        />
      </div>
      <div className={styles['activity-center-bottom']}>
        <div className={styles['activity-center-bottom-head']}>
          <div className={styles['activity-center-bottom-head-title']}>
            12月活动预览
          </div>
          <div className={styles['activity-center-bottom-head-sub-title']}>
            共18个进行中
          </div>
        </div>

        <div className={styles['activity-center-bottom-list']}>
          {activities.map((activity, index) => {
            return (
              <div
                className={styles['activity-center-bottom-item']}
                key={index}
              >
                <span className={styles['activity-dot']}></span>
                <div className={styles['activity-title']}>{activity.title}</div>
                <div className={styles['activity-date']}>
                  {activity.dateRange}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActivityCenter
