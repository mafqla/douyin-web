import { IconClear, IconHelpCircle } from '@douyinfe/semi-icons'
import styles from './style/pay-btn.module.scss'
import {
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TimePicker,
  Typography
} from '@douyinfe/semi-ui'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import ImageCropper from '@/components/ImageCropper'

const PayBtn: React.FC = () => {
  const { Text } = Typography
  //是否打开付费开关
  const [isPay, setIsPay] = useState(false)
  //封面选择, 1: 使用视频封面, 2: 使用自定义封面
  const [coverType, setCoverType] = useState(1)

  const [coverUrl, setCoverUrl] = useState('')
  // 试看时长
  const [previewTime, setPreviewTime] = useState()
  // 价格
  const [price, setPrice] = useState(0)
  // 标题
  const [title, setTitle] = useState('')
  //是否同意协议
  const [isAgree, setIsAgree] = useState(true)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  //是否打开图片预览弹框
  const [isPreview, setIsPreview] = useState(false)
  // 是否打开付费
  const onPayChange = () => {
    setIsPay(!isPay)
    console.log(isPay)
  }

  const onCoverTypeChange = (e) => {
    setCoverType(e.target.value)
  }

  // const [croppedImage, setCroppedImage] = useState(null)
  const handleCropComplete = (crop) => {
    // 在这里处理裁剪完成事件，可以将裁剪后的图片数据传递到后端或其他操作
    console.log('url:', crop)
    setPreviewUrl(crop)
  }

  const handleOk = () => {
    setIsPreview(false)
    setPreviewUrl(previewUrl)
  }

  const handleCancel = () => {
    setIsPreview(false)
    setPreviewUrl(null)
  }

  useEffect(() => {
    // console.log(file, previewUrl)
    setCoverUrl(previewUrl || '')
  }, [previewUrl])
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
    //打开弹框
    setIsPreview(true)
  }

  //确认删除封面
  const handleDeleteCover = () => {
    Modal.warning({
      title: '确认删除当前封面',
      content: null,
      centered: true,
      onOk: () => {
        setPreviewUrl(null)
      }
    })
  }

  // 切换是否同意
  const toggleAgree = () => {
    setIsAgree(!isAgree)
  }

  const fileInputRef = useRef(null)

  const handleFileButtonClick = () => {
    fileInputRef.current.click()
  }
  return (
    <div className={styles['pay-btn']}>
      <div className={styles['form-header']}>
        <div className={styles['form-title']}>
          付费视频
          <div className={styles['icon']}>
            <IconHelpCircle style={{ color: 'rgba(37, 38, 50, 0.35)' }} />
          </div>
        </div>
        <Switch checked={isPay} onChange={onPayChange} />
      </div>

      <div className={styles.tip}>
        提示：打开付费开关，用户需付费才可观看视频
      </div>

      {isPay && (
        <div className={styles['form-container']}>
          <div className={styles['subItem-wrapper']}>
            <div className={`${styles['sub-title']}  ${styles['required']}`}>
              视频价格
            </div>

            <div className={styles['whiteBg']}>
              <InputNumber
                onNumberChange={(number) => setPrice(number)}
                type="number"
                innerButtons={false}
                value={price}
                placeholder="请输入视频价格"
              />
              <span className={styles['unit']}>元</span>
            </div>

            <div className={styles['desc']}>视频发布成功后，价格将无法更改</div>
          </div>
          <div className={styles['subItem-wrapper']}>
            <div className={`${styles['sub-title']} ${styles['required']}`}>
              商品标题
            </div>
            <div className={styles['whiteBg']}>
              <Input
                onChange={(e) => setTitle(e)}
                placeholder="请输入付费场景下的视频标题"
                maxLength={28}
                value={title}
              />
              <div className={styles['count']}>0/28</div>
            </div>

            <div className={styles['desc']}>该标题会展示在视频购买页面</div>
          </div>
          <div className={styles['subItem-wrapper']}>
            <div className={`${styles['sub-title']} ${styles['required']}`}>
              商品封面
            </div>

            <RadioGroup onChange={onCoverTypeChange} value={coverType}>
              <Radio value={1}>使用原视频封面</Radio>
              <Radio value={2}>上传新封面</Radio>
            </RadioGroup>

            <div
              className={styles['cover-wrapper']}
              style={{ display: coverType === 1 ? 'flex' : 'none' }}
            >
              <img src={coverUrl} />
            </div>

            <div
              className={styles['crop-upload']}
              style={{ display: coverType === 2 ? 'flex' : 'none' }}
            >
              <div>
                <div className={styles['upload-btn']}>
                  <div
                    className={styles['upload-wrapper']}
                    style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                  >
                    {!previewUrl && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className={styles['add-icon']}
                        onClick={handleFileButtonClick}
                      >
                        <path d="M20.5 13.5a1.5 1.5 0 0 0 0-3h-7v-7a1.5 1.5 0 0 0-3 0v7h-7a1.5 1.5 0 0 0 0 3h7v7a1.5 1.5 0 0 0 3 0v-7h7z"></path>
                      </svg>
                    )}

                    {previewUrl && (
                      <>
                        <img
                          className={styles['upload-img']}
                          src={previewUrl}
                          onClick={handleFileButtonClick}
                        />
                        <IconClear
                          className={styles['close-icon']}
                          onClick={handleDeleteCover}
                        />

                        <Modal
                          title={null}
                          visible={isPreview}
                          onOk={handleOk}
                          onCancel={handleCancel}
                          closeOnEsc={true}
                          width={520}
                          okText="保存"
                          className={styles['preview-modal']}
                          footer={null}
                        >
                          <ImageCropper
                            imageUrl={previewUrl}
                            onCropComplete={handleCropComplete}
                            onCancel={handleCancel}
                            onOk={handleOk}
                          />
                        </Modal>
                      </>
                    )}
                  </div>
                  <input
                    className={styles['upload-btn-input']}
                    type="file"
                    name="upload-btn"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
              </div>
              <div className={styles['desc-upload']}>
                <span>点击上传新的视频封面</span>
                <span>图片分辨率需大于1000*752</span>
              </div>
            </div>

            <div className={styles['desc']}>该封面会展示在商品购买页面</div>
          </div>
          <div className={styles['subItem-wrapper']}>
            <div className={`${styles['sub-title']} ${styles['required']}`}>
              试看时长
            </div>

            <div className={styles['whiteBg']}>
              <div className={styles['time-selec-wrapper']}>
                <Select
                  defaultValue={'custom-time'}
                  style={{ width: '128px' }}
                  className={styles['time-type-select']}
                >
                  <Select.Option value="custom-time">自定义时长</Select.Option>
                  <Select.Option value="recommend-time">推荐时长</Select.Option>
                  <Select.Option value="no-preview">无试看</Select.Option>
                </Select>
                <div className={styles['time-wrapper']}>
                  <TimePicker
                    className={styles['time-pick']}
                    value={previewTime}
                    onChange={(v) => setPreviewTime(v)}
                  />
                </div>
              </div>
            </div>
            <div className={styles['desc']}>观众将从头开始试看 </div>
          </div>
          <div className={styles['subItem-wrapper']}>
            <div className={`${styles['sub-title']} ${styles['required']}`}>
              协议确认
            </div>

            <div className={styles['checkbox-wrapper']}>
              <div className={styles['check-icon']}>
                {isAgree && (
                  <svg
                    onClick={toggleAgree}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_10043_8389)">
                      <rect width="16" height="16" rx="8" fill="#FF2C55"></rect>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.0749 4.36585C12.5137 4.70134 12.5973 5.32895 12.2619 5.76766L7.92852 11.4343C7.74019 11.6806 7.44829 11.8256 7.13826 11.8269C6.82823 11.8281 6.53515 11.6855 6.34481 11.4408L4.01148 8.44082C3.6724 8.00487 3.75094 7.37659 4.18689 7.03752C4.62283 6.69845 5.25111 6.77699 5.59018 7.21293L7.12745 9.18943L10.6731 4.55276C11.0086 4.11405 11.6362 4.03036 12.0749 4.36585Z"
                        fill="white"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_10043_8389">
                        <rect width="16" height="16" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                )}
                {!isAgree && (
                  <div
                    className={styles['dis-active']}
                    onClick={toggleAgree}
                  ></div>
                )}
              </div>
              <div className={styles['desc-checkbox']}>
                请阅读并同意
                <Text
                  link={{
                    href: 'https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/platform_use/a65ace8d-80e2-4b02-ab67-c73ff7bf107e.html'
                  }}
                >
                  《付费内容功能使用协议》
                </Text>
                确保上传内容合法合规，平台鼓励原创或获得有效合法授权的内容，避免发布营销性质较强内容
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayBtn
