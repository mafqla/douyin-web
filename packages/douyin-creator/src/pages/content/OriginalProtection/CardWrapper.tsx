import { IconChevronRight } from '@douyinfe/semi-icons'
import styles from './style/card-wrapper.module.scss'
import cs from 'classnames'

const CardWrapper = () => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles['cardContent']}>
        <div className={styles['item-wrapper']}>
          <div className={styles['item--2']}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <path
                d="M49.187 30.501c0 6.86-3.721 13.196-9.756 16.614l-7.268 4.116a6.564 6.564 0 01-6.459 0l-7.268-4.116C12.4 43.697 8.68 37.36 8.68 30.5V18.538c0-2.646 2.196-4.816 4.806-5.436 5.309-1.259 11.068-4.046 13.813-5.471a3.558 3.558 0 013.268 0c2.746 1.425 8.505 4.212 13.814 5.471 2.61.62 4.806 2.79 4.806 5.436v11.963z"
                fill="url(#original_level_card_low_disabled_svg__paint0_radial_5016_1269)"
              ></path>
              <g filter="url(#original_level_card_low_disabled_svg__filter0_d_5016_1269)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28.933 18.083a2.671 2.671 0 00-2.663 2.884l.789 9.853a1.88 1.88 0 003.748 0l.789-9.853a2.671 2.671 0 00-2.663-2.884zm0 16.637a2.17 2.17 0 100 4.34 2.17 2.17 0 000-4.34z"
                  fill="#fff"
                  fillOpacity="0.9"
                  shapeRendering="crispEdges"
                ></path>
              </g>
              <defs>
                <radialGradient
                  id="original_level_card_low_disabled_svg__paint0_radial_5016_1269"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="matrix(19.53003 34.71998 -31.35997 17.64002 20.253 12.297)"
                >
                  <stop stopColor="#161823" stopOpacity="0.06"></stop>
                  <stop
                    offset="0.839"
                    stopColor="#161823"
                    stopOpacity="0.15"
                  ></stop>
                  <stop
                    offset="1"
                    stopColor="#161823"
                    stopOpacity="0.12"
                  ></stop>
                </radialGradient>
                <filter
                  id="original_level_card_low_disabled_svg__filter0_d_5016_1269"
                  x="19.029"
                  y="12.297"
                  width="19.809"
                  height="35.443"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dy="1.447"></feOffset>
                  <feGaussianBlur stdDeviation="3.617"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
                  <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_5016_1269"
                  ></feBlend>
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_5016_1269"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <div className={styles['info--3']}>
              <div className={styles['text--info']}>原创度低</div>
              <div className={styles['buttom--info']}>已完成</div>
            </div>
          </div>
        </div>
        <div className={styles['dashed']}></div>
        <div className={cs(styles['item-wrapper'], styles['item-current'])}>
          <div className={styles['item--2']}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <path
                d="M49.187 30.501c0 6.86-3.721 13.196-9.756 16.614l-7.268 4.116a6.564 6.564 0 01-6.459 0l-7.268-4.116C12.4 43.697 8.68 37.36 8.68 30.5V18.538c0-2.646 2.196-4.816 4.806-5.436 5.309-1.259 11.068-4.046 13.813-5.471a3.558 3.558 0 013.268 0c2.746 1.425 8.505 4.212 13.814 5.471 2.61.62 4.806 2.79 4.806 5.436v11.963z"
                fill="url(#original_level_card_good_active_svg__paint0_linear_5016_1417)"
              ></path>
              <g filter="url(#original_level_card_good_active_svg__filter0_d_5016_1417)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M38.71 23.236c.594.522.66 1.426.144 2.028L28.841 36.961a1.86 1.86 0 01-1.372.652 1.858 1.858 0 01-1.399-.593l-6.289-6.74a1.447 1.447 0 01.059-2.033l.625-.599a1.447 1.447 0 012.058.059l4.846 5.195 8.637-10.09a1.447 1.447 0 012.053-.146l.65.57z"
                  fill="#fff"
                  fillOpacity="0.9"
                  shapeRendering="crispEdges"
                ></path>
              </g>
              <defs>
                <linearGradient
                  id="original_level_card_good_active_svg__paint0_linear_5016_1417"
                  x1="13.743"
                  y1="11.573"
                  x2="45.883"
                  y2="43.017"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7FF4B6"></stop>
                  <stop offset="1" stopColor="#35D2B6"></stop>
                </linearGradient>
                <filter
                  id="original_level_card_good_active_svg__filter0_d_5016_1417"
                  x="12.159"
                  y="16.52"
                  width="34.276"
                  height="29.773"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dy="1.447"></feOffset>
                  <feGaussianBlur stdDeviation="3.617"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
                  <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_5016_1417"
                  ></feBlend>
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_5016_1417"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <div className={styles['info--3']}>
              <div className={styles['text--info']}>原创度良好</div>
              <div className={styles['buttom--info']}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'rgb(255, 44, 85)'
                  }}
                >
                  <span>去认证</span>

                  <IconChevronRight />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['dashed']}></div>
        <div className={styles['item-wrapper']}>
          <div className={styles['item--2']}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <path
                d="M49.187 30.501c0 6.86-3.721 13.196-9.756 16.614l-7.268 4.116a6.564 6.564 0 01-6.459 0l-7.268-4.116C12.4 43.697 8.68 37.36 8.68 30.5V18.538c0-2.646 2.196-4.816 4.806-5.436 5.309-1.259 11.068-4.046 13.813-5.471a3.558 3.558 0 013.268 0c2.746 1.425 8.505 4.212 13.814 5.471 2.61.62 4.806 2.79 4.806 5.436v11.963z"
                fill="url(#original_level_card_best_disabled_svg__paint0_radial_5016_3390)"
              ></path>
              <g
                filter="url(#original_level_card_best_disabled_svg__filter0_d_5016_3390)"
                fill="#fff"
                fillOpacity="0.9"
                shapeRendering="crispEdges"
              >
                <path d="M28.933 18.807c-2.398 0-4.147 2.188-4.147 4.63 0 2.44 1.75 4.629 4.147 4.629 2.399 0 4.148-2.189 4.148-4.63 0-2.44-1.75-4.63-4.148-4.63zM28.91 30.09c-2.346 0-4.49.561-6.076 1.583-1.595 1.026-2.677 2.564-2.677 4.454a2.933 2.933 0 002.933 2.933h11.639a2.933 2.933 0 002.933-2.933c0-1.89-1.083-3.428-2.678-4.454-1.586-1.021-3.73-1.582-6.075-1.582z"></path>
              </g>
              <defs>
                <radialGradient
                  id="original_level_card_best_disabled_svg__paint0_radial_5016_3390"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="matrix(19.53003 34.71998 -31.35997 17.64002 20.253 12.297)"
                >
                  <stop stopColor="#161823" stopOpacity="0.06"></stop>
                  <stop
                    offset="0.839"
                    stopColor="#161823"
                    stopOpacity="0.15"
                  ></stop>
                  <stop
                    offset="1"
                    stopColor="#161823"
                    stopOpacity="0.12"
                  ></stop>
                </radialGradient>
                <filter
                  id="original_level_card_best_disabled_svg__filter0_d_5016_3390"
                  x="12.924"
                  y="13.02"
                  width="31.971"
                  height="34.72"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dy="1.447"></feOffset>
                  <feGaussianBlur stdDeviation="3.617"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"></feColorMatrix>
                  <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_5016_3390"
                  ></feBlend>
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_5016_3390"
                    result="shape"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <div className={styles['info--3']}>
              <div className={styles['text--info']}>原创作者认证</div>
              <div className={styles['buttom--info']}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>去查看</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardWrapper
