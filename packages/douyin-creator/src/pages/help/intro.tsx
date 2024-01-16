import PageContainer from '@/components/PageContainer'
import { Spin } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useRef, useState } from 'react'

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
            src="http://127.0.0.1:9000/file/82da948a4b6040bd80f808130fb969f2"
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
