import styles from './style/interest-wrapper.module.scss'
import cs from 'classnames'
const InterestWrapper = () => {
  type Interest = {
    id: number
    icon: React.ReactNode
    text: string
  }

  type InterestWithLock = Interest & {
    locked: boolean
  }
  const interests: InterestWithLock[] = [
    {
      id: 1,
      icon: (
        <svg width="21" height="25" viewBox="0 0 21 25" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.909 1.773h13c.979 0 1.773.793 1.773 1.772v17.728c0 .979-.794 1.772-1.773 1.772h-13a1.773 1.773 0 01-1.773-1.772V3.545c0-.979.794-1.772 1.773-1.772zM.364 3.545A3.545 3.545 0 013.909 0h13a3.545 3.545 0 013.545 3.545v17.728a3.545 3.545 0 01-3.545 3.545h-13a3.545 3.545 0 01-3.545-3.545V3.545zm12.15 2.96a.945.945 0 00-1.89.026V15a1.94 1.94 0 11-1.94-1.94.945.945 0 000-1.89 3.83 3.83 0 103.83 3.83v-4.954c.597.886 1.91 1.448 3.07 1.448a.945.945 0 100-1.89 3.068 3.068 0 01-3.07-3.1z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '侵权举报',
      locked: false
    },
    {
      id: 2,
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M15.886 3.058a.886.886 0 10-1.772 0v1.773a.886.886 0 101.772 0V3.058zM14.207 11.649a.886.886 0 111.586.793l-1.131 2.262h2.11a.886.886 0 01.794 1.283l-1.773 3.546a.886.886 0 11-1.586-.793l1.132-2.263h-2.112a.886.886 0 01-.793-1.283l1.773-3.545z"
            fill="#252632"
          ></path>
          <path
            d="M6.496 15.984a8.504 8.504 0 1117.008 0v4.925a2.364 2.364 0 01-2.364 2.364H8.86a2.364 2.364 0 01-2.364-2.364v-4.925zm15.235 0a6.73 6.73 0 00-13.462 0v4.925c0 .326.265.591.591.591h12.28a.59.59 0 00.59-.59v-4.926zM4.66 25.932c0-.49.396-.887.885-.887h18.91a.886.886 0 010 1.773H5.545a.886.886 0 01-.886-.886zM25.95 7.594a.886.886 0 00-1.253 0l-1.253 1.254a.886.886 0 001.253 1.253l1.254-1.253a.886.886 0 000-1.254zM5.302 10.101a.886.886 0 101.254-1.253L5.302 7.594A.886.886 0 004.05 8.848L5.302 10.1z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '冒用治理',
      locked: true
    },
    {
      id: 3,
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M5.84 12.34a9.16 9.16 0 1113.776 7.913v2.133c0 .49-.397.887-.886.887h-7.46a.886.886 0 01-.886-.887v-2.133a9.155 9.155 0 01-4.543-7.912zM15 4.956a7.386 7.386 0 00-3.33 13.981c.299.151.487.457.487.791V21.5h1.957v-4.535a3.84 3.84 0 01-2.955-3.738.886.886 0 011.773 0 2.068 2.068 0 104.136 0 .886.886 0 011.773 0 3.84 3.84 0 01-2.955 3.738V21.5h1.957v-1.773c0-.334.188-.64.486-.79A7.386 7.386 0 0015 4.954zM11.986 25.042a.236.236 0 00-.236.236v.358c0 .653.53 1.182 1.182 1.182h4.136c.653 0 1.182-.529 1.182-1.182v-.357a.236.236 0 00-.236-.237h-6.028z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '作品保护',
      locked: true
    },
    {
      id: 4,
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M14.999 26.819h.002c6.526-.001 11.817-5.292 11.817-11.819 0-6.526-5.29-11.817-11.816-11.818L15 3.181l-.002.001c-6.228 0-11.33 4.82-11.784 10.932h-.032v.768a12.199 12.199 0 000 .236v.768h.032C3.667 22 8.77 26.818 14.999 26.82zm4.108-10.933A12.96 12.96 0 0115 24.51a12.96 12.96 0 01-4.107-8.624h8.214zm1.776 0h4.123c-.384 4.4-3.604 7.986-7.822 8.922a14.713 14.713 0 003.699-8.922zm-8.067 8.922c-4.218-.935-7.439-4.522-7.823-8.922h4.124a14.713 14.713 0 003.7 8.922zm-1.923-10.694A12.96 12.96 0 0115 5.49a12.96 12.96 0 014.107 8.624h-8.214zm-1.776 0H4.993c.384-4.4 3.605-7.986 7.823-8.921a14.712 14.712 0 00-3.699 8.92zm8.068-8.92c4.217.935 7.437 4.52 7.821 8.92h-4.123a14.713 14.713 0 00-3.698-8.92z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '站外维权',
      locked: true
    },
    {
      id: 5,
      icon: (
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
          <path
            d="M9.91 9.818c2.35 0 4.255-2.116 4.255-4.727 0-2.61-1.904-4.727-4.254-4.727-2.35 0-4.255 2.116-4.255 4.727 0 2.61 1.905 4.727 4.255 4.727zm0-1.773c-1.199 0-2.481-1.142-2.481-2.954 0-1.812 1.282-2.955 2.482-2.955 1.2 0 2.482 1.143 2.482 2.955S11.11 8.045 9.91 8.045zM3.516 13.241c1.708-1.058 3.965-1.65 6.395-1.65 2.43 0 4.687.592 6.395 1.65 1.687 1.046 3.06 2.715 3.06 4.85v.59a2.955 2.955 0 01-2.955 2.955h-13a2.955 2.955 0 01-2.955-2.954v-.591c0-2.135 1.373-3.804 3.06-4.85zm-1.287 4.85v.59c0 .653.529 1.183 1.182 1.183h13c.652 0 1.181-.53 1.181-1.182v-.591c0-2.61-3.36-4.727-7.681-4.727S2.229 15.48 2.229 18.09zM22.913 5.867c0 2.177-1.588 3.942-3.548 3.942s-3.547-1.765-3.547-3.942c0-2.177 1.588-3.942 3.547-3.942 1.96 0 3.548 1.765 3.548 3.942zm-1.773 0c0-1.379-.965-2.17-1.775-2.17-.809 0-1.775.791-1.775 2.17 0 1.378.966 2.169 1.775 2.169.81 0 1.775-.79 1.775-2.17z"
            fill="#252632"
          ></path>
          <path
            d="M19.365 11.767c-.757 0-1.497.068-2.203.198.692.421 1.368.945 1.966 1.578l.237-.003c3.604 0 6.406 1.765 6.406 3.942v.493a.986.986 0 01-.985.985h-3.648c0 .627-.122 1.226-.344 1.773h3.992a2.758 2.758 0 002.758-2.758v-.493c0-1.918-1.233-3.39-2.69-4.294-1.48-.917-3.418-1.42-5.489-1.42z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '抄袭评审团',
      locked: true
    },
    {
      id: 6,
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M22.756 25.085a1.015 1.015 0 101.436 1.436l3.948-3.948a1.015 1.015 0 000-1.436l-3.948-3.949a1.015 1.015 0 10-1.436 1.436l2.215 2.215h-6.573a1.015 1.015 0 100 2.03h6.573l-2.215 2.216zM19.727 8.5c0 2.937-2.116 5.318-4.727 5.318s-4.727-2.38-4.727-5.318c0-2.937 2.116-5.318 4.727-5.318 2.61 0 4.727 2.38 4.727 5.318zm-1.773 0c0-2.16-1.513-3.545-2.954-3.545-1.441 0-2.955 1.385-2.955 3.545S13.56 12.046 15 12.046s2.954-1.386 2.954-3.546z"
            fill="#252632"
          ></path>
          <path
            d="M15 15.59c-2.77 0-5.328.692-7.252 1.913-1.906 1.21-3.384 3.096-3.384 5.447v.914a2.955 2.955 0 002.954 2.954h13.213c.166 0 .281-.168.24-.33a2.803 2.803 0 01-.048-1.138c.025-.155-.088-.305-.245-.305H7.318c-.653 0-1.182-.529-1.182-1.181v-.914c0-3.085 3.878-5.586 8.864-5.586 2.003 0 3.826.403 5.292 1.086.19.089.422-.094.404-.305a2.798 2.798 0 01.14-1.14.249.249 0 00-.13-.312c-1.663-.712-3.625-1.102-5.706-1.102z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '粉丝转移',
      locked: true
    },
    {
      id: 7,
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M12.046 10.273c0-.49.396-.887.886-.887h6.799a.886.886 0 110 1.773h-6.8a.886.886 0 01-.885-.886zM12.932 12.932a.886.886 0 000 1.773h4.727a.886.886 0 000-1.773h-4.727z"
            fill="#252632"
          ></path>
          <path
            d="M7.318 12.046H5.546a2.364 2.364 0 01-2.364-2.364V7.318a2.955 2.955 0 012.98-2.954h13.86a4.432 4.432 0 014.433 4.431v8.569a2.364 2.364 0 012.363 2.363v2.955a2.955 2.955 0 01-2.954 2.954h-13v-.013a3.25 3.25 0 01-3.545-3.237v-10.34zm4.728 10.34v-2.068A2.955 2.955 0 0115 17.364h7.682V8.795a2.66 2.66 0 00-2.66-2.659H9.092v16.25a1.477 1.477 0 002.955 0zm1.418 1.478h10.4c.652 0 1.181-.53 1.181-1.182v-2.955a.59.59 0 00-.59-.59H15c-.653 0-1.182.529-1.182 1.181v2.068c0 .532-.128 1.034-.354 1.478zM7.318 10.273V7.318a1.182 1.182 0 00-2.363 0v2.364c0 .326.264.59.59.59h1.773z"
            fill="#252632"
          ></path>
        </svg>
      ),
      text: '诉讼维权',
      locked: true
    }
  ]

  return (
    <div className={styles.interestWrapper}>
      {interests.map((interest) => (
        <InterestItem
          key={interest.id}
          icon={interest.icon}
          text={interest.text}
          locked={interest.locked}
        />
      ))}
    </div>
  )
}

const InterestItem = ({ icon, text, locked }) => (
  <div className={cs(styles.interestContent, !locked && styles.cursor)}>
    <div className={styles.circleBG}>
      {icon}
      {locked && (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          className={styles['lock--icon']}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.909 1.409A3.631 3.631 0 004.278 5.04v1.69A1.182 1.182 0 003.182 7.91v4.727c0 .653.529 1.182 1.181 1.182h7.091c.653 0 1.182-.53 1.182-1.182V7.91c0-.624-.483-1.135-1.096-1.179V5.04A3.631 3.631 0 007.91 1.41zm1.858 5.318V5.04a1.859 1.859 0 10-3.717 0v1.687h3.717z"
            fill="#252632"
          ></path>
        </svg>
      )}
    </div>
    <div className={styles.circleText}>{text}</div>
  </div>
)

export default InterestWrapper
