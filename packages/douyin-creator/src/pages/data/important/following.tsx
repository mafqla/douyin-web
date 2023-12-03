import styles from './style/following.module.scss'
import { Button, Modal, Popover, Select, Table, Toast } from '@douyinfe/semi-ui'
import { IconAlertCircle, IconPlus } from '@douyinfe/semi-icons'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

const raw = [
  {
    key: '1',
    user: {
      nickname: '鞠婧祎',
      uid: 'dymwqks6ojca'
    },
    //发布内容数/昨日新增
    contentCount: '64/0',
    //粉丝数/昨日新增
    followerCount: '931.09w/1908',
    //30天获赞/昨日新增
    likesCount: '-'
  },
  {
    key: '2',
    user: {
      nickname: '章若楠',
      uid: '122048782'
    },
    //发布内容数/昨日新增
    contentCount: '124/0',
    //粉丝数/昨日新增
    followerCount: '1537.8w/1.05w',
    //30天获赞/昨日新增
    likesCount: '1783.3w/17.09w'
  }
]
const Following = () => {
  const [dataSource, setData] = useState(raw)

  /**
   * 从数据源中根据提供的键删除记录。
   * @param {string} key - 要删除的记录的键。
   */
  const removeRecord = (key) => {
    const newDataSource = [...dataSource]
    if (key != null) {
      Modal.confirm({
        title: '确定要删除该账号吗？',
        content: '删除后，你将不能继续查看该用户的公开信息',
        onOk: () => {
          //todo: 删除数据 从后端删除 50-55行为模拟
          const idx = newDataSource.findIndex((data) => data.key === key)

          if (idx > -1) {
            newDataSource.splice(idx, 1)
            setData(newDataSource)
          }
        }
      })
    }
  }
  const columns = [
    {
      title: () => {
        return (
          <div className={styles['custom-head']}>
            昵称/抖音号
            <Popover
              position="rightTop"
              showArrow
              content={
                <div className={styles['custom-head-tips']}>
                  私密用户数据展示为'-'
                </div>
              }
              style={{
                transformOrigin: '0% 50%',
                padding: '8px 12px',
                backgroundColor: 'rgb(196, 196, 196)'
              }}
            >
              <IconAlertCircle
                className={styles['icon-circle']}
                size="small"
                style={{ color: '#c4c4c4' }}
              />
            </Popover>
          </div>
        )
      },
      dataIndex: 'user',
      render(text) {
        return (
          <div style={{ fontSize: '14px', lineHeight: '20px' }}>
            <p style={{ margin: 0, color: 'rgb(28, 31, 35)', fontWeight: 600 }}>
              {text.nickname}
            </p>
            <p style={{ margin: 0 }}>{text.uid}</p>
          </div>
        )
      }
    },
    {
      title: () => {
        return (
          <div className={styles['custom-head']}>
            发布内容数/昨日新增
            <Popover
              position="bottom"
              showArrow
              content={
                <div className={styles['custom-head-tips']}>
                  <div>
                    <p>发布内容数：用户发布的作品总量</p>
                    <p>昨日新增：用户昨日（0-24h）发布的作品数量</p>
                  </div>
                </div>
              }
              style={{
                transformOrigin: '0% 50%',
                padding: '8px 12px',
                backgroundColor: 'rgb(196, 196, 196)'
              }}
            >
              <IconAlertCircle
                className={styles['icon-circle']}
                size="small"
                style={{ color: '#c4c4c4' }}
              />
            </Popover>
          </div>
        )
      },
      dataIndex: 'contentCount'
    },
    {
      title: '粉丝数/昨日新增',
      dataIndex: 'followerCount'
    },
    {
      title: () => {
        return (
          <div className={styles['custom-head']}>
            30天获赞/昨日新增
            <Popover
              position="bottom"
              showArrow
              content={
                <div className={styles['custom-head-tips']}>
                  设置了点赞数据不可见的用户该列数据展示为 ‘-’
                </div>
              }
              style={{
                transformOrigin: '0% 50%',
                padding: '8px 12px',
                backgroundColor: 'rgb(196, 196, 196)'
              }}
            >
              <IconAlertCircle
                style={{ color: '#c4c4c4' }}
                className={styles['icon-circle']}
                size="small"
              />
            </Popover>
          </div>
        )
      },
      dataIndex: 'likesCount'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record) => (
        <a
          style={{
            color: 'rgb(254, 44, 85)',
            fontWeight: 600
          }}
          onClick={() => removeRecord(record.key)}
        >
          删除
        </a>
      )
    }
  ]

  const [visible, setVisible] = useState(false)
  const showDialog = () => {
    setVisible(true)
  }
  const handleOk = () => {
    setVisible(false)
    console.log(value)
    console.log('Ok button clicked')
    //todo: 根据value从后端获取raw数据
  }
  const handleCancel = () => {
    setVisible(false)
    setValue('')
  }
  const handleAfterClose = () => {
    setValue('')
  }
  // 多选框
  const [loading, setLoading] = useState(false)
  const optionList = []
  const [list, setList] = useState(optionList)
  const [value, setValue] = useState('')
  const [max, setMax] = useState(10) // -1
  const [add, setAdd] = useState(0) // +1

  const handleMultipleChange = (newValue) => {
    if (value.length > 9) {
      Toast.error('已添加10个账号，暂不支持继续添加')
    } else {
      setValue(newValue)
    }
  }

  const handleSearch = (inputValue) => {
    setLoading(true)
    let result = []
    if (inputValue) {
      const length = Math.ceil(Math.random() * 100)
      result = Array.from({ length }, (v, i) => {
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

  //监听value的变化
  useEffect(() => {
    if ((value.length < 10, value.length > 0)) {
      setAdd(value.length)
      setMax(10 - value.length)
    }
  }, [value.length])

  return (
    <div className={styles.container}>
      <div className={styles.title}>重点关心</div>
      <div className={styles['tip-header']}>
        <p className={styles['tip-text']}>
          你当前已添加<strong>{add}</strong>个账号，还可以添加
          <strong>{max}</strong>
          个账号
        </p>
        <Button
          type="primary"
          icon={<IconPlus />}
          className={styles.add}
          onClick={showDialog}
        >
          现在添加
        </Button>
        <p className={styles['tip-text']} style={{ marginLeft: '5px' }}>
          仅支持添加3000粉丝以上抖音号
        </p>
      </div>
      {dataSource.length > 0 && (
        <Table
          className={styles['table-semi']}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      )}
      {dataSource.length === 0 && (
        <div>
          <span
            className={styles['empty-data']}
            style={{ margin: '100px 0px' }}
          >
            <img src="//p3.douyinpic.com/aweme-server-static-resource/null-pic.1633680636984.png~tplv-noop.image" />
            暂无数据
          </span>
        </div>
      )}
      <Modal
        title="添加账号"
        visible={visible}
        onOk={handleOk}
        afterClose={handleAfterClose}
        onCancel={handleCancel}
        closeOnEsc={true}
        centered
      >
        <p className={styles['tip-text']}>
          你当前已添加<strong>{add}</strong>个账号，还可以添加
          <strong>{max}</strong>
          个账号
        </p>
        <Select
          style={{ width: '100%' }}
          filter
          remote
          onChangeWithObject
          multiple
          value={value}
          onSearch={debounce(handleSearch, 1000)}
          optionList={list}
          loading={loading}
          onChange={handleMultipleChange}
          emptyContent={'暂无数据'}
          showArrow={false}
          placeholder="请输入希望关注的抖音号或抖音昵称，按回车键可输入多个"
        ></Select>
        <p className={styles['tip-text']} style={{ marginLeft: '5px' }}>
          仅支持添加3000粉丝以上抖音号，抖音号查询路径：抖音APP-他人主页-右上角点击“···”
        </p>
      </Modal>
    </div>
  )
}

export default Following
