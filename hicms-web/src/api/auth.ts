import request, { setToken } from '../utils/request'

export interface LoginParams {
  username: string
  password: string
  code?: string
  uuid?: string
}

export interface LoginResult {
  code: number
  msg: string
  token?: string
}

export interface CaptchaResult {
  code: number
  msg: string
  uuid?: string
  img?: string
}

export interface UserInfoResult {
  code: number
  msg: string
  user: {
    userId: number
    deptId: number
    userName: string
    nickName: string
    email: string
    phonenumber: string
    sex: string
    avatar: string
    status: string
    delFlag: string
    loginIp: string
    loginDate: string
    userType: string
    createBy: string
    createTime: string
    updateBy: string
    updateTime: string | null
    remark: string | null
  }
  roles: string[]
  permissions: string[]
}

export function login(params: LoginParams): Promise<LoginResult> {
  return request.post('/login', params).then((res: LoginResult) => {
    if (res.code === 200 && res.token) {
      setToken(res.token)
    }
    return res
  })
}

export function getCaptcha(): Promise<CaptchaResult> {
  return request.get('/captchaImage')
}

export function getUserInfo(): Promise<UserInfoResult> {
  return request.get('/getInfo')
}

export function logout(): Promise<{ code: number; msg: string }> {
  return request.delete('/logout')
}
