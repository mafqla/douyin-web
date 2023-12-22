import PageContainer from '@/components/PageContainer'
import { Spin } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useRef, useState } from 'react'
import * as _editor from '@/assets/test/editor.html'

const editor = _editor.default

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
            src={editor}
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
