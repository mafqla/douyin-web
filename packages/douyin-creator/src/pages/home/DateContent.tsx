import styles from './style/date-content.module.scss'
import React from 'react'

interface DateRangeCardProps {
  title: string
  dateRange: string
  price: string
  isShowPrice: boolean
}

const DateContent: React.FC<{ isShow: boolean }> = ({ isShow }) => {
  const DateRangeCard: React.FC<DateRangeCardProps> = ({
    title,
    dateRange,
    price,
    isShowPrice
  }) => {
    return (
      <div className={styles['date-range-card']}>
        <div className={styles['date-header']}>
          <span className={styles['date-label']}>{title}</span>
          <span className={styles['date-range']}>{dateRange}</span>
        </div>
        <div className={styles['price-info']}>
          <span className={styles['currency-symbol']}>¥</span>
          <span className={styles['price-graph']}>
            {isShowPrice && price}
            {!isShowPrice && (
              <svg
                width="41"
                height="6"
                viewBox="0 0 41 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.19727 4.01562L0.595703 4.94336L0 4.01562L1.66016 3L0 1.98438L0.595703 1.05664L2.19727 1.98438V0.0410156H3.39844V1.98438L5 1.05664L5.5957 1.98438L3.93555 3L5.5957 4.01562L5 4.94336L3.39844 4.01562V5.95898H2.19727V4.01562Z"
                  fill="#252632"
                ></path>
                <path
                  d="M9.24805 4.01562L7.64648 4.94336L7.05078 4.01562L8.71094 3L7.05078 1.98438L7.64648 1.05664L9.24805 1.98438V0.0410156H10.4492V1.98438L12.0508 1.05664L12.6465 1.98438L10.9863 3L12.6465 4.01562L12.0508 4.94336L10.4492 4.01562V5.95898H9.24805V4.01562Z"
                  fill="#252632"
                ></path>
                <path
                  d="M16.2988 4.01562L14.6973 4.94336L14.1016 4.01562L15.7617 3L14.1016 1.98438L14.6973 1.05664L16.2988 1.98438V0.0410156H17.5V1.98438L19.1016 1.05664L19.6973 1.98438L18.0371 3L19.6973 4.01562L19.1016 4.94336L17.5 4.01562V5.95898H16.2988V4.01562Z"
                  fill="#252632"
                ></path>
                <path
                  d="M23.3496 4.01562L21.748 4.94336L21.1523 4.01562L22.8125 3L21.1523 1.98438L21.748 1.05664L23.3496 1.98438V0.0410156H24.5508V1.98438L26.1523 1.05664L26.748 1.98438L25.0879 3L26.748 4.01562L26.1523 4.94336L24.5508 4.01562V5.95898H23.3496V4.01562Z"
                  fill="#252632"
                ></path>
                <path
                  d="M30.4004 4.01562L28.7988 4.94336L28.2031 4.01562L29.8633 3L28.2031 1.98438L28.7988 1.05664L30.4004 1.98438V0.0410156H31.6016V1.98438L33.2031 1.05664L33.7988 1.98438L32.1387 3L33.7988 4.01562L33.2031 4.94336L31.6016 4.01562V5.95898H30.4004V4.01562Z"
                  fill="#252632"
                ></path>
                <path
                  d="M37.4512 4.01562L35.8496 4.94336L35.2539 4.01562L36.9141 3L35.2539 1.98438L35.8496 1.05664L37.4512 1.98438V0.0410156H38.6523V1.98438L40.2539 1.05664L40.8496 1.98438L39.1895 3L40.8496 4.01562L40.2539 4.94336L38.6523 4.01562V5.95898H37.4512V4.01562Z"
                  fill="#252632"
                ></path>
              </svg>
            )}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['data-conent']}>
      <DateRangeCard
        title="昨日"
        dateRange="12-05"
        price="0.00"
        isShowPrice={isShow}
      />
      <DateRangeCard
        title="近七日"
        dateRange="11-29~12-05"
        price="0.00"
        isShowPrice={isShow}
      />
      <DateRangeCard
        title="近30日"
        dateRange="11-06~12-05"
        price="0.00"
        isShowPrice={isShow}
      />
    </div>
  )
}

export default DateContent
