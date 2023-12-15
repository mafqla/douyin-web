import { DatePicker, Radio, RadioGroup, Tooltip } from '@douyinfe/semi-ui'
import styles from './style/publish-setting.module.scss'
import { IconHelpCircle } from '@douyinfe/semi-icons'
import { useState } from 'react'

const PublishSetting: React.FC = () => {
  //设置是否允许下载
  const [download, setDownload] = useState('allowDownload')

  const onDownloadChange = (e) => {
    console.log('radio checked', e.target.value)
    setDownload(e.target.value)
  }

  //设置视频可见性
  const [awemeVisible, setAwemeVisible] = useState('public')

  const onAwemeVisibleChange = (e) => {
    console.log('radio checked', e.target.value)
    setAwemeVisible(e.target.value)
  }

  //设置发布时间
  const [schedule, setSchedule] = useState('immediately')

  const onScheduleChange = (e) => {
    console.log('radio checked', e.target.value)
    setSchedule(e.target.value)
  }

  //获取时间的值
  const [date, setDate] = useState(new Date())
  const onDateChange = (value) => {
    console.log(value)
    setDate(value)
  }

  return (
    <>
      <div className={styles['download-content']}>
        <RadioGroup onChange={onDownloadChange} value={download}>
          <Radio
            className={styles['radio']}
            value={'allowDownload'}
            style={{
              backgroundColor:
                download === 'allowDownload'
                  ? 'rgb(253, 245, 247)'
                  : 'rgb(248, 249, 249)'
            }}
          >
            <span style={{ color: 'rgb(254, 44, 85)' }}>允许 </span>
          </Radio>
          <Radio
            className={styles['radio']}
            value={'disallowDownload'}
            style={{
              backgroundColor:
                download === 'disallowDownload'
                  ? 'rgb(253, 245, 247)'
                  : 'rgb(248, 249, 249)'
            }}
          >
            <span>不允许 </span>
          </Radio>
        </RadioGroup>
      </div>
      <div className={styles['publish-settings']}>
        <p className={styles['publish-settings-title']}> 发布设置</p>
        <p className={styles['mytitle']}> 设置谁可以看</p>
        <RadioGroup onChange={onAwemeVisibleChange} value={awemeVisible}>
          <Radio
            value={'public'}
            className={styles['radio']}
            style={{
              backgroundColor:
                awemeVisible === 'public'
                  ? 'rgb(253, 245, 247)'
                  : 'rgb(248, 249, 249)'
            }}
          >
            <span style={{ color: 'rgb(254, 44, 85)' }}>公开 </span>
          </Radio>
          <Radio
            value={'friend'}
            className={styles['radio']}
            style={{
              backgroundColor:
                awemeVisible === 'friend'
                  ? 'rgb(253, 245, 247)'
                  : 'rgb(248, 249, 249)'
            }}
          >
            <span>好友可见 </span>
          </Radio>
          <Radio
            className={styles['radio']}
            value={'private'}
            style={{
              backgroundColor:
                awemeVisible === 'private'
                  ? 'rgb(253, 245, 247)'
                  : 'rgb(248, 249, 249)'
            }}
          >
            <span>仅自己可见</span>
          </Radio>
        </RadioGroup>

        <div className={styles['schedule-part']}>
          <div className={styles['title-schedule']}>
            <p className={styles['title-main-schedule']}>发布时间</p>
          </div>
          <div className={styles['row--schedule']}>
            <RadioGroup onChange={onScheduleChange} value={schedule}>
              <Radio
                className={styles['radio']}
                value={'immediately'}
                style={{
                  backgroundColor:
                    schedule === 'immediately'
                      ? 'rgb(253, 245, 247)'
                      : 'rgb(248, 249, 249)'
                }}
              >
                <span style={{ color: 'rgb(254, 44, 85)' }}>立即发布 </span>
              </Radio>

              <div className={styles['container-schedule']}>
                <Radio
                  className={styles['radio']}
                  value={'scheduledPublishTime'}
                  style={{
                    backgroundColor:
                      schedule === 'scheduledPublishTime'
                        ? 'rgb(253, 245, 247)'
                        : 'rgb(248, 249, 249)'
                  }}
                >
                  <span>定时发布 </span>
                </Radio>
                <div className={styles['highlight--2']}>
                  <Tooltip
                    position="bottom"
                    content="可选时间支持设置到2小时后及14天内"
                    style={{ maxWidth: '450px' }}
                  >
                    <IconHelpCircle
                      style={{ color: 'rgba(37, 38, 50, 0.35)' }}
                    />
                  </Tooltip>
                </div>
              </div>
            </RadioGroup>

            {schedule === 'scheduledPublishTime' && (
              <DatePicker
                type="dateTime"
                style={{ width: '175px' }}
                defaultValue={date}
                onChange={onDateChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default PublishSetting
