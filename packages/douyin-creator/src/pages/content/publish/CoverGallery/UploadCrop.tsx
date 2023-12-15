import { Button } from '@douyinfe/semi-ui'
import styles from './style/upload-crop.module.scss'

import { useRef } from 'react'
import FabricImageCrop from '@/components/FabricImageCrop'

const UploadCrop = ({ handleOk, handleOpenEditor, imgUrl }) => {
  const canvasRef = useRef(null)

  return (
    <div className={styles['upload-crop']}>
      <div className={styles['panel']}>
        <div className={styles['crop-wrap']}>
          <div
            className="canvas-container"
            style={{
              width: '672px',
              height: '432px',
              position: 'relative',
              userSelect: 'none'
            }}
          >
            <FabricImageCrop imagePath={imgUrl} canvasRef={canvasRef}>
              <canvas
                id="uploadCrop"
                ref={canvasRef}
                className="lower-canvas"
                width="1008"
                height="648"
                style={{
                  position: 'absolute',
                  width: '672px',
                  height: '432px',
                  left: '0px',
                  top: '0px',
                  touchAction: 'none',
                  userSelect: 'none'
                }}
              />
            </FabricImageCrop>
          </div>
        </div>
      </div>
      <div className={styles['extract-footer']}>
        <Button
          type="tertiary"
          className={styles['reselect']}
          onClick={handleOk}
        >
          重新选择
        </Button>
        <Button
          type="tertiary"
          className={styles['edit']}
          onClick={handleOpenEditor}
        >
          去编辑
        </Button>
        <Button theme="solid" className={styles['finish']} onClick={handleOk}>
          完成
        </Button>
      </div>
    </div>
  )
}

export default UploadCrop
