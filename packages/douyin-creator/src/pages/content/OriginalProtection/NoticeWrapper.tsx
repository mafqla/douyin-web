import React, { useState } from 'react'
import './style/notice-wrapper.scss'
import { Button, Modal, SideSheet } from '@douyinfe/semi-ui'
import CardNotice from './CardNotice'

interface NoticeContentProps {
  text: string
  isNew?: boolean
  onModalClick?: () => void
}

const NoticeContent: React.FC<NoticeContentProps> = ({
  text,
  isNew = false,
  onModalClick
}) => {
  return (
    <div className="noticeContent" onClick={onModalClick}>
      <div className="dot"></div>
      <div className="text">{text}</div>
      {isNew && <div className="new--Fag">新</div>}
    </div>
  )
}

const NoticeWrapper: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const onClick = () => {
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
  const [visibleSlide, setVisibleSlide] = useState(false)
  const handleSlide = () => {
    setVisibleSlide(!visibleSlide)
  }
  const [visibleSlide2, setVisibleSlide2] = useState(false)
  const handleSlide2 = () => {
    setVisibleSlide2(!visibleSlide2)
  }

  return (
    <div className="noticeWrapper">
      <NoticeContent
        text="原创保护周报(2023-11-27~2023-12-03)"
        isNew={true}
        onModalClick={onClick}
      />
      <NoticeContent text="2023-11 月处罚公告" onModalClick={handleSlide} />
      <NoticeContent
        text="抖音关于治理“冒用他人营销”公告"
        onModalClick={handleSlide2}
      />

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

      <SideSheet
        title="2023-11 月处罚公告"
        visible={visibleSlide}
        onCancel={handleSlide}
      >
        <iframe
          src="https://api.amemv.com/magic/eco/runtime/release/648ffdbfc15ef3036937b46b?should_full_screen=1&hide_nav_bar=1&auto_play_bgm=1&container_bg_color=%23d2e9ff&loading_bg_color=%23d2e9ff&awe_falcon=sh&loading_duration=1000&_pia_=1&appType=douyin&magic_page_no=1"
          style={{ width: '100%', height: '100%' }}
        ></iframe>
      </SideSheet>

      <SideSheet
        title="抖音关于治理“冒用他人营销”公告"
        visible={visibleSlide2}
        onCancel={handleSlide2}
      >
        <iframe
          src="https://api.amemv.com/magic/eco/runtime/release/64ffe6162304fc0616c72be6?should_full_screen=1&hide_nav_bar=1&appType=douyin&magic_page_no=1"
          style={{ width: '100%', height: '100%' }}
        ></iframe>
      </SideSheet>
    </div>
  )
}

export default NoticeWrapper
