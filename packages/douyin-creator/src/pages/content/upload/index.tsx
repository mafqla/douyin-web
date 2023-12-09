import { TabPane, Tabs } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
interface UploadContainerProps {
  onDrop: (files: FileList) => void
  infoText: string
  title: string
}
interface VideoInfoContainerProps {
  formatTitle: string
  formatInfo: string
  sizeTitle: string
  sizeInfo: string
  resolutionTitle: string
  resolutionInfo: string
}
const Upload = () => {
  const FromHint = ({ title }) => {
    return (
      <div className={styles['form-hint']}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.227 2.399l-8.7 16.676C.83 20.406 1.796 22 3.298 22h17.402c1.502 0 2.468-1.594 1.773-2.925l-8.7-16.676c-.749-1.434-2.8-1.434-3.547 0zm2.915 11.611a1.153 1.153 0 01-2.283 0l-.576-4.03a1.735 1.735 0 113.434 0l-.575 4.03zm.358 4.49a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              fill="#FC8800"
            ></path>
          </svg>
          <span className={styles['hint-text']}>
            你还有上次未发布的{title}，是否继续编辑？
          </span>
        </div>
        <div>
          <span className={styles['continue']}>继续编辑</span>
          <span className={styles['give-up']} style={{ marginLeft: '24px' }}>
            放弃
          </span>
        </div>
      </div>
    )
  }

  const UploadContainer: React.FC<UploadContainerProps> = ({
    onDrop,
    infoText,
    title
  }) => {
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      onDrop(files)
    }

    return (
      <div
        className={styles['upload-container']}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles['upload-wrapper']}>
          <label className={styles['upload-button']}>
            <input
              className={styles['upload-input']}
              type="file"
              name="upload-btn"
              accept="video/mp4,video/x-m4v,video/*"
            />
            <div className={styles['upload-box']}>
              <svg width="30" height="23" viewBox="0 0 30 23" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.786 6.744a8.667 8.667 0 10-16.884 3.938 6 6 0 00.432 11.985h15.333a8 8 0 001.12-15.923zm-7.359.278a.667.667 0 00-.854 0l-6.865 5.722c-.24.2-.099.59.213.59h4.413v6c0 .367.298.666.666.666h4a.667.667 0 00.667-.667v-6h4.413c.311 0 .453-.39.213-.59l-6.866-5.72z"
                  fill="#9B9EA0"
                ></path>
              </svg>
              <div className={styles['upload-description']}>
                <span className={styles['upload-btn-text']}>点击上传</span>
                或直接将{title}文件拖入此区域
              </div>
              <div className={styles['upload-info-description']}>
                {infoText}
              </div>
            </div>
          </label>
        </div>
      </div>
    )
  }

  const InfoContainer: React.FC<VideoInfoContainerProps> = ({
    formatTitle,
    formatInfo,
    sizeTitle,
    sizeInfo,
    resolutionTitle,
    resolutionInfo
  }) => {
    return (
      <div className={styles['info-container']}>
        <div className={styles['info-item']}>
          <p className={styles['info-title']}>{formatTitle}</p>
          <p className={styles['info-description']}>{formatInfo}</p>
        </div>
        <div className={styles['info-item']}>
          <p className={styles['info-title']}>{sizeTitle}</p>
          <p className={styles['info-description']}>{sizeInfo}</p>
        </div>
        <div className={styles['info-item']}>
          <p className={styles['info-title']}>{resolutionTitle}</p>
          <p className={styles['info-description']}>{resolutionInfo}</p>
        </div>
      </div>
    )
  }

  const [activeKey, setActiveKey] = useState('video')
  const location = useLocation()
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const defaultTab = params.get('default-tab')

    console.log(
      '🚀 ~ file: index.tsx ~ line 196 ~ useEffect ~ defaultTab',
      defaultTab
    )

    switch (defaultTab) {
      case '3':
        setActiveKey('text')
        break
      case '4':
        setActiveKey('panorama')
        break
      default:
        setActiveKey('video')
        break
    }
  }, [location])
  const handleTabClick = (key: string) => {
    setActiveKey(key)
  }
  const handleDrop = (files: FileList) => {
    console.log(files)
  }
  return (
    <div className={styles['micro--upload']}>
      <div className={styles['card--upload']}>
        <Tabs
          className={styles.tabs}
          activeKey={activeKey}
          onTabClick={handleTabClick}
        >
          <TabPane tab="发布视频" itemKey="video">
            <FromHint title="视频" />
            <UploadContainer
              onDrop={handleDrop}
              title="视频"
              infoText="为了更好的观看体验和平台安全，平台将对上传的视频预审。超过40秒的视频建议上传横版视频"
            />
            <InfoContainer
              formatTitle="视频格式"
              formatInfo="支持常用格式，推荐使用mp4、webm"
              sizeTitle="视频大小"
              sizeInfo="视频文件大小不超过16G，时长在60分钟以内"
              resolutionTitle="视频分辨率"
              resolutionInfo="分辨率为720p（1280x720）及以上"
            />
          </TabPane>
          <TabPane tab="发布图文" itemKey="text">
            <FromHint title="图文" />
            <UploadContainer
              onDrop={handleDrop}
              title="图文"
              infoText="最多支持上传35张图片，图片格式不支持gif格式"
            />
            <InfoContainer
              formatTitle="图片格式"
              formatInfo=" 支持常用图片格式，暂不支持gif格式"
              sizeTitle="图片大小"
              sizeInfo="图片大小不超过50MB"
              resolutionTitle="图片比例"
              resolutionInfo="   图文的宽高比建议不超过1:2"
            />
          </TabPane>
          <TabPane tab="发布全景视频" itemKey="panorama">
            <FromHint title="视频" />
            <UploadContainer
              onDrop={handleDrop}
              title="视频"
              infoText="为了更好的观看体验和平台安全，平台将对上传的视频预审。"
            />
            <InfoContainer
              formatTitle="视频格式"
              formatInfo="  支持常用格式，推荐使用mp4、webm"
              sizeTitle="视频大小"
              sizeInfo="视频文件大小不超过16G，时长在60分钟以内"
              resolutionTitle="视频分辨率"
              resolutionInfo="   推荐分辨率为4K (3840x1920) 及以上"
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Upload
