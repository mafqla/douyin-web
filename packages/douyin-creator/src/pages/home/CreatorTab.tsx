import { TabPane, Tabs } from '@douyinfe/semi-ui'
import styles from './style/creator-tab.module.scss'
import cs from 'classnames'
import { IconChevronRight } from '@douyinfe/semi-icons'

interface ITabs {
  tab: string
  itemKey: string
  data?: IImageData[]

  tab2?: string
  itemKey2?: string
  data2?: IImageData[]
}
interface IImageData {
  id: number
  src: string
  caption: string
  popularity: string
}
const likeData: IImageData[] = [
  {
    id: 1,
    src: 'https://p3-sign.douyinpic.com/obj/2b6b70006221eba322c56?x-expires=1702026000&amp;x-signature=sazY6b1SZEy%2BWrfNgzYXQbuNmmU%3D&amp;from=3433095043',
    caption: '夕阳西下落日余晖的文案',
    popularity: '268.70万'
  },
  {
    id: 2,
    src: 'https://p6-sign.douyinpic.com/tos-cn-p-0015/42423e642b3c43a5bccf38b59e0adfe8_1668621120~noop.jpeg?x-expires=1702026000&amp;x-signature=ICY2BPqaGTGssXdHaF29QJzLJiU%3D&amp;from=3433095043',
    caption: '中华烟价格表图',
    popularity: '642.16万'
  },
  {
    id: 3,
    src: 'https://p3-sign.douyinpic.com/tos-cn-p-0015/e107ad714b09476daa4d8e99ce6526d2~noop.jpeg?x-expires=1702026000&amp;x-signature=dqqpf%2BocYpMppfFOTYg6qp2W0y8%3D&amp;from=3433095043',
    caption: '落日图片',
    popularity: '34.51万'
  },
  {
    id: 4,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-0813c001/oUCA5NzUfArqTXcXAekbACyAxNqEIDAtgyiq8h~noop.jpeg?x-expires=1702026000&amp;x-signature=LPRSp9xuxWSG4VrvA4kVKkauWhs%3D&amp;from=3433095043',
    caption: '爱情最美的样子是什么样',
    popularity: '1546.08万'
  },
  {
    id: 5,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-0813/ogzhACBWICcsSEhRSte3A3IAh6ygOgplA1AAfy~noop.jpeg?x-expires=1702026000&amp;x-signature=8Q2LOIQ9hs%2FyugP6SW0h5Om%2BIoU%3D&amp;from=3433095043',
    caption: '易烊千玺出道前的照片',
    popularity: '6561.03万'
  }
]

