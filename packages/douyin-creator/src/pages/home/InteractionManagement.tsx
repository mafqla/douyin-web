import React from 'react'
import './style/interaction-management.scss'
import { IconChevronRight, IconComment } from '@douyinfe/semi-icons'
const InteractionManagement: React.FC = () => {
  return (
    <div className="interaction-management">
      <div>
        <div className="section-content">
          <div className="section-header">
            <div className="icon-container">
              <IconComment />
            </div>
            <div className="header-text">作品评论</div>
          </div>
          <div className="no-comments-message empty">
            暂无新的评论，去看看历史评论吧
          </div>
          <div className="management">
            <div className="management-label">
              评论管理
              <IconChevronRight />
            </div>
          </div>
        </div>
      </div>
      <span className="separator"></span>
      <div>
        <div className="section-content">
          <div className="section-header">
            <div className="icon-container">
              <IconComment />
            </div>
            <div className="header-text">私信消息</div>
          </div>
          <div className="no-messages-message empty">
            暂无私信，去找人聊天吧
          </div>
          <div className="management">
            <div className="management-label">
              私信管理
              <IconChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractionManagement
