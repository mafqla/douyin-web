import { useState } from 'react'
import styles from './style/cover-select.module.scss'
import { Button, Upload } from '@douyinfe/semi-ui'
import { IconUpload } from '@douyinfe/semi-icons'
import UploadCrop from './UploadCrop'

interface CoverSelectProps {
  handleOk: () => void
  handleOpenEditor: () => void
  handleCoverSelectonCancel: () => void
}
const CoverSelect: React.FC<CoverSelectProps> = ({
  handleOk,
  handleOpenEditor,
  handleCoverSelectonCancel
}) => {
  const [selectedTab, setSelectedTab] = useState('selectCover')
  //是否显示上传裁剪
  const [isShowUploadCrop, setIsShowUploadCrop] = useState(false)
  //图片链接
  const [imgUrl, setImgUrl] = useState('')

  return (
    <>
      <div className={styles['cover-content']}>
        <div className={styles['cover-select']}>
          <div className={styles['tabs-items']}>
            <div className={styles['tabs-item-content']}>
              <div
                className={`${styles['tbas-item']} ${
                  selectedTab === 'selectCover' ? styles['selected'] : ''
                }`}
                onClick={() => setSelectedTab('selectCover')}
              >
                选取封面
              </div>
              <div
                className={`${styles['tbas-item']} ${
                  selectedTab === 'uploadCover' ? styles['selected'] : ''
                }`}
                onClick={() => setSelectedTab('uploadCover')}
              >
                上传封面
              </div>
            </div>
          </div>
          <div className={styles['tabs-content']}>
            {selectedTab === 'selectCover' && (
              <div className={styles['extract-content']}>
                <div className={styles['extract-main']}></div>
                <div className={styles['extract-footer']}>
                  <Button
                    type="tertiary"
                    className={styles['edit']}
                    onClick={handleOk}
                  >
                    完成
                  </Button>
                  <Button
                    theme="solid"
                    className={styles['finish']}
                    onClick={handleOpenEditor}
                  >
                    去编辑
                  </Button>
                </div>
              </div>
            )}
            {selectedTab === 'uploadCover' && (
              <>
                <Upload
                  action="https://api.semi.design/upload"
                  onFileChange={(file) => {
                    console.log(file)
                    //把上传的图片传给裁剪组件
                    //1.先转成blob：url
                    const blobUrl = URL.createObjectURL(file[0])
                    setImgUrl(blobUrl)
                    //2.传给裁剪组件
                    setIsShowUploadCrop(true)
                  }}
                  dragIcon={
                    <IconUpload
                      style={{
                        fontSize: 32
                      }}
                    />
                  }
                  draggable={true}
                  accept="application/pdf,.jpeg"
                  dragMainText={
                    <span className={styles.dragMainText}>
                      点击上传 或直接将图片文件拖入此区域
                    </span>
                  }
                  dragSubText={
                    <span className={styles['dragSubText-sub']}>
                      建议上传4:3(横)或3:4(竖)比例的高清图片，清晰美观的封面利于推荐
                    </span>
                  }
                  style={{
                    marginTop: 10,
                    display: isShowUploadCrop ? 'none' : 'flex'
                  }}
                />

                {isShowUploadCrop && (
                  <UploadCrop
                    handleOk={() => setIsShowUploadCrop(false)}
                    handleOpenEditor={handleOpenEditor}
                    imgUrl={imgUrl}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={styles['close-icon']}
        onClick={handleCoverSelectonCancel}
      >
        <path
          d="M14.698 13.4L9.41 7.996 14.395 2.9a1.009 1.009 0 000-1.44.96.96 0 00-1.41 0L8 6.556 3.014 1.46a.958.958 0 00-1.41 0 1.01 1.01 0 000 1.44l5.007 5.076L1.3 13.4a1.009 1.009 0 000 1.441c.202.206.404.308.705.308.302 0 .503-.102.705-.308l5.316-5.433 5.362 5.435c.202.206.403.308.705.308.301 0 .503-.102.604-.308a1.014 1.014 0 000-1.443z"
          opacity="0.5"
        ></path>
      </svg>
    </>
  )
}

export default CoverSelect
