import request from '../utils/request'

export interface OnlineUser {
  tokenId: string
  deptName: string
  userName: string
  ipaddr: string
  loginLocation: string
  browser: string
  os: string
  loginTime: number
}

export interface OnlineUserListResult {
  code: number
  msg: string
  rows: OnlineUser[]
  total: number
}

/** 查询在线用户列表 */
export function getOnlineUserList(params?: Record<string, unknown>): Promise<OnlineUserListResult> {
  return request.get('/admin/online/list', { params })
}

/** 强制下线 */
export function forceLogout(tokenId: string): Promise<{ code: number; msg: string }> {
  return request.delete(`/admin/online/${tokenId}`)
}
