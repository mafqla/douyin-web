import React, { useState } from 'react'
import './style/video-container.scss'
import { Pagination } from '@douyinfe/semi-ui'

interface VideoProps {
  coverSrc: string
  userName: string
  title: string
}

const VideoItem: React.FC<VideoProps> = ({ coverSrc, userName, title }) => (
  <div className="video-content" style={{ width: '159px' }}>
    <div style={{ position: 'relative' }}>
      <img className="cover" src={coverSrc} alt="Video Cover" />
      <div className="video-user">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clipPath="url(#douyin_logo_svg__clip0_5016_3227)">
            <rect width="16" height="16" rx="3.375" fill="#000"></rect>
            <path
              d="M6.837 6.723V6.27a3.546 3.546 0 00-4.022 3.51c0 1.195.599 2.258 1.511 2.9a3.516 3.516 0 01-.95-2.41 3.555 3.555 0 013.461-3.547z"
              fill="#00FAF0"
            ></path>
            <path
              d="M6.92 11.875c.868 0 1.58-.692 1.61-1.554V2.616h1.41a2.497 2.497 0 01-.044-.491H7.971V9.83a1.615 1.615 0 01-1.611 1.554c-.271 0-.53-.07-.75-.189.296.415.775.68 1.31.68zM12.577 5.232v-.427a2.654 2.654 0 01-1.46-.434c.377.427.887.736 1.46.861z"
              fill="#00FAF0"
            ></path>
            <path
              d="M11.124 4.37a2.668 2.668 0 01-.661-1.754h-.516c.138.73.573 1.359 1.177 1.755zM6.36 8.157c-.895 0-1.618.724-1.618 1.617 0 .622.352 1.157.868 1.428a1.626 1.626 0 01-.308-.944c0-.893.724-1.616 1.617-1.616.164 0 .328.025.479.075V6.754a3.984 3.984 0 00-.479-.031h-.082v1.51a1.494 1.494 0 00-.478-.076z"
              fill="#FE2C55"
            ></path>
            <path
              d="M12.577 5.232V6.73c-1 0-1.92-.32-2.675-.861v3.906a3.546 3.546 0 01-3.543 3.541c-.755 0-1.454-.239-2.026-.641a3.545 3.545 0 002.592 1.132 3.546 3.546 0 003.544-3.542V6.358c.755.541 1.68.862 2.674.862V5.295a3.321 3.321 0 01-.566-.063z"
              fill="#FE2C55"
            ></path>
            <path
              d="M9.902 9.774V5.868c.755.54 1.68.861 2.675.861V5.232a2.712 2.712 0 01-1.46-.861 2.647 2.647 0 01-1.171-1.755h-1.41v7.705a1.615 1.615 0 01-1.61 1.554c-.542 0-1.02-.264-1.31-.673a1.616 1.616 0 01-.868-1.428c0-.893.723-1.617 1.617-1.617.164 0 .327.025.478.076v-1.51a3.543 3.543 0 00-3.455 3.535c0 .931.359 1.78.95 2.41a3.527 3.527 0 002.027.64 3.54 3.54 0 003.537-3.534z"
              fill="#fff"
            ></path>
          </g>
          <defs>
            <clipPath id="douyin_logo_svg__clip0_5016_3227">
              <rect width="16" height="16" rx="8" fill="#fff"></rect>
            </clipPath>
          </defs>
        </svg>
        <span className="name">{userName}</span>
      </div>
    </div>
    <div className="title">{title}</div>
  </div>
)

const VideoContainer: React.FC = () => {
  const generateApiResponse = (count) => {
    const apiResponse = []
    const baseCoverSrc =
      '//lf-cdn-tos.bytescm.com/obj/static/douyin-creator-content/micro/imgs/video_cover.229fb2a5.png'
    const baseUserName = '抖音原创保护中心'

    for (let i = 1; i <= count; i++) {
      apiResponse.push({
        coverSrc: baseCoverSrc,
        userName: baseUserName,
        title: `视频${i}标题`
      })
    }

    return apiResponse
  }

  const apiResponse = generateApiResponse(40)
  const [page, setPage] = useState(1)
  const pageSize = 4
  function onPageChange(currentPage) {
    setPage(currentPage)
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return (
    <div className="video-container">
      <div className="video-wrapper">
        {apiResponse.slice(startIndex, endIndex).map((video, index) => (
          <VideoItem key={index} {...video} />
        ))}
      </div>

      <Pagination
        total={apiResponse.length}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default VideoContainer