const hotTopicsData: IImageData[] = [
  {
    src: 'https://p3-sign.douyinpic.com/obj/src-cut-tos/e4e55f80310670358593bc684d05891c.jpg?x-expires=1702040400&amp;x-signature=bNPKKcoxeRwos9QnH9Vb29uOwBo%3D&amp;from=1887476869',
    caption: '#搞笑',
    popularity: '14.37亿',
    id: 1
  },
  {
    src: 'https://p26-sign.douyinpic.com/douyin-admin-obj/8eaaf86e95e322cba15aea7106695902~noop.jpeg?x-expires=1702040400&amp;x-signature=x0paS9aASCvmve5Dub5v8lFcnTA%3D&amp;from=1887476869',
    caption: '#记录真实生活',
    popularity: '12.06亿',
    id: 2
  },
  {
    src: 'https://p3-sign.douyinpic.com/obj/src-cut-tos/1c141c77e099f68b89d11639b8ce61d8.jpg?x-expires=1702040400&amp;x-signature=NiPfzpWHa6PwiFd9Z8bDh%2FpCL6A%3D&amp;from=1887476869',
    caption: '#因为一个片段看了整部剧',
    popularity: '9.38亿',
    id: 3
  },
  {
    src: 'https://p3-sign.douyinpic.com/obj/src-cut-tos/c266c7328cd1518f313edad56a8b2515.jpg?x-expires=1702040400&amp;x-signature=AXrpQ7tuCEeri7oait229dDFtSI%3D&amp;from=1887476869',
    caption: '#万万没想到',
    popularity: '7.61亿',
    id: 4
  },
  {
    src: 'https://p3-sign.douyinpic.com/obj/src-cut-tos/f22aeea82cfff07d9269008c683c788d.jpg?x-expires=1702040400&amp;x-signature=kAeLHpBmKuDiFsD%2BKxZPjZIhrHU%3D&amp;from=1887476869',
    caption: '#好剧推荐',
    popularity: '7.39亿',
    id: 5
  }
]
const hotVideosData: IImageData[] = [
  {
    id: 1,
    src: 'https://p3-sign.douyinpic.com/tos-cn-p-0015/osBxeJDbyECzAyAEJBufnhJhIBzBhRAVSgNvOh~c5_300x400.jpeg?x-expires=1703228400&amp;x-signature=8aZKTpO9oaZHuaniTMueK67sVTM%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848C0335F44B2924900DEB8',
    caption: '深夜，萌娃来派出所“告状”被姐姐打了，一翻话逗笑了在场的民警。',
    popularity: '81.02万'
  },
  {
    id: 2,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-dy/ccc9200d559f49dc8568836b1a7af517~c5_300x400.jpeg?x-expires=1703228400&amp;x-signature=wDEtwBan%2F%2Fn3XnN3%2B4%2FjDHFeMmc%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848C0335F44B2924900DEB8',
    caption:
      '原来不是睡得越多越好！山东济南，北大博士教你一招睡好觉。“达芬奇睡眠法”，睡觉要睡1.5小时的整数倍！#黄河文化大会  第二季每周六20:30播出。#北大博士教你睡大觉   #黄河文化大会是个什么会  #我拍了拍黄河',
    popularity: '92.93万'
  },
  {
    id: 3,
    src: 'https://p6-sign.douyinpic.com/tos-cn-i-dy/d65742032e9c466ca4ed4b0105bcc815~c5_300x400.jpeg?x-expires=1703228400&amp;x-signature=TphWy9zE0nlE3omXVTUFR8VKIbU%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848C0335F44B2924900DEB8',
    caption:
      '医院工作人员被指上班打游戏，数位患者在窗口排队等待缴费 12月6日，上海。医院工作人员被指上班打游戏，数位患者在窗口排队等待缴费。目击者：他将手机藏在电脑后，玩了很久。来源@小幸运@',
    popularity: '42.70万'
  },
  {
    id: 4,
    src: 'https://p9-sign.douyinpic.com/tos-cn-i-0813/oABENIV3gAdQAUGq9ebJFlnCVAcieDAE1APVAw~c5_300x400.jpeg?x-expires=1703228400&amp;x-signature=F9sSkACvRz47f4RfytsogQVn8QM%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848C0335F44B2924900DEB8',
    caption: '狗子：一天一苹果，兽医远离我',
    popularity: '86.91万'
  },
  {
    id: 5,
    src: 'https://p9-sign.douyinpic.com/tos-cn-p-0015/oEgnlcE3l19FAB0QKPuAeZhADTC2g2eQvgb89u~c5_300x400.jpeg?x-expires=1703228400&amp;x-signature=28GPAyFHHjYO3gyTOkAoVsmzdvc%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848C0335F44B2924900DEB8',
    caption: '好喜欢沉浸在这种氛围里.',
    popularity: '45.50万'
  }
]
const topChartsData: IImageData[] = [
  {
    id: 1,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-dy/7421a57744e144c8b1ffb258037460fe~c5_300x400.jpeg?x-expires=1703232000&amp;x-signature=nPvrkbLYFM41xjDdi2kvxD11hp8%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208160130AF390163B374970383FE',
    caption: '十五块钱一瓶的水是什么味道',
    popularity: '1045.40万'
  },
  {
    id: 2,
    src: 'https://p11-sign.douyinpic.com/tos-cn-i-0813c001/oUw2yAIKFAzrgRAvE9BACA3uXNftetshBAM5tA~c5_300x400.jpeg?x-expires=1703232000&amp;x-signature=%2B2ELvzvpHLeZ3tXDqbROUDRg38o%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208160130AF390163B374970383FE',
    caption: '张若昀新剧收了学生14部手机',
    popularity: '968.07万'
  },
  {
    id: 3,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-dy/5d73287043104e93ac46d927ae9a8f6e~c5_300x400.jpeg?x-expires=1703232000&amp;x-signature=D0AeFhvL5N0l9AsymmGQLBPaxNM%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208160130AF390163B374970383FE',
    caption: '京雄高速年底将建成通车',
    popularity: '911.07万'
  },
  {
    id: 4,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-dy/7dd813c993b3444a96a7d8f5b6d819b8~c5_300x400.jpeg?x-expires=1703232000&amp;x-signature=LqalADI%2BYpsVaY8YHimXmLH8ALA%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208160130AF390163B374970383FE',
    caption: '宝贝别怕 不是说你',
    popularity: '908.57万'
  },
  {
    id: 5,
    src: 'https://p26-sign.douyinpic.com/tos-cn-i-0813c001/oAheASIyIBAtAdzRCgN2fkANAYEKDAodAWuyzA~c5_300x400.jpeg?x-expires=1703232000&amp;x-signature=LqeakuM1%2FKCJx%2FP1NqBnIkR22SQ%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_PUBLISH&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208160130AF390163B374970383FE',
    caption: '猫咪行云流水的回家操作',
    popularity: '893.93万'
  }
]
const popularCoursesData: IImageData[] = [
  {
    id: 1,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-dy/2ef36b04166e496a84ff2e06d6d8206a~c5_300x400.webp?x-expires=1703228400&amp;x-signature=5pksIkpGOfe2%2FB%2FU7wJN%2FfKDMlc%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_OPERATION_TASK_AWEME&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848B3001A55963EFB009AF4',
    caption: '如何开通视频赞赏',
    popularity: '播放量 1460.68万'
  },
  {
    id: 2,
    src: 'https://p3-sign.douyinpic.com/tos-cn-p-0015/5984954d1d604690969aed3274791f7f~c5_300x400.webp?x-expires=1703228400&amp;x-signature=DAckce6Ggc9pT6Dns2%2FXjHpThdw%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_OPERATION_TASK_AWEME&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848B3001A55963EFB009AF4',
    caption: '如何增强粉丝粘性',
    popularity: '播放量 786.12万'
  },
  {
    id: 3,
    src: 'https://p3-sign.douyinpic.com/tos-cn-p-0015/ba652f819c8b4cae959fc3abde1c8f30~c5_300x400.webp?x-expires=1703228400&amp;x-signature=qFhV6qpr5Z7PAp%2B3%2F1cjCcYfPww%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_OPERATION_TASK_AWEME&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848B3001A55963EFB009AF4',
    caption: '剧情演绎规则课堂 I 不良导向篇',
    popularity: '播放量 279.07万'
  },
  {
    id: 4,
    src: 'https://p3-sign.douyinpic.com/tos-cn-i-0813/4adaf18fc0414fe18f7ee1093c0f591f~c5_300x400.webp?x-expires=1703228400&amp;x-signature=oS955jZdx4B36rCaPRHgPYvelkk%3D&amp;from=3213915784_large&amp;s=PackSourceEnum_OPERATION_TASK_AWEME&amp;se=false&amp;sc=cover&amp;biz_tag=aweme_video&amp;l=20231208153848B3001A55963EFB009AF4',
    caption: '了解星图！新手小白必学第一课！',
    popularity: '播放量 497.53万'
  }
]
const featuredTopicsData: IImageData[] = [
  {
    id: 1,
    src: 'https://p6-sign.douyinpic.com/douyin-admin-obj/9da8fc9a9b7693cc07fc317e84d88d95~noop.jpeg?x-expires=1702044000&amp;x-signature=DdTwcVyVZp6yJTqiStq0Sr3N%2Fsk%3D&amp;from=3604061908',
    caption: '图文创作干货大全',
    popularity: '播放量 1315.07万'
  },
  {
    id: 2,
    src: 'https://p3-sign.douyinpic.com/douyin-admin-obj/0edb144584de479b42da83e7ed2c40af~noop.jpeg?x-expires=1702044000&amp;x-signature=CdVzzjT5lIflctUboxOyggjnZnE%3D&amp;from=3604061908',
    caption: '抖音热门玩法教程',
    popularity: '播放量 1384.96万'
  },
  {
    id: 3,
    src: 'https://p3-sign.douyinpic.com/douyin-admin-obj/9501477a6c85847f1e8855a40b3fc0d3~noop.jpeg?x-expires=1702044000&amp;x-signature=Ub6bvBDrzOvY%2Fc1RG1Vpy38vVx4%3D&amp;from=3604061908',
    caption: '三农达人爆款案例解析',
    popularity: '播放量 59.43万'
  },
  {
    id: 4,
    src: 'https://p26-sign.douyinpic.com/douyin-admin-obj/bbb60cebe712b43835a6b243e19a0c09~noop.jpeg?x-expires=1702044000&amp;x-signature=cs2P5L3htHbkwoQEwmaQdlsFhnU%3D&amp;from=3604061908',
    caption: '拍摄第一条抖音视频',
    popularity: '播放量 3628.90万'
  },
  {
    id: 5,
    src: 'https://p11-sign.douyinpic.com/douyin-admin-obj/d6a0b0e1bf19350b32f9a337d09446f6~noop.jpeg?x-expires=1702044000&amp;x-signature=VE7Glx6H%2FACPDSADLvHLmYVzdEM%3D&amp;from=3604061908',
    caption: '审核与推荐规则',
    popularity: '播放量 5817.20万'
  }
]

