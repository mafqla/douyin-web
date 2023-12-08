import React from 'react'
import styles from './style/important-user.module.scss'
import cs from 'classnames'
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
    <div className={styles['follower-list']}>
      {users.map((user) => (
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
      ))}
    </div>
  )
}

export default ImportantUser
