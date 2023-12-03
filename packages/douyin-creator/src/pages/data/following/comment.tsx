import {
  Button,
  Popover,
  Select,
  SideSheet,
  TabPane,
  Tabs,
  TextArea
} from '@douyinfe/semi-ui'
import styles from './style/comment.module.scss'
import cs from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Emoji from '@/components/Emoji'

const Comment = () => {
  const [showTextarea, setShowTextarea] = useState(false)
  const [commentContent, setCommentContent] = useState<JSX.Element | null>(null)
  const [commentTextArea, setCommentTextArea] = useState('')
  //是否显示侧边栏，语义化的变量名
  const [visible, setVisible] = useState(false)
  //切换侧边栏显示状态
  const change = () => {
    setVisible(!visible)
  }

  /**
   * 通过 contentEditable 属性实现输入框
   */
  const editableDivRef = useRef(null)
  useEffect(() => {
    const editableDiv = editableDivRef.current

    if (editableDiv) {
      // 将光标移至文本末尾
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editableDiv)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    console.log(commentTextArea)
  }, [commentContent, commentTextArea])

  const handleShowTextarea = () => {
    setShowTextarea(true)
    const editableDiv = editableDivRef.current

    if (editableDiv) {
      // 设置焦点
      editableDiv.focus()
    }
  }

  const handleSelectEmoji = (emoji) => {
    const { display_name, emoji_url } = emoji
    const emojiName = display_name
    const emojiImg = emoji_url.url_list[0]

    const editableDiv = editableDivRef.current

    if (editableDiv) {
      editableDiv.focus()
      const imgElement = document.createElement('img')
      imgElement.src = emojiImg
      imgElement.alt = emojiName

      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(imgElement)

      // 移动光标到插入内容之后
      range.setStartAfter(imgElement)
      range.setEndAfter(imgElement)
      selection.removeAllRanges()
      selection.addRange(range)

      const updatedTextArea = commentTextArea + `${emojiName}`
      setCommentTextArea(updatedTextArea)
    }
  }

  const handleContentEditableInput = (e) => {
    const content = e.target.innerHTML // 使用 innerHTML 获取包含 HTML 结构的内容
    setCommentContent(content)
    const updatedText = content.replace(/<img.*?alt="(.*?)".*?>/g, '$1')
    setCommentTextArea(updatedText)
  }
  //-----------------end-----------------
  return (
    <div className={styles.container}>
      <div className={styles['header--comment']}>
        <div className={styles.title}>评论管理</div>
        <Button type="primary" theme="solid" onClick={change}>
          选择作品
        </Button>
      </div>
      <div className={styles['video-card']}>
        <div className={styles['container--comment']}>
          <div className={styles.cover}>
            <div className={styles['play-btn-container']}>
              <img src="//sf3-cdn-tos.douyinstatic.com/obj/ies-douyin-opencn/douyin.creator/billboard/icon/play.png" />
              <img
                src="//p11-sign.douyinpic.com/tos-cn-i-dy/cfa35b71590f4323be3eb511a0389422~noop.jpeg?x-expires=1702706400&amp;x-signature=uC1oChEbrRy%2Fk0WwaBKu%2FvWNPqQ%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_images&amp;l=20231202140647AD40F4F0F732F45F00CE"
                crossOrigin="anonymous"
                className={styles.pic}
              />
            </div>
            <span className={styles.badge}>00:00</span>
          </div>
          <div className={styles['video-info']}>
            <div className={styles['info-title']}>
              <div className={styles['info-title-text']}>#今天长这样 #甜妹</div>
            </div>
            <div className={styles['publish-time']}>
              发布于2023年10月04日 14:02
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="1" className={styles['cmt-tabs']}>
        <TabPane tab="评论管理" itemKey="1">
          <div className={styles['cmt-detail']}>
            <div className={styles['cmt-editor']}>
              <div
                className={styles['cmt-avatar']}
                style={{
                  backgroundImage:
                    'url(""), url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOTZweCIgaGVpZ2h0PSI5NnB4IiB2aWV3Qm94PSIwIDAgOTYgOTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU5LjEgKDg2MTQ0KSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Hcm91cCA2MDU8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAtNjA1IiBmaWxsPSIjMTYxODIzIj4KICAgICAgICAgICAgPHBhdGggZD0iTTQ4LDk2IEM3NC41MSw5NiA5Niw3NC41MDk3IDk2LDQ4IEM5NiwyMS40OTAzIDc0LjUxLDAgNDgsMCBDMjEuNDkwMywwIDAsMjEuNDkwMyAwLDQ4IEMwLDc0LjUwOTcgMjEuNDkwMyw5NiA0OCw5NiBaIiBpZD0iUGF0aCIgZmlsbC1vcGFjaXR5PSIwLjA2Ij48L3BhdGg+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGwtb3BhY2l0eT0iMC4xIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGN4PSI0OCIgY3k9IjQwIiByPSIxNyI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik04Mi4yOTEsNzcuMTQxMyBDNzQuMDM2LDg2Ljg0NDUgNjEuNzM3LDkzIDQ3Ljk5OTYsOTMgQzM1LjQxNjksOTMgMjQuMDQwNCw4Ny44MzU3IDE1Ljg3NCw3OS41MTEgQzIzLjQ5NzYsNjguOTA2MyAzNS45NDIxLDYyIDQ5Ljk5OTYsNjIgQzYyLjk4MSw2MiA3NC41ODYsNjcuODg5MSA4Mi4yOTEsNzcuMTQxMyBaIiBpZD0iUGF0aCIgZmlsbC1vcGFjaXR5PSIwLjEiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==")',
                  backgroundSize: 'cover'
                }}
              ></div>
              <TextArea
                className={cs(styles['cmt-textarea'], {
                  [styles['show']]: !showTextarea && !commentTextArea
                })}
                rows={1}
                cols={20}
                placeholder="有爱评论，说点儿好听的～"
                value={commentTextArea}
              />
              <div
                ref={editableDivRef}
                onClick={handleShowTextarea}
                onBlur={() => setShowTextarea(false)}
                className={styles['cmt-input']}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={handleContentEditableInput}
                dangerouslySetInnerHTML={{ __html: commentContent }}
              ></div>

              <Popover
                position="bottomLeft"
                trigger="click"
                content={<Emoji onSelectEmoji={handleSelectEmoji} />}
              >
                <img
                  className={styles['cmt-sticker']}
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05Ljk5OTg0IDE4LjMzMzRDMTQuNjAyMiAxOC4zMzM0IDE4LjMzMzIgMTQuNjAyNCAxOC4zMzMyIDEwQzE4LjMzMzIgNS4zOTc2NSAxNC42MDIyIDEuNjY2NjkgOS45OTk4NCAxLjY2NjY5QzUuMzk3NDYgMS42NjY2OSAxLjY2NjUgNS4zOTc2NSAxLjY2NjUgMTBDMS42NjY1IDE0LjYwMjQgNS4zOTc0NiAxOC4zMzM0IDkuOTk5ODQgMTguMzMzNFoiIGZpbGw9IiMxQzFGMjMiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy4wODM1IDkuNTgzMzNDNy43NzM4NSA5LjU4MzMzIDguMzMzNSA4LjgzNzE0IDguMzMzNSA3LjkxNjY3QzguMzMzNSA2Ljk5NjE5IDcuNzczODUgNi4yNSA3LjA4MzUgNi4yNUM2LjM5MzE0IDYuMjUgNS44MzM1IDYuOTk2MTkgNS44MzM1IDcuOTE2NjdDNS44MzM1IDguODM3MTQgNi4zOTMxNCA5LjU4MzMzIDcuMDgzNSA5LjU4MzMzWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuOTE2NSA5LjU4MzMzQzEzLjYwNjkgOS41ODMzMyAxNC4xNjY1IDguODM3MTQgMTQuMTY2NSA3LjkxNjY3QzE0LjE2NjUgNi45OTYxOSAxMy42MDY5IDYuMjUgMTIuOTE2NSA2LjI1QzEyLjIyNjEgNi4yNSAxMS42NjY1IDYuOTk2MTkgMTEuNjY2NSA3LjkxNjY3QzExLjY2NjUgOC44MzcxNCAxMi4yMjYxIDkuNTgzMzMgMTIuOTE2NSA5LjU4MzMzWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy41IDExLjU3M0M3LjUgMTIuNTU5MiA4LjYxOTI5IDEzLjM1ODcgMTAgMTMuMzU4N0MxMS4zODA3IDEzLjM1ODcgMTIuNSAxMi41NTkyIDEyLjUgMTEuNTczQzEyLjUgMTAuNTg2OCA3LjUgMTAuNTg2OCA3LjUgMTEuNTczWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC45Ii8+Cjwvc3ZnPgo="
                ></img>
              </Popover>

              <Button
                type="primary"
                theme="solid"
                className={styles['cmt-btn']}
                disabled
              >
                发送
              </Button>
            </div>
            <hr className={styles['cmt-hr']} />
            <Select placeholder="请选择排序方式" style={{ width: 165 }}>
              <Select.Option value="abc">按点赞量排序</Select.Option>
              <Select.Option value="ulikecam">按评论量排序</Select.Option>
            </Select>
            <div className={styles['empty--comment']}>
              暂无评论
              <div className={styles['reload-list']}>点击刷新</div>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <SideSheet
        title={
          <div className={styles.header}>
            <div className={styles.title}>作品列表</div>
            <div className={styles['video-num']}>共11个视频</div>
          </div>
        }
        visible={visible}
        closable={false}
        onCancel={change}
        className={styles['item-drawer--sidesheet']}
      >
        <div className={styles['container--sidesheet']}>
          <div className={styles['main--sidesheet']}>
            <div
              className={cs(styles['item-container--sidesheet'], {
                [styles['selected--sidesheet']]: true
              })}
            >
              <div>
                <img
                  className={styles['cover--sidesheet']}
                  src="https://p11-sign.douyinpic.com/tos-cn-i-dy/cfa35b71590f4323be3eb511a0389422~noop.jpeg?x-expires=1702728000&amp;x-signature=mkGszN6gZnUrvmysgNGUHjeQfpk%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_images&amp;l=2023120220514053FDBE1741377893B19E"
                  alt="#今天长这样 #甜妹"
                ></img>
              </div>
              <div className={styles['video-info--sidesheet']}>
                <div className={styles['info-title--sidesheet']}>
                  <div className={styles['info-title-text--sidesheet']}>
                    #今天长这样 #甜妹
                  </div>
                </div>
                <div className={styles['video-sub-info--sidesheet']}>
                  <div className={styles['publish-time--sidesheet']}>
                    发布于2023年10月04日 14:02
                  </div>
                </div>
              </div>
              <div className={styles['comment-count--sidesheet']}>
                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi4xNzE0IDE0Ljg4NTFDMTcuOTU2NSAxMy4wODQzIDE5IDExLjIwODcgMTkgOS4wMjQ2OEMxOSA0LjU5MjczIDE0Ljk3MDkgMSA5Ljk5OTk3IDFDNS4wMjkxNyAxIDEgNC41OTI3MyAxIDkuMDI0ODFDMSAxMy40NTY5IDUuMTU5NTMgMTYuNDk5NSAxMC4xMzA0IDE2LjQ5OTVWMTguMTc1NEMxMC4xMzA0IDE4LjU0NTMgMTAuNTE0MiAxOC43ODM2IDEwLjg0IDE4LjYwODRDMTIuMDU3MiAxNy45NTM3IDE0LjU2NjkgMTYuNTAzNyAxNi4xNzE0IDE0Ljg4NTFaTTExLjMyODggOS4xNzkyOUMxMS4zMjg4IDkuOTI0MzkgMTAuNzI0OCAxMC41Mjg0IDkuOTc5NjYgMTAuNTI4NEM5LjIzNDU3IDEwLjUyODQgOC42MzA1NSA5LjkyNDM5IDguNjMwNTUgOS4xNzkyOUM4LjYzMDU1IDguNDM0MiA5LjIzNDU3IDcuODMwMTkgOS45Nzk2NiA3LjgzMDE5QzEwLjcyNDggNy44MzAxOSAxMS4zMjg4IDguNDM0MiAxMS4zMjg4IDkuMTc5MjlaTTUuNzM5ODIgMTAuNTI4NEM2LjQ4NDkxIDEwLjUyODQgNy4wODg5MyA5LjkyNDM5IDcuMDg4OTMgOS4xNzkyOUM3LjA4ODkzIDguNDM0MiA2LjQ4NDkxIDcuODMwMTkgNS43Mzk4MiA3LjgzMDE5QzQuOTk0NzMgNy44MzAxOSA0LjM5MDcxIDguNDM0MiA0LjM5MDcxIDkuMTc5MjlDNC4zOTA3MSA5LjkyNDM5IDQuOTk0NzMgMTAuNTI4NCA1LjczOTgyIDEwLjUyODRaTTE1LjU2OTIgOS4xNzkyOUMxNS41NjkyIDkuOTI0MzkgMTQuOTY1MiAxMC41Mjg0IDE0LjIyMDEgMTAuNTI4NEMxMy40NzUgMTAuNTI4NCAxMi44NzEgOS45MjQzOSAxMi44NzEgOS4xNzkyOUMxMi44NzEgOC40MzQyIDEzLjQ3NSA3LjgzMDE5IDE0LjIyMDEgNy44MzAxOUMxNC45NjUyIDcuODMwMTkgMTUuNTY5MiA4LjQzNDIgMTUuNTY5MiA5LjE3OTI5WiIgZmlsbD0iIzFDMUYyMyIgZmlsbC1vcGFjaXR5PSIwLjYiLz4KPC9zdmc+Cg=="></img>
                <span>0</span>
              </div>
            </div>
            <div className={styles['load-more--sidesheet']}>
              <div className={styles['loading-text--sidesheet']}>
                没有更多视频
              </div>
            </div>
          </div>
        </div>
      </SideSheet>
    </div>
  )
}

export default Comment
