import React from 'react'
import { Button, Message, Popconfirm, Typography } from '@arco-design/web-react'
import dayjs from 'dayjs'
import apis from '@/api/apis'
const { Text } = Typography
export const Status = ['成功', '失败']

const UserTypes = ['固定角色', '自定义角色']

export function getColumns(
  t: any,
  callback: (record: Record<string, any>, type: string) => Promise<void>
) {
  //调用删除接口
  const deleteRole = async (id: number) => {
    const res = await apis.deleteRole(id)
    if (res.code === 200) {
      Message.success(res.msg)
    } else {
      Message.error(res.msg)
    }
  }
  return [
    {
      title: t['role.form.id'],
      dataIndex: 'id'
    },
    {
      title: t['role.form.code'],
      dataIndex: 'code',
      render: (value: string) => <Text copyable>{value}</Text>
    },
    {
      title: t['role.form.name'],
      dataIndex: 'name',
      render: (value: string) => <Text copyable>{value}</Text>
    },
    {
      title: t['role.form.type'],
      dataIndex: 'type',
      render: (value: number) => UserTypes[value]
    },
    {
      title: t['role.form.creater'],
      dataIndex: 'creater'
    },
    {
      title: t['role.form.updater'],
      dataIndex: 'updater'
    },
    {
      title: t['role.form.createTime'],
      dataIndex: 'createTime',
      sorter: (a, b) => dayjs(b.createTime).diff(dayjs(a.createTime))
    },
    {
      title: t['role.form.updateTime'],
      dataIndex: 'updateTime',
      sorter: (a, b) => dayjs(b.updateTime).diff(dayjs(a.updateTime))
    },

    {
      title: t['role.operations'],
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_: any, record: Record<string, any>) => (
        <>
          <Button
            type="text"
            size="small"
            onClick={() => callback(record, 'edit')}
          >
            {t['role.operations.edit']}
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => callback(record, 'assign')}
          >
            {t['role.operations.assign']}
          </Button>
          {record.type === 1 && (
            <Popconfirm
              focusLock
              title={t['role.operations.delete']}
              content={t['role.operations.delete.confirm']}
              onOk={() => deleteRole(record.id)}
            >
              <Button
                type="text"
                size="small"
                style={{ color: '#F5222D' }}
                onClick={() => callback(record, 'delete')}
              >
                {t['role.operations.delete']}
              </Button>
            </Popconfirm>
          )}
        </>
      )
    }
  ]
}
