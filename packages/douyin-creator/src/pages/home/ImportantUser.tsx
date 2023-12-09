import React from 'react'
import styles from './style/important-user.module.scss'
import cs from 'classnames'
import Empty from '@/components/Empty'
import { Button } from '@douyinfe/semi-ui'
import { IconPlusCircle } from '@douyinfe/semi-icons'
interface IUserInfo {
  uid: string
  name: string
  avatar: string
  followers: string
  works: string
  yesterdayFollowers: string
  yesterdayWorks: string
}

const ImportantUser: React.FC<{ users: IUserInfo[] }> = ({ users }) => {
  return (
    <div
      className={cs(styles['follower-list'], {
        [styles.empty]: !users || users.length === 0
      })}
    >
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.uid} className={styles['user-container']}>
            <img
              className={styles['user-avatar']}
              src={user.avatar}
              alt={`${user.name}'s avatar`}
            />

            <div className={styles['user-detail']}>
              <div className={styles['user-info']}>
                <div className={styles['user-name']}>{user.name}</div>
                <div className={styles['delete-btn']}>删除</div>
              </div>

              <div className={styles['user-stats']}>
                <div className={styles['user-fans']}>
                  粉丝 <span className={styles.number}>{user.followers}</span>
                </div>
                <div className={styles.line}></div>
                <div className={styles['user-works']}>
                  作品 <span className={styles.number}>{user.works}</span>
                </div>
                <div className={styles['user-yesterday']}>
                  昨日
                  <span
                    className={cs(styles.number, {
                      [styles.new]: user.yesterdayFollowers !== '0'
                    })}
                  >
                    {user.yesterdayFollowers}
                  </span>
                </div>
                <div className={styles.line}></div>
                <div className={styles['user-yesterday']}>
                  昨日
                  <span
                    className={cs(styles.number, {
                      [styles.new]: user.yesterdayWorks !== '0'
                    })}
                  >
                    {user.yesterdayWorks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty
          text="你可以添加10个3000粉丝以上重点关心的抖音号"
          children={
            <Button
              type="primary"
              theme="solid"
              icon={<IconPlusCircle />}
              style={{
                marginTop: '16px'
              }}
            >
              添加关心
            </Button>
          }
        />
      )}
    </div>
  )
}

export default ImportantUser
