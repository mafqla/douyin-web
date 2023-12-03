import React from 'react'
import styles from './style/showcase.module.scss'
const ShowCase: React.FC = () => {
  const sections = [
    {
      title: '授权管理',
      description:
        '授权其他帐号查看本帐号下内容和数据，常用于mcn机构与旗下成员',
      link: '/authority',
      image:
        '//p3.douyinpic.com/aweme-server-static-resource/ttfe_open_creator_authority_1581491264881.png~tplv-obj.image',
    },
    {
      title: '内容发布及管理',
      description:
        '发布视频内容以及创建实时直播，支持查看直播数据以及视频状态，同时可在视频内容上携带地点信息，协助你便捷高效的进行内容管理',
      link: '/content/',
      image:
        '//p3.douyinpic.com/aweme-server-static-resource/ttfe_open_creator_content_1581491267410.png~tplv-obj.image',
    },
    {
      title: '互动管理',
      description:
        '查看粉丝数据，查看互动数据，添加关注，删除好友，快速管理关注及粉丝列表',
      link: '/following',
      image:
        '//p3.douyinpic.com/aweme-server-static-resource/ttfe_open_creator_int_1581491273221.png~tplv-obj.image',
    },
    {
      title: '数据管理',
      description:
        '提供整体的内容以及互动数据，并提供行业热点区域热点数据，用数据协助更好的创作',
      link: '/data',
      image:
        '//p3.douyinpic.com/aweme-server-static-resource/ttfe_open_creator_data_1581491270528.png~tplv-obj.image',
    },
    {
      title: '音乐管理',
      description:
        '音乐人可以自由的查看并管理自己上传的音乐以及音乐的数据表现，为你的音乐创作助力',
      link: '/musician',
      image:
        '//p3.douyinpic.com/aweme-server-static-resource/ies_douyin_opencn_showcase_music.png~tplv-obj.image',
    },
  ]

  return (
    <div className={styles.showcase}>
      <div>
        <h3>为你提供</h3>
        {sections.map((section, index) => (
          <section key={index}>
            <div>
              <h4>{section.title}</h4>
              <p>{section.description}</p>
              <a href={section.link}>查看详情</a>
            </div>
            <img src={section.image} />
          </section>
        ))}
      </div>
    </div>
  )
}

export default ShowCase
