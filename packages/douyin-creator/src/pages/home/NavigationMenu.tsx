import React from 'react'
import styles from './style/navigation-menu.module.scss'
import cs from 'classnames'

interface IMenu {
  src: string
  alt: string
  label: string
}
const NavigationMenu: React.FC<{ menus: IMenu[]; className?: string }> = ({
  menus,
  className
}) => {
  return (
    <div
      className={cs(
        styles['navigation-container'],
        className && styles['navigation-modal']
      )}
    >
      {menus.map((item, index) => (
        <div key={index} className={styles['navigation-item']}>
          <img
            src={item.src}
            alt={item.alt}
            className={styles['navigation-img']}
          />
          <span className={styles['navigation-label']}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default NavigationMenu
