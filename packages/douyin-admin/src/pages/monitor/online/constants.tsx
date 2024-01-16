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
      title: t['online.columns.id'],
      dataIndex: 'id',
      render: (value: string) => <Text copyable>{value}</Text>,
    },
    {
      title: t['online.columns.nickname'],
      dataIndex: 'nickname',
      render: (value: string) => <Text copyable>{value}</Text>,
    },
    {
      title: t['online.columns.ip'],
      dataIndex: 'ip',
    },
    {
      title: t['online.columns.location'],
      dataIndex: 'location',
    },
    {
      title: t['online.columns.system'],
      dataIndex: 'system',
    },
    {
      title: t['online.columns.browser'],
      dataIndex: 'browser',
    },

    {
      title: t['online.columns.time'],
      dataIndex: 'time',
      render: (x: number) =>
        dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: { time: number }, b: { time: number }) => b.time - a.time,
    },
    {
      title: t['online.columns.operations'],
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_: any, record: Record<string, any>) => (
        <Button
          type="text"
          size="small"
          style={{ color: '#F5222D' }}
          onClick={() => callback(record, 'remove')}
        >
          {t['online.columns.operations.remove']}
        </Button>
      ),
    },
  ]
}
