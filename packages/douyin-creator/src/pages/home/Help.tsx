import React, { useEffect, useRef, useState } from 'react'
import './style/help.scss'

const Help: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imgSrc =
    '//lf6-cdn-tos.bytescm.com/obj/static/douyin_creator/fe/pc/static/image/default-banner.f2b92006.png'

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 59)
      }
    }

    const resizeObserver = new ResizeObserver(updateContainerWidth)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', updateContainerWidth)
    updateContainerWidth() // Initial width

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateContainerWidth)
    }
  }, [])
  return (
    <div ref={containerRef} className="help">
      <div className="slick-slider slick-radius slick-initialized">
        <div className="slick-list">
          <div
            className="slick-track"
            style={{
              width: containerWidth ? `${containerWidth}px` : 'auto',
              opacity: 1,
              transform: 'translate3d(0px, 0px, 0px)'
            }}
          >
            <div
              data-index="0"
              className="slick-slide slick-active slick-current"
              style={{
                outline: 'none',
                width: containerWidth ? `${containerWidth}px` : 'auto'
              }}
            >
              <div>
                <img
                  src={imgSrc}
                  className="XFnKs"
                  tabIndex={-1}
                  style={{ width: '100%', display: 'inline-block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="help-title"
        style={{
          width: containerWidth ? `${containerWidth}px` : 'auto'
        }}
      >
        抖音创作服务平台·致力于全面的服务
      </div>
    </div>
  )
}

export default Help
