import React from 'react'
import { Button, Typography, Badge } from '@arco-design/web-react'
import dayjs from 'dayjs'
const { Text } = Typography

export const Status = ['成功', '失败']

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  return [
    {
      title: t['operation.columns.id'],
      dataIndex: 'id',
      render: (value: string) => <Text copyable>{value}</Text>
    },

    {
      title: t['operation.columns.time'],
      dataIndex: 'time',
      render: (x: number) =>
        dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: { time: number }, b: { time: number }) => b.time - a.time
    },
    {
      title: t['operation.columns.content'],
      dataIndex: 'content'
    },
    {
      title: t['operation.columns.module'],
      dataIndex: 'module'
    },
    {
      title: t['operation.columns.nickname'],
      dataIndex: 'nickname',
      render: (value: string) => <Text copyable>{value}</Text>
    },
    {
      title: t['operation.columns.status'],
      dataIndex: 'status',
      render: (x) => {
        if (x === 1) {
          return <Badge status="error" text={Status[x]}></Badge>
        }
        return <Badge status="success" text={Status[x]}></Badge>
      }
    },
    {
      title: t['operation.columns.ip'],
      dataIndex: 'ip'
    },
    {
      title: t['operation.columns.location'],
      dataIndex: 'location'
    },
    {
      title: t['operation.columns.system'],
      dataIndex: 'system'
    },
    {
      title: t['operation.columns.browser'],
      dataIndex: 'browser'
    },

    {
      title: t['operation.columns.operations'],
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_: any, record: Record<string, any>) => (
        <Button
          type="text"
          size="small"
          style={{ color: '#F5222D' }}
          onClick={() => callback(record, 'remove')}
        >
          {t['operation.columns.operations.remove']}
        </Button>
      )
    }
  ]
}
