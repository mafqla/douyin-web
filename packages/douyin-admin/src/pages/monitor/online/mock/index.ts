import Mock from 'mockjs'
import qs from 'query-string'
import dayjs from 'dayjs'
import setupMock from '@/utils/setupMock'
const { list } = Mock.mock({
  'list|100': [
    {
      id: /[0-9]{8}[0-9]{4}/,
      nickname: () => Mock.Random.word(),
      ip: Mock.mock('@ip()'), // 随机ip地址
      location: Mock.Random.city(1, 100),
      system: Mock.Random.pick([
        'windows 11',
        'Mac OS X 10.15.7',
        'Windows 10',
        'ubuntu 20.04'
      ]),
      'time|1-60': 0,
      browser: Mock.Random.pick([
        'chrome',
        'firefox',
        'safari',
        'edge',
        'opera',
        'ie'
      ])
    }
  ]
})

const filterData = (
  rest: {
    id?: string
    nickname?: string
    'ip[]'?: string[]
    'location[]'?: string[]
    'time[]'?: string[]
    'browser[]'?: string
  } = {}
) => {
  const {
    id,
    nickname,
    'ip[]': ip,
    'location[]': location,
    'time[]': time,
    'browser[]': browser
  } = rest
  if (id) {
    return list.filter((item) => item.id === id)
  }
  let result = [...list]
  if (nickname) {
    result = result.filter((item) => {
      return (item.nickname as string)
        .toLowerCase()
        .includes(nickname.toLowerCase())
    })
  }
  if (ip) {
    result = result.filter((item) => ip.includes(item.ip.toString()))
  }
  if (location) {
    result = result.filter((item) =>
      location.includes(item.location.toString())
    )
  }
  if (time && time.length === 2) {
    const [begin, end] = time
    result = result.filter((item) => {
      const time = dayjs()
        .subtract(item.time, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
      return (
        !dayjs(time).isBefore(dayjs(begin)) && !dayjs(time).isAfter(dayjs(end))
      )
    })
  }

  if (browser && browser.length) {
    result = result.filter((item) => browser.includes(item.browser.toString()))
  }

  return result
}

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/online'), (params) => {
      const { page = 1, pageSize = 10, ...rest } = qs.parseUrl(params.url).query
      const p = page as number
      const ps = pageSize as number

      const result = filterData(rest)
      return {
        list: result.slice((p - 1) * ps, p * ps),
        total: result.length
      }
    })
  }
})
