import PageContainer from '@/components/PageContainer'
import { Spin } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useRef, useState } from 'react'
import intro from './html/intro.html'

const Intro = () => {
  const [loading, setLoading] = useState(true)
  const handleLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.style.height = `${iframeRef.current.contentWindow.document.documentElement.scrollHeight}px`
      setLoading(false)
    }
  }
  const iframeRef = useRef(null)

  return (
    <PageContainer title="功能介绍">
      <Spin size="large" spinning={loading}>
        <div className={styles['help-article']}>
          <iframe
            src={intro}
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

export default Intro
