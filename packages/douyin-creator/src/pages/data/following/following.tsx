import styles from './style/following.module.scss'
import { Avatar, Button, Modal, Table } from '@douyinfe/semi-ui'
import { useEffect, useState } from 'react'
import defaultAvatar from '@/assets/default~120x256.png'
import { IconChevronLeft, IconChevronRight } from '@douyinfe/semi-icons'
const raw = [
  {
    nickname: '鞠婧祎',
    uid: 'dymwqks6ojca',
    avatar:
      'https://p9.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_f641f6aa9ed818630d8733310ee9ceac',
    signature: ''
  },
  {
    nickname: '赵露思',
    uid: '122048782',
    avatar:
      'https://p9.douyinpic.com/aweme/1080x1080/aweme-avatar/tos-cn-avt-0015_bc601ef2bf2e2e10a18325c426183525',
    signature: '微博：赵露思的微博'
  }
  // Add more raw data if needed
]
const Following = () => {
  const [dataSource, setData] = useState(raw)
  //是否显示modal
  const [visible, setVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(10)
  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    setVisible(false)
    setData(dataSource.filter((item) => item.uid))
  }
  const handleCancel = () => {
    setVisible(false)
  }
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  /**
   * 从数据源中根据提供的键删除记录。
   * @param {string} key - 要删除的记录的键。
   */
  const removeRecord = (record) => {
    setVisible(true)
    setSelectedRecord(record)
  }
  const columns = [
    {
      title: '头像/用户名称',
      dataIndex: 'user',
      render(text, record) {
        return (
          <>
            <Avatar
              size="medium"
              shape="circle"
              style={{
                backgroundImage: `url(${record.avatar}),url(${defaultAvatar}`,
                backgroundSize: 'cover'
              }}
            />

            <span
              style={{
                marginLeft: '8px',
                verticalAlign: 'top',
                color: 'rgb(28, 31, 35)',
                lineHeight: '40px'
              }}
            >
              {record.nickname}
            </span>
          </>
        )
      }
    },
    {
      title: '签名',
      dataIndex: 'signature'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => (
        <a
          style={{
            color: 'rgb(22, 24, 35)',
            fontWeight: 600
          }}
          onClick={() => removeRecord(record)}
        >
          取消关注
        </a>
      )
    }
  ]
  const fetchSourceData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  useEffect(() => {
    fetchSourceData()

    console.log('useEffect', currentPage)
  }, [currentPage])

  return (
    <div className={styles.container}>
      <div className={styles.title}>关注列表</div>

      <Table
        loading={loading}
        className={styles['table-semi']}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        renderPagination={(pagination) => {
          setTotalPages(pagination.total)
          setCurrentPage(pagination.currentPage)
          return null
        }}
      />
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Button
          icon={<IconChevronLeft />}
          theme="borderless"
          disabled={currentPage === 1}
          onClick={handlePrev}
        />
        <Button
          icon={<IconChevronRight />}
          theme="borderless"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        />
      </div>

      <Modal
        centered
        visible={visible}
        className={styles['modal-following']}
        content="确认取消关注？"
        header={null}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedRecord && (
          <>
            <Avatar
              size="medium"
              shape="circle"
              className={styles.avatar}
              style={{
                backgroundImage: `url(${selectedRecord.avatar}),url(${defaultAvatar}`,
                backgroundSize: 'cover'
              }}
            />
            <p>停止关注 @{selectedRecord.nickname}</p>
            <div className={styles['button-modal']}>
              <Button type="primary" onClick={handleCancel}>
                取消
              </Button>
              <Button type="primary" theme="solid" onClick={handleOk}>
                确认
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Following
