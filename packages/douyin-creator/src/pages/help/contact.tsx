import PageContainer from '@/components/PageContainer'
import { Spin } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useState } from 'react'

const Contact = () => {
  const [loading, setLoading] = useState(true)
  setTimeout(() => {
    setLoading(false)
  }, 100)
  return (
    <PageContainer title="联系我们">
      <Spin size="large" spinning={loading}>
        <div className={styles['help-article']}>
          <p>
            如在使用过程中遇到任何问题，可通过右下角的“悬浮入口”联系在线客服
          </p>
          <p>
            或有更多意见/建议，欢迎在抖音APP中点击【设置】-【反馈与帮助】，然后在【意见反馈】处提交您的建议与意见。
          </p>
        </div>
      </Spin>
    </PageContainer>
  )
}

export default Contact
