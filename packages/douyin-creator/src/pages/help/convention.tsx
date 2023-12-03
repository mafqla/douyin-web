import PageContainer from '@/components/PageContainer'
import { useRef, useState } from 'react'
import convention from './html/convention.html'
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
            src={convention}
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
