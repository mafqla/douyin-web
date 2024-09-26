export interface LinkData {
  count: number
  link_list: LinkItem[]
  link_type: number
}

export interface LinkItem {
  anchor: string
  url: string
}

export interface FooterLinksRes {
  link_data: LinkData[]
  status_code: number
  status_msg: string
}