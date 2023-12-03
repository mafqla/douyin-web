import { useEffect, useState } from 'react'
import styles from './style/index.module.scss'
import { Badge, Dropdown } from '@douyinfe/semi-ui'
import defaultLogo from '@/assets/default~120x256.png'
const Header = () => {
  //1.头像地址
  const [avatar, setAuatar] = useState(
    'https://p6.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?from=2956013662'
  )

  const [headerBg, setHeaderBg] = useState('rgba(var(--semi-grey-0),0)')
  const listenScrollEvent = () => {
    if (window.scrollY > 100) {
      setHeaderBg('rgba(var(--semi-grey-0),1)')
    } else {
      setHeaderBg('rgba(var(--semi-grey-0),0)')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)
    return () => window.removeEventListener('scroll', listenScrollEvent)
  }, [])

  return (
    <div className={styles.header} style={{ backgroundColor: headerBg }}>
      <div className={styles.container}>
        <div className={styles['logo-wrapper']}>
          <picture className={styles['logo-picture']}>
            <source
              srcSet="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABmCAMAAAAOARRQAAAAt1BMVEVHcEz+LFX/KFKjf43/LFQC7uUA+fAA++//LFT/K1X/K1UbXGIqKTb/K1UXdXkA+vAfRE0A+e8Sk5MA+vH/KlUA+fAA+e8A+e9YJzr/LFT/K1QfSlL/LFOlKkaBKEEIyMMA+/EA+u8lJjEA9+0Ti43kK1ANrKr/K1T/K1QZY2gKvbj/K1QZTlgE2tTHKFD/LFUA+vAlJjIOqqmSKUM7JjXjK1BZJzqmKUYjMz5zKD7FKkvyK1OEKEEp0pvHAAAAL3RSTlMA7yAQv/XfQICf3/3vYPmA/sT5nzBuoCDrQHDkUO3p948w2rLp5u+QsMrazyifQJoRiR0AAAQWSURBVGje7drZeqIwFADgAIKAuONWt6q1dpmZGEVR6/s/10QBiWELS5ibObf98G8OSTg5AEDqqG6paAIe8a+YbjnMih8zr/kxruCYcGF2iIg1hPCFP2NjRuXPHDGj8WduWfsugdlDKEj8GesHwhF/Bs0g3JTAGGsolMCgpVB01kIZnLZKGQyaFjycCAZNdakMBu03pTBo9qcUBhm/SmFQ6/egDAa15G61BAaddlulW13wZhBqyPjvcrv9ypdBrd29EmlzZlyIP4NvUWO3KoG5VQjfFU2d8GdgrkrkP1MEY5XD7A9WKQyEtpWXGSyqOBZSLAMPs+zMoNdVvLOSEs9gaG9lYRZNhTySJTGqilM3TMtU29TJL5EB4gcu2O2zxc4EEMyIUgIDQF2/Z++yPx+PViIjvZK/L893jZaBEL5G0OIZDyIimqkS90R+r53cH7tdVEliABhpAhPTJJC3k/9jjAyOiaYnMl0faTzNT3YGh1nfVIQYxlc6J5SdcUI0R2K8Io/pRZ2BiYrHFHs/IX7M4+53QjbcwpiBp7whnowSpxTGNGMyVhzjpewdcWX67kym59jxatv2/mwVw3iDaT13SewfcofKz/RDboxlU/ttfsaZZvKSVA6waKbnDKYRoQgVTdMqem5m5QwmVBFUr38h5WXkwGAeiiol12mMjNNblg3/2rOL6CZLOcjI9AIr0x2MLoICmVc6Z+dIJQ/jFExEzi4OI4JCmfuqmROXOotfBcUyMrUDWJEpy8Xcc/ZJ1b8RZUlepkYzJhdmSTECABzuzdNO89goI9ZY9pmmIGp1ajGPjB31XoWNWdGMHc0oNHNJtQsobK9kFluaua+xF9Y97Ym5/YsfMY/ZwBqrszALaqbdh6PH1AwNevJPmJ83z9WGHb6jKYHKxCkY2Dr33eddwJlsamQxPw88Mtga99VgUWsdhMjKlMiZ4Wx/bIWNhLP2RRWClk0NR/KOPzK9aiKmS2gFTT6jnRj+Cj/7jgM5Y327KlFXe814r0cu9fxeAVkzuo9Zk/VA0A89cTS22/aq212RjZUOCgxGZ1Vud6dthDX96X5Hh3pFCNO9kW4+PXHoHvnj7FtDITWjmOKA2w7MNSdqPjR/7hW40yxdD3Agh0wCp0de6+xwNOikXmH6wdw20DlKE9ZPhsHcb89nGsW9MYKYkgF92UitZPnwof+VWsn09rb5mVLRxSwM6I1ZlKGnCCbIGMtk5fo4LtazKkCcJUDDSwEKdtbnGMSY+iffPAreRrVD1IiGU78hoZsgZ6hQnw4Da8i4XsgugQhyh6jjnFymw6NrGcfzdE22IoSCPkfyWtfC4XAQBLrhoRX3DUKgR/4YiSaCImPyEYJU1KK/EMKTbrL5JghdexEBrzBH9VtMzKzD+AscXhCcPlJ0LgAAAABJRU5ErkJggg=="
              media="(max-width: 1080px)"
            ></source>
            <img
              className={styles['logo']}
              src="data:image/png;base64,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"
              alt="logo"
            />
          </picture>
        </div>
      </div>
      <div className={styles.footer}>
        <Badge dot position="rightTop" type="primary">
          <div className={styles['container-1']}>
            <div className={styles['mask--logo']}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M10.5 5.25c0-1.297-.706-2.43-1.754-3.034a1.75 1.75 0 00-3.492 0A3.499 3.499 0 003.5 5.25s0 1.167-.292 2.333c-.165.661-.985 1.696-1.666 2.47-.343.39-.07 1.03.45 1.03h10.016c.52 0 .793-.64.45-1.03-.681-.774-1.501-1.809-1.667-2.47C10.5 6.417 10.5 5.25 10.5 5.25zM8.75 11.667a1.75 1.75 0 11-3.5 0h3.5z"
                  fill="#252632"
                  fillOpacity="0.6"
                ></path>
              </svg>
            </div>
            <div className={styles['title--logo']}>通知</div>
          </div>
        </Badge>

        <div className={styles['container-1']}>
          <div className={styles['mask--logo']}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.333 1.167c-.644 0-1.167.522-1.167 1.166V5.25c0 .644.523 1.167 1.167 1.167H5.25c.644 0 1.167-.523 1.167-1.167V2.333c0-.644-.523-1.166-1.167-1.166H2.333zM2.333 7.583c-.644 0-1.167.523-1.167 1.167v2.917c0 .644.523 1.166 1.167 1.166H5.25c.644 0 1.167-.522 1.167-1.166V8.75c0-.644-.523-1.167-1.167-1.167H2.333zM7.583 8.75c0-.644.522-1.167 1.167-1.167h2.916c.645 0 1.167.523 1.167 1.167v2.917c0 .644-.522 1.166-1.167 1.166H8.75a1.167 1.167 0 01-1.167-1.166V8.75z"
                fill="#252632"
                fillOpacity="0.6"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.75 1.167c-.645 0-1.167.522-1.167 1.166V5.25c0 .644.522 1.167 1.167 1.167h2.916c.645 0 1.167-.523 1.167-1.167V2.333c0-.644-.522-1.166-1.167-1.166H8.75zm0 1.166h2.916V5.25H8.75V2.333z"
                fill="#252632"
                fillOpacity="0.6"
              ></path>
            </svg>
          </div>
          <div className={styles['title--logo']}>网址</div>
        </div>
        <div className={styles['container-1']}>
          <div className={styles['mask--logo']}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.376.583h-2.22v4.244h.001v4.581h-.001a1.85 1.85 0 01-1.848 1.786 1.85 1.85 0 01-1.85-1.853A1.85 1.85 0 015.914 7.59V5.31A4.072 4.072 0 001.24 9.34a4.072 4.072 0 004.068 4.077A4.072 4.072 0 009.376 9.34V4.944c.871.626 1.939.995 3.093.995V3.716a3.096 3.096 0 01-3.093-3.1V.584z"
                fill="#252632"
                fillOpacity="0.6"
              ></path>
            </svg>
          </div>
          <div className={styles['title--logo']}>抖音</div>
        </div>
        <div className={styles.divider}></div>
        <Dropdown
          render={
            <Dropdown.Menu>
              <Dropdown.Item>身份认证</Dropdown.Item>
              <Dropdown.Item>账号切换</Dropdown.Item>
              <Dropdown.Item type="primary">退出账号</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <div
            className={styles['avatar--1']}
            style={{
              backgroundImage: `url(${avatar}), url(${defaultLogo})`,
              backgroundSize: 'cover'
            }}
          ></div>
        </Dropdown>
      </div>
    </div>
  )
}

export default Header
