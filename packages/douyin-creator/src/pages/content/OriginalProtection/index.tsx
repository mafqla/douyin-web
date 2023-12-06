import { Button, Modal } from '@douyinfe/semi-ui'
import CardWrapper from './CardWrapper'
import InterestWrapper from './InterestWrapper'
import NoticeWrapper from './NoticeWrapper'
import TitleCard from './TitleCard'
import VideoContainer from './VideoContainer'
import styles from './style/index.module.scss'
import CardNotice from './CardNotice'
import { useState } from 'react'
import RulesWrapper from './RulesWrapper'

const OriginalProtection = () => {
  const [visible, setVisible] = useState(false)
  const onMoreClick = () => {
    setVisible(true)
  }
  const handleOk = () => {
    setVisible(false)
    console.log('Ok button clicked')
  }
  const handleCancel = () => {
    setVisible(false)
    console.log('Cancel button clicked')
  }
  return (
    <div className={styles.micro}>
      <div className={styles['homePage--original']}>
        <img
          src="//lf-cdn-tos.bytescm.com/obj/static/douyin-creator-content/micro/imgs/protect_center_BG.8c105dbf.png"
          className={styles['background--original']}
        />

        <div className={styles['wrapper--original']}>
          <div style={{ position: 'relative' }}>
            <div className={styles['title--original']}>
              <span>原创保护中心</span>
            </div>
            <CardWrapper />
            <TitleCard
              title="原创权益"
              subTitle="进行原创作者认证，获得以下权益"
            />
            <InterestWrapper />
            <TitleCard title="视频讲解" />
            <VideoContainer />
            <TitleCard title="原创消息" hasmore onMoreClick={onMoreClick} />
            <NoticeWrapper />
            <RulesWrapper />
          </div>
        </div>
      </div>

      <Modal
        title="原创保护信息"
        visible={visible}
        onOk={handleOk}
        closeOnEsc={true}
        onCancel={handleCancel}
        width={800}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" theme="solid" onClick={handleOk}>
              我知道了
            </Button>
          </div>
        }
      >
        <CardNotice />
      </Modal>
    </div>
  )
}

export default OriginalProtection
