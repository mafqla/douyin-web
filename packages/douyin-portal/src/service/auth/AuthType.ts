export interface ILogin {
  email: string
  password: string
}

export interface ILoginResult {
  userId: number
  username: string
  token: string
  type: string
  userAvatar: string
  email: string
  phone: string
  userNum: string
  ipLocation: string
  gender: string
  birthdate: string
  signature: string
  school: string
  location: string
  createTime: string
}

export interface IUserInfoResult {
  id: number
  address: string
  attentionCount: number
  avatar: string
  birthday: string
  collectVideosCount: number
  fansCount: number
  gender: string
  ipAddress: string
  isAttention: number
  likeCount: number
  likeVideosCount: number
  school: string
  uploadVideosCount: number
  userAuth: string
  userAuthType: string
  userNum: string
  userSignature: string
  userType: string
  username: string
}

//修改用户信息请求参数
export interface IEditUserInfo {
  id?: number //用户id
  username?: string //用户名
  userNum?: string //用户学号
  phone?: string //手机号
  gender?: string //性别
  birthday?: string //生日
  school?: string //学校
  location?: string //地址
  signature?: string //个性签名
  avatar?: File //头像
}
