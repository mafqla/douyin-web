import React, { useState } from 'react'
import TitleCard from './TitleCard'
import './style/rule-wrapper.scss'
import { SideSheet } from '@douyinfe/semi-ui'

const QAItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer
}) => (
  <div className="QAWrapper">
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.75 9.625a7.875 7.875 0 1114.69 3.947l.995 2.983a.75.75 0 01-.905.961l-3.31-.882A7.875 7.875 0 01.75 9.625zm11.625 1.125a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM7.5 9.625a1.125 1.125 0 102.25 0 1.125 1.125 0 00-2.25 0zM4.875 10.75a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
        fill="#FFC2C6"
      ></path>
    </svg>
    <div className="QAContent">
      <div className="question">{question}</div>
      <div className="answer">{answer}</div>
    </div>
  </div>
)

const RulesWrapper: React.FC = () => {
  const [visibleSlide, setVisibleSlide] = useState(false)
  const handleSlide = () => {
    setVisibleSlide(!visibleSlide)
  }
  const [visibleSlide2, setVisibleSlide2] = useState(false)
  const handleSlide2 = () => {
    setVisibleSlide2(!visibleSlide2)
  }
  return (
    <div className="rulesWrapper">
      <div className="oneSide">
        <TitleCard
          title="原创定义与判罚规则"
          hasmore
          onMoreClick={handleSlide}
        />

        <div className="sideWrapper">
          <QAItem
            question="问：什么属于原创内容？"
            answer="答：个人实拍类视频、图集作品，或体现自己想法和思考的二次剪辑创作类视频作品。"
          />
          <QAItem
            question="问：对「原创度低」的内容、账号会有什么样的处罚？"
            answer="答：抖音平台为鼓励原创内容，平台将对非原创内容减少推荐，直到新作品符合平台规范。"
          />
        </div>
      </div>
      <div className="line"></div>
      <div className="oneSide">
        <TitleCard title="维权举报攻略" hasmore onMoreClick={handleSlide2} />
        <div className="sideWrapper">
          <QAItem
            question="问：我发现抖音上有用户搬运/抄袭我的视频，该怎么举报？"
            answer="答：1）单个视频举报的操作路径：“被举报视频”—“分享”—“举报”—“侵犯权益”；2）多个视频或者用户资料举报操作路径：“被举报帐号个人主页”—右上“···”—“举报”—“用户举报”—“侵犯权益”。
"
          />
          <QAItem
            question="问：我进行侵权投诉后平台会怎么处理？"
            answer="答：平台会依照法律规定，根据构成侵权的初步证据和服务类型采取必要措施。采取的相关必要措施包括但不限于删除、重置、封禁等。"
          />
        </div>
      </div>
      <SideSheet
        title="原创定义与判罚规则"
        visible={visibleSlide}
        onCancel={handleSlide}
      >
        <iframe
          src="https://api.amemv.com/magic/eco/runtime/release/639ad5b5578557036eb4878e?title_color=161823&nav_bar_color=ffffff&status_bar_color=ffffff&appType=douyin&magic_page_no=1"
          style={{ width: '100%', height: '100%' }}
        ></iframe>
      </SideSheet>

      <SideSheet
        title="维权举报攻略"
        visible={visibleSlide2}
        onCancel={handleSlide2}
      >
        <iframe
          src="https://api.amemv.com/falcon/fe_app_react/original_protect_center/rights_protection_reporting/index.html?hide_nav_bar=1&showHeader=0&useLight=1"
          style={{ width: '100%', height: '100%' }}
        ></iframe>
      </SideSheet>
    </div>
  )
}

export default RulesWrapper
