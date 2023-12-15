import styles from './index.module.scss'
import ReactCrop, { PixelCrop, type Crop } from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import { imgPreview } from '@/utils/generateImagePreview'
import { useDebounceEffect } from 'ahooks'
import { ChangeEvent, useRef, useState } from 'react'
import { Button } from '@douyinfe/semi-ui'

const ImageCropper = ({ imageUrl, onCropComplete, onOk, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 282,
    height: 211.5,
    x: 0,
    y: 0
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  //原图url
  const [image, setImage] = useState<string | null>(imageUrl)
  const imgRef = useRef<HTMLImageElement>(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(
    imageUrl
  )
  const handleCropChange = (newCrop) => {
    setCrop(newCrop)
  }

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  useDebounceEffect(
    () => {
      const fetchData = async () => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
          const url = await imgPreview(imgRef.current, completedCrop)
          setCroppedImageUrl(url)
          onCropComplete(url)
        } else {
          setCompletedCrop({ ...crop, unit: 'px' })
        }
      }

      fetchData()
    },
    [completedCrop, imgRef.current],
    {
      wait: 100
    }
  )

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    const url = URL.createObjectURL(selectedFile)
    setImage(url)
    handleCropComplete(crop)
  }

  return (
    <div className="image-upload">
      <div className={styles['preview-title']}>设置封面</div>
      <div className={styles['image-cropper']}>
        <div className={styles['crop-main']}>
          <div className={styles['crop-origin']}>
            <ReactCrop
              crop={crop}
              aspect={3 / 4}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
            >
              <img
                src={image}
                ref={imgRef}
                alt="原图"
                style={{ maxHeight: '376px', maxWidth: '340px' }}
              />
            </ReactCrop>
          </div>

          <div className={styles['preview-area']}>
            <img
              className={styles['crop-preview']}
              src={croppedImageUrl}
              alt="截图预览"
            />

            <label className={styles['preview-label']}>
              <input
                className={styles['upload-btn-input']}
                type="file"
                name="upload-btn"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
              <p className={styles['reload-btn']}>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.893 3.372a4.335 4.335 0 10-8.442 1.969 3 3 0 00.216 5.992h7.667a4 4 0 00.56-7.96zM8.32 3.6a.5.5 0 00-.64 0L5.061 5.783a.5.5 0 00.32.884h1.286V9a1 1 0 001 1h.667a1 1 0 001-1V6.667h1.285a.5.5 0 00.32-.884L8.32 3.6z"
                    fill="#1C1F23"
                    fillOpacity="0.6"
                  ></path>
                </svg>{' '}
                &nbsp;重新上传
              </p>
            </label>
          </div>
        </div>
      </div>
      <div className={styles['btn-area']}>
        <Button type="tertiary" onClick={onCancel}>
          取消
        </Button>
        <Button theme="solid" onClick={onOk}>
          保存
        </Button>
      </div>
    </div>
  )
}

export default ImageCropper
