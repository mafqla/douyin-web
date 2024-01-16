import PageContainer from '@/components/PageContainer'
import { useRef, useState } from 'react'
import { Spin } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'

const Convention = () => {
  const [loading, setLoading] = useState(true)
  const handleLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.style.height = `${iframeRef.current.contentWindow.document.documentElement.scrollHeight}px`
      setLoading(false)
    }
  }
  const iframeRef = useRef(null)
  return (
    <PageContainer title="抖音社区自律公约">
      <Spin size="large" spinning={loading}>
        <div className={styles['help-article']}>
          <iframe
            src="
            https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/douyin_creator/40db1b96-0eb0-4754-a052-16e8325af350.html"
            scrolling="no"
            frameBorder="0"
            width="100%"
            ref={iframeRef}
            onLoad={handleLoad}
          ></iframe>
        </div>
      </Spin>
    </PageContainer>
  )
}

export default Convention