const CreatorTab = () => {
  return (
    <div className={styles['creator-tab']}>
      <TabsList
        tab="猜你喜欢"
        tab2="热门话题"
        itemKey="like"
        itemKey2="hotTopics"
        data={likeData}
        data2={hotTopicsData}
      />
      <div className={styles['line']}></div>
      <TabsList
        tab="热门视频"
        tab2="热点榜单"
        itemKey="hotVideos"
        itemKey2="topCharts"
        data={hotVideosData}
        data2={topChartsData}
      />
      <div className={styles['line']}></div>
      <TabsList
        tab="热门课程"
        tab2="精选专题"
        itemKey="popularCourses"
        itemKey2="featuredTopics"
        data={popularCoursesData}
        data2={featuredTopicsData}
      />
    </div>
  )
}

const ImageList: React.FC<{ imageData: IImageData[] }> = ({ imageData }) => {
  return (
    <div className={styles['img-list']}>
      {imageData.map((data, index) => (
        <div key={index} className={styles['img-container']}>
          <div className={styles['img-content']}>
            <img src={data.src} alt="" className={styles.img} />
            <div
              className={cs(styles.rank, styles[`color-${(index % 5) + 1}`])}
            >
              {index + 1}
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.caption}>{data.caption}</div>
            <div className={styles.popularity}>
              热度
              <span className={styles['popularity-count']}>
                {data.popularity}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className={styles['view-all']}>
        查看全部
        <IconChevronRight className={styles['dux-icon']} size="small" />
      </div>
    </div>
  )
}

const TabsList: React.FC<ITabs> = ({
  tab,
  tab2,
  itemKey,
  itemKey2,
  data,
  data2
}) => {
  return (
    <Tabs type="line" className={styles['tabs']}>
      <TabPane tab={tab} itemKey={itemKey}>
        <ImageList imageData={data} />
      </TabPane>
      <TabPane tab={tab2} itemKey={itemKey2}>
        <ImageList imageData={data2} />
      </TabPane>
    </Tabs>
  )
}
export default CreatorTab
