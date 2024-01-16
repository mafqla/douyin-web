import PageContainer from '@/components/PageContainer'
import { Spin } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useRef, useState } from 'react'

const Editor = () => {
  const [loading, setLoading] = useState(true)
  const handleLoad = () => {
    if (iframeRef.current) {
      iframeRef.current.style.height = `${iframeRef.current.contentWindow.document.documentElement.scrollHeight}px`
      setLoading(false)
    }
  }
  const iframeRef = useRef(null)
  return (
    <PageContainer title="抖音云剪使用帮助">
      <Spin size="large" spinning={loading}>
        <div className={styles['help-article']}>
          <iframe
            src="https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/douyin_creator/5c822925-61af-4261-a1c2-aab5a6a66efb.html"
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

export default Editor
