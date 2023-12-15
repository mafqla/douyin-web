import { Button, Switch, Tooltip } from '@douyinfe/semi-ui'
import styles from './style/publish.module.scss'
import PostAssistant from './PostAssistant'
import MobilePreview from './MobilePreview'
import { useEffect, useState } from 'react'
import PublishSetting from './publish-setting'
import MixSelection from './MixSelection'
import PayBtn from './PayBtn'
import AnchorSelect from './AnchorSelect'
import ChapterAddition from './ChapterAddition'
import CoverGallery from './CoverGallery/index'
import ActivityRewards from './ActivityRewards'
import PublishEditor from './PublishEditor'
const Publish = () => {
  const [avatar, setAvatar] = useState('')
  const [nickname, setNickname] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  // const [tag, setTag] = useState('')
  const [cover, setCover] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    setAvatar('https://sf1-')
    setNickname('test')
    setTitle('testtitle')
    setDescription('说的都是 #甜妹 #笨蛋美女 #今天长这样 sdsd')
    setCover('https://sf1-')
    setVideoUrl('https://sf1-')
  }, [])

  return (
    <div className={styles.publish}>
      <div className={styles.container}>
        <div className={styles.title}>发布视频</div>
        <div className={styles.content}>
          <div className={styles['content-form']}>
            <div className={styles['disc-title']}>
              <div className={styles['disc-title-content']}>
                <div className={styles['title-text']}>
                  <p className={styles['title-main']}>
                    作品描述
                    <Tooltip
                      position="bottomLeft"
                      showArrow
                      style={{
                        maxWidth: '900px',
                        background: '#6b7075',
                        color: 'rgba(255,255,255,1'
                      }}
                      content={
                        <div>
                          <div>
                            1.作品标题仅支持输入文本，如需添加#话题和@好友则在标题下方区域输入
                          </div>
                          <div>
                            2.作品标题会在双列场景下优先展示，可在右侧的预览进行查看
                          </div>
                          <div>3.避免作品标题与简介填写一样的内容噢！</div>
                        </div>
                      }
                    >
                      <span className={styles['icon']}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7 13.417A6.417 6.417 0 107 .583a6.417 6.417 0 000 12.834zm-.1-4.895c-.502 0-.752-.313-.752-.723 0-.61.302-1.003 1.008-1.538l.038-.03c.481-.365.817-.62.817-1.081 0-.518-.485-.82-1.026-.82-.444 0-.786.165-1.054.512-.193.2-.347.308-.61.308-.432 0-.654-.302-.654-.65 0-.353.2-.712.512-.985.422-.365 1.094-.598 1.983-.598 1.583 0 2.694.78 2.694 2.125 0 .98-.586 1.452-1.276 1.93-.467.343-.689.542-.866.946v.001c-.194.342-.342.603-.814.603zm-.012 2.427c-.547 0-.997-.353-.997-.9s.45-.9.997-.9c.547 0 .992.353.992.9s-.445.9-.992.9z"
                            fill="#1C1F23"
                            fillOpacity="0.35"
                          ></path>
                        </svg>
                      </span>
                    </Tooltip>
                  </p>
                </div>
              </div>
            </div>

            <PublishEditor />
            <ActivityRewards />

            <CoverGallery />

            <ChapterAddition />

            <AnchorSelect />

            <PayBtn />
            <MixSelection />

            <div className={styles['title-other']}>
              <p className={styles['title-main']}>同步到其他平台</p>
            </div>
            <div className={styles['preview']}>
              <div className={styles['info']}>
                <div className={styles['first-part']}>
                  <div className={styles['toutiao']}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path
                        d="M21.373 25.993H4.627A4.632 4.632 0 010 21.366V4.626A4.632 4.632 0 014.627 0h16.746A4.632 4.632 0 0126 4.627v16.746a4.626 4.626 0 01-4.627 4.62z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M26 20.014L0.008 21.374V5.977L26 4.62v15.395z"
                        fill="#FF373C"
                      ></path>
                      <path
                        d="M7.092 10.323V8.748L3.535 8.43v1.574l3.557.32zM3.534 11.088v1.574l3.557.32v-1.567l-3.557-.327zM12.647 15.194l-10.04.52v-1.403l10.04-.527v1.41zM23.386 14.63l-10.034.527v-1.41l10.034-.528v1.411zM22.828 8.83l-7.3.379V7.805l7.3-.386V8.83z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M9.862 7.746l-1.597.081c-.045 3.179-.082 4.969-.661 6.254-.58 1.3-1.827 2.376-4.292 4.522l-.32.275 2.518-.134c4.107-3.624 4.263-4.411 4.352-10.998zM11.095 15.974l-1.93.104 1.551 2.392 1.924-.097-1.545-2.399zM21.848 15.417l-1.93.097 1.552 2.399 1.93-.104-1.552-2.392zM16.835 15.677l-1.93.104-1.553 2.555 1.931-.104 1.553-2.555zM19.175 18.031l-1.634.082V12.73l1.634-.09v5.392zM21.358 7.5v.988c-.928.802-2.814 2.154-8.013 3.298v1.5c6.313-1.36 8.466-3.268 9.484-4.226V7.42l-1.47.082z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M15.187 8.704c-.067-.045-.134-.097-.2-.134l-1.36.891s.61.438.676.483c1.114.765 3.142 2.161 9.083 2.822v-1.5c-5.4-.639-7.204-1.879-8.199-2.562z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M13.627 9.454l1.374.832 1.656-2.54-1.507-.631-1.523 2.339z"
                        fill="#fff"
                      ></path>
                      <rect
                        x="0.25"
                        y="0.25"
                        width="25.5"
                        height="25.5"
                        rx="5.75"
                        stroke="#161823"
                        strokeOpacity="0.12"
                        strokeWidth="0.5"
                      ></rect>
                    </svg>
                    <span className={styles['toutiao-title']}>今日头条</span>
                  </div>

                  <Switch
                    defaultChecked={false}
                    onChange={(v) => console.log(v)}
                  />
                </div>
                <div className={styles['third-part']}>
                  <span className={styles['info-sub']}>
                    提示：打开同步开关可以同步内容至头条绑定账号
                  </span>
                </div>
              </div>
            </div>
            <div className={styles['title-other']}>
              <p className={styles['title-main']}>允许他人保存视频</p>
            </div>

            <PublishSetting />

            <div className={styles['content-confirm-container']}>
              <Button type="primary" theme="solid" style={{ width: '120px' }}>
                发布
              </Button>
              <Button
                type="tertiary"
                style={{
                  width: '120px',
                  marginLeft: '12px',
                  color: '#6b7075',
                  background: 'rgba(46,50,56,.05)'
                }}
              >
                取消
              </Button>
            </div>
          </div>
          <div className={styles['content-preview']}>
            <MobilePreview
              avatar={avatar}
              title={title}
              description={description}
              nickename={nickname}
              videoUrl={videoUrl}
              coverUrl={cover}
            />
            <PostAssistant />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publish
