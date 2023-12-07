import React from 'react'
import './style/user-info.scss'
import { Button } from '@douyinfe/semi-ui'

const UserInfo: React.FC = () => {
  return (
    <div className="user-info-container">
      <div className="avatar-container">
        <img
          className="user-avatar"
          src="https://p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?from=2956013662"
          alt="User Avatar"
        />
      </div>
      <div className="user-details">
        <div className="user-details-content">
          <div className="name-status-name">
            <div className="user-name">󠀀ㅤ󠀀ㅤ󠀀</div>
            <div className="status-divider"></div>
          </div>
          <div className="authorization-button-container">
            <Button theme="borderless" className="authorization-button">
              <span className="button-content">发起授权</span>
            </Button>
          </div>
          <div className="user-id">抖音号：288341131</div>
          <div className="user-bio">这个人很懒，没有留下任何签名</div>
        </div>
        <div className="user-stats">
          <div className="stat-item ac" id="guide_home_following">
            关注 <span className="stat-count">48</span>
          </div>
          <div className="stat-item ac" id="guide_home_fans">
            粉丝 <span className="stat-count">3</span>
          </div>
          <div className="stat-item">
            获赞 <span className="stat-count">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
