import { Select, Tooltip } from '@douyinfe/semi-ui'
import styles from './style/anchor-select.module.scss'
import RightIcon from '@/assets/icon/right-icon.svg?react'
import LeftIcon from '@/assets/icon/left-icon.svg?react'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
const AnchorSelect: React.FC = () => {
  const apiData = [
    { label: 1, value: '香港仔海滨公园' },
    { label: 2, value: '香港仔港湾' },
    { label: 3, value: '海怡半岛' },
    { label: 4, value: '香港特别行政区·南区' }
  ]

  const [loading, setLoading] = useState(false)
  const [list, setList] = useState(apiData)
  //地理位置
  const [address, setAddress] = useState('')
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current

      if (scrollContainer) {
        // 计算是否有内容溢出
        const isOverflowing =
          scrollContainer.scrollWidth > scrollContainer.clientWidth

        // 计算左右按钮是否应该显示
        const shouldShowLeftButton =
          scrollContainer.scrollLeft > 0 && isOverflowing
        const shouldShowRightButton =
          scrollContainer.scrollLeft <
            scrollContainer.scrollWidth - scrollContainer.clientWidth &&
          isOverflowing

        setShowLeftButton(shouldShowLeftButton)
        setShowRightButton(shouldShowRightButton)
      }
    }

    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      handleScroll() // 初始化时执行一次，确保初始状态正确
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, []) // 仅在组件挂载和卸载时执行

  const handleScroll = (direction) => {
    const scrollContainer = scrollContainerRef.current

    if (scrollContainer) {
      const scrollAmount = 200 // 调整滚动速度
      if (direction === 'left') {
        scrollContainer.scrollLeft -= scrollAmount
      } else if (direction === 'right') {
        scrollContainer.scrollLeft += scrollAmount
      }
    }
  }

  const handleItemClick = (item) => {
    // 处理子项点击事件
    console.log('Item clicked:', item)
    setAddress(item.value)
  }

  const handleSearch = (inputValue) => {
    setLoading(true)
    let result = []
    if (inputValue) {
      const length = Math.ceil(Math.random() * 100)
      result = Array.from({ length }, (_v, i) => {
        return {
          value: inputValue + i,
          label: `相近业务 ${inputValue}${i}`,
          type: i + 1
        }
      })
      setTimeout(() => {
        setLoading(false)
        setList(result)
      }, 1000)
    } else {
      setLoading(false)
    }
  }
  return (
    <div className={styles['anchor-part']}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p className={styles['title-main']}>添加标签</p>
        </div>

        <Tooltip
          position="topLeft"
          style={{ maxWidth: '450px' }}
          content="一个视频仅支持添加一个标签，标签包含位置、小程序"
        >
          <span className={styles.icon}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
      </div>
      <div className={styles['anchor-container']}>
        <Select defaultValue={'1'} className={styles['select']}>
          <Select.Option value="1">位置</Select.Option>
          <Select.Option value="2">小程序</Select.Option>
        </Select>

        <div className={styles['anchor-component']}>
          <Select
            showArrow={false}
            placeholder="请输入地理位置"
            showClear={true}
            style={{ width: '440px' }}
            value={address}
            optionList={list}
            remote
            filter
            loading={loading}
            onSearch={debounce(handleSearch, 1000)}
            onChange={(value: string) => setAddress(value)}
          />
        </div>
      </div>
      <div className={styles['sub-title-global']}>
        <div className={styles['recommend']}>
          <span className={styles['recommend-label']}>为你推荐：</span>
          <div className={styles['scroll-container']}>
            <div
              className={styles['left-scroll']}
              style={{ display: showLeftButton ? 'block' : 'none' }}
            >
              <LeftIcon onClick={() => handleScroll('left')} />
            </div>
            <div
              className={styles['right-scroll']}
              style={{ display: showRightButton ? 'block' : 'none' }}
            >
              <RightIcon onClick={() => handleScroll('right')} />
            </div>
            <div
              className={styles['scroll-content']}
              style={{ width: '100%' }}
              ref={scrollContainerRef}
            >
              <div className={styles['recommend-list']}>
                {apiData.map((item) => (
                  <span
                    key={item.label}
                    className={styles['recommend-list-item']}
                    onClick={() => handleItemClick(item)}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M6 6c.774 0 1.4-.663 1.4-1.48 0-.819-.628-1.48-1.4-1.48-.772 0-1.4.663-1.4 1.48S5.226 6 6 6zm0 5.5c-.758 0-4-4.432-4-6.769C2 2.394 3.79.5 6 .5s4 1.894 4 4.231C10 7.068 6.758 11.5 6 11.5z"
                        stroke="#000"
                      ></path>
                    </svg>
                    {item.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnchorSelect
