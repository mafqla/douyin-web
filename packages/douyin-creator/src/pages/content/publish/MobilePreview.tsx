import { Button } from '@douyinfe/semi-ui'
import styles from './style/mobile-preview.module.scss'
import phoneContent from '@/assets/phone-content.png'
import cs from 'classnames'
import { IconScissors, IconTiktokLogo, IconUpload } from '@douyinfe/semi-icons'
import { ChangeEvent, useEffect, useState } from 'react'
import React from 'react'

interface MobilePreviewProps {
  videoUrl: string
  coverUrl: string
  nickename?: string
  avatar?: string
  title?: string
  description?: string
}

const MobilePreview: React.FC<MobilePreviewProps> = ({
  videoUrl,
  coverUrl,
  nickename,
  avatar,
  title,
  description
}) => {
  const [activeTab, setActiveTab] = useState(true)

  const toggleTab = () => {
    setActiveTab(!activeTab)
  }
  const formatText = (title: string, desc: string): React.JSX.Element => {
    const combinedText = title + ' ' + desc
    const formattedArray = combinedText.split(' ').map((item, index) =>
      item.startsWith('#') ? (
        <React.Fragment key={index}>
          <span style={{ fontWeight: 'bold' }}>{item}</span>
          <span>
            <span> </span>
          </span>
        </React.Fragment>
      ) : (
        <React.Fragment key={index}>
          <span>
            <span>{index === 0 ? item + '\u00a0' : item}</span>
          </span>
        </React.Fragment>
      )
    )

    return <>{formattedArray}</>
  }

  //实现滚动动画

  const [leftValue, setLeftValue] = useState<number>(0)

  useEffect(() => {
    const scroll = () => {
      setLeftValue((prevLeft) => (prevLeft <= -308 ? 102 : prevLeft - 1))
      requestAnimationFrame(scroll)
    }

    const animationId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationId)
  }, [])

  //文件上传

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (file) {
      // const reader = new FileReader()
      // reader.onloadend = () => {
      //   setPreviewUrl(reader.result as string)
      // }
      // reader.readAsDataURL(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [file])

  useEffect(() => {
    console.log(file, previewUrl)
  }, [file, previewUrl])
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setFile(selectedFile)
  }

  return (
    <div className={styles['phone-container']}>
      <div className={styles['phone']}>
        <div className={styles['preview-tab']}>
          <div className={styles['tab-container']}>
            <div
              className={cs(styles['tab-item'], activeTab && styles['active'])}
              onClick={toggleTab}
            >
              预览视频
            </div>
            <div
              className={cs(styles['tab-item'], !activeTab && styles['active'])}
              onClick={toggleTab}
            >
              预览封面/标题
            </div>
          </div>
        </div>

        <div className={styles['phone-screen']}>
          <div style={{ display: activeTab ? 'block' : 'none' }}>
            <div
              className={styles['player-container']}
              style={{ width: '243px', height: '505px' }}
            >
              <video
                src={previewUrl ? previewUrl : videoUrl}
                loop
                autoPlay
                preload="auto"
                controlsList="nodownload"
                muted
                disablePictureInPicture
                style={{ width: '243px' }}
                className={styles['player-video']}
              ></video>
            </div>
            <img src={avatar} className={styles['avater-class']}></img>
            <img src={phoneContent} className={styles['preview-card']}></img>
            <img
              src="data:image/png;base64,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"
              className={styles['preview-like']}
            ></img>
            <div className={styles['layer-top']}>
              <div className={styles['bottom-binder']}>
                <div className={styles['user-name']}>@{nickename}</div>
                <div id="phoneText" className={styles['phone-text']}>
                  {formatText(title, description)}
                </div>
                <div className={styles['music-binder']}>
                  <IconTiktokLogo />
                  <div className={styles['music-text']}>
                    <div
                      className={`${styles['inner-text']} ${styles['text1']}`}
                      style={{ left: `${leftValue}px` }}
                    >
                      󠀀󠀀创作的原声 - @{nickename} 󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @
                      {nickename} 󠀀󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @{nickename}
                    </div>
                    <div
                      className={`${styles['inner-text']} ${styles['text2']}`}
                      style={{ left: `${leftValue + 410}px` }}
                    >
                      󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @{nickename} 󠀀󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @
                      {nickename} 󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @{nickename}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: !activeTab ? 'block' : 'none' }}>
            <div className={styles['preview-container--2']}>
              <img
                src={phoneContent}
                className={styles['preview-cover-bg']}
              ></img>
              <div className={styles['dual-columns']}>
                <div className={styles['column-container']}>
                  <div className={styles['cover-box']}>
                    <div
                      className={styles['ccover--x']}
                      style={{ height: '144px' }}
                    >
                      <img src={coverUrl} alt={title} />
                    </div>
                    <div className={styles['cover-info']}>
                      <div className={styles['describe']}>
                        <div>
                          {title !== null && title.length > 0
                            ? title
                            : '请填写作品标题...'}
                        </div>
                      </div>
                      <div className={styles['user-info']}>
                        <div className={styles['avatar-box']}>
                          <div className={styles['avatar']}>
                            <img src={avatar} alt={title} />
                          </div>
                          <div className={styles['nickname']}>{nickename}</div>
                        </div>
                        <div className={styles['user-like']}>
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                            alt={title}
                          />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['cover-box']}>
                    <div
                      className={styles['ccover--x']}
                      style={{ height: '144px' }}
                    ></div>
                    <div className={styles['cover-info']}>
                      <div className={styles['describe']}>
                        <div>************************</div>
                      </div>
                      <div className={styles['user-info']}>
                        <div className={styles['avatar-box']}>
                          <div className={styles['avatar']}></div>
                          <div className={styles['nickname']}>***</div>
                        </div>
                        <div className={styles['user-like']}>
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                            alt={title}
                          />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['cover-box']}>
                    <div
                      className={styles['ccover--x']}
                      style={{ height: '144px' }}
                    ></div>
                    <div className={styles['cover-info']}>
                      <div className={styles['describe']}>
                        <div>************************</div>
                      </div>
                      <div className={styles['user-info']}>
                        <div className={styles['avatar-box']}>
                          <div className={styles['avatar']}></div>
                          <div className={styles['nickname']}>***</div>
                        </div>
                        <div className={styles['user-like']}>
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                            alt={title}
                          />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles['column-container']}>
                  {' '}
                  <div className={styles['cover-box']}>
                    <div
                      className={styles['ccover--x']}
                      style={{ height: '144px' }}
                    ></div>
                    <div className={styles['cover-info']}>
                      <div className={styles['describe']}>
                        <div>************************</div>
                      </div>
                      <div className={styles['user-info']}>
                        <div className={styles['avatar-box']}>
                          <div className={styles['avatar']}></div>
                          <div className={styles['nickname']}>***</div>
                        </div>
                        <div className={styles['user-like']}>
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                            alt={title}
                          />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['cover-box']}>
                    <div
                      className={styles['ccover--x']}
                      style={{ height: '144px' }}
                    ></div>
                    <div className={styles['cover-info']}>
                      <div className={styles['describe']}>
                        <div>************************</div>
                      </div>
                      <div className={styles['user-info']}>
                        <div className={styles['avatar-box']}>
                          <div className={styles['avatar']}></div>
                          <div className={styles['nickname']}>***</div>
                        </div>
                        <div className={styles['user-like']}>
                          <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                            alt={title}
                          />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles['long-card']}>
            <div className={styles['preview-button']}>
              <label className={styles['upload-btn']}>
                <input
                  className={styles['upload-btn-input']}
                  type="file"
                  name="upload-btn"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={handleFileChange}
                />
                <Button
                  theme="borderless"
                  className={styles['icon-div']}
                  icon={<IconUpload size="large" />}
                ></Button>
              </label>
              <div className={styles['text']}>重新上传</div>
            </div>
            <div className={styles['preview-button']}>
              <Button
                theme="borderless"
                className={styles['icon-div']}
                icon={<IconScissors size="large" />}
              ></Button>
              <div className={styles['text']}>视频剪辑</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobilePreview
