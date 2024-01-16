import React from 'react'
import { Button, Typography, Badge } from '@arco-design/web-react'
import dayjs from 'dayjs'
const { Text } = Typography

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: t['system.columns.id'],
      dataIndex: 'id',
      render: (value: string) => <Text copyable>{value}</Text>
    },
    {
      title: t['system.columns.status'],
      dataIndex: 'status',
      render: (x: string) => {
        return <Badge status="success" text={x}></Badge>
      }
    },
    {
      //请求方式
      title: t['system.columns.method'],
      dataIndex: 'method'
    },
    {
      //请求路径
      title: t['system.columns.path'],
      dataIndex: 'path'
    },
    {
      title: t['system.columns.ip'],
      dataIndex: 'ip'
    },
    {
      title: t['system.columns.location'],
      dataIndex: 'location'
    },
    {
      title: t['system.columns.system'],
      dataIndex: 'system'
    },
    {
      title: t['system.columns.browser'],
      dataIndex: 'browser'
    },
    //耗时
    {
      title: t['system.columns.spend'],
      dataIndex: 'spend',
      render: (x: number) => x + 'ms',
      sorter: (a: { spend: number }, b: { spend: number }) => b.spend - a.spend
    },

    {
      title: t['system.columns.time'],
      dataIndex: 'time',
      render: (x: number) =>
        dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: { time: number }, b: { time: number }) => b.time - a.time
    },
    {
      title: t['system.columns.operations'],
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_: any, record: Record<string, any>) => (
        <Button
          type="text"
          size="small"
          onClick={() => callback(record, 'detail')}
        >
          {t['system.columns.operations.detail']}
        </Button>
      )
    }
  ]
}
