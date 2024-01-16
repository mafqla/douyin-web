import React, { useState, useEffect, useMemo } from 'react'
import {
  Table,
  Card,
  PaginationProps,
  Typography,
} from '@arco-design/web-react'
import axios from 'axios'
import useLocale from '@/utils/useLocale'
import OnlineForm from './form'
import locale from './locale'
import './mock'
import { getColumns } from './constants'

const { Title } = Typography
export const ContentType = ['图文', '横版短视频', '竖版短视频']
export const FilterType = ['规则筛选', '人工']

function Online() {
  const t = useLocale(locale)

  const tableCallback = async (record, type) => {
    console.log(record, type)
  }

  const columns = useMemo(() => getColumns(t, tableCallback), [t])

  const [data, setData] = useState([])
  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  })
  const [loading, setLoading] = useState(true)
  const [formParams, setFormParams] = useState({})

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)])

  function fetchData() {
    const { current, pageSize } = pagination
    setLoading(true)
    axios
      .get('/online', {
        params: {
          page: current,
          pageSize,
          ...formParams,
        },
      })
      .then((res) => {
        setData(res.data.list)
        setPatination({
          ...pagination,
          current,
          pageSize,
          total: res.data.total,
        })
        setLoading(false)
      })
  }

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize,
    })
  }

  function handleSearch(params) {
    setPatination({ ...pagination, current: 1 })
    setFormParams(params)
  }

  return (
    <Card>
      <Title heading={6}>{t['online']}</Title>
      <OnlineForm onSearch={handleSearch} />
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
        
      />
    </Card>
  )
}

export default Online
