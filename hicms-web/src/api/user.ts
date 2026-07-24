import request from '../utils/request'

export interface SysUser {
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

export interface UserListResult {
  code: number
  msg: string
  rows: SysUser[]
  total: number
}

/** 查询用户列表（分页+条件） */
export function getUserList(params?: Record<string, unknown>): Promise<UserListResult> {
  return request.get('/admin/user/list', { params })
}

/** 新增用户 */
export function addUser(data: Partial<SysUser>): Promise<{ code: number; msg: string }> {
  return request.post('/admin/user', data)
}

/** 修改用户 */
export function editUser(data: Partial<SysUser>): Promise<{ code: number; msg: string }> {
  return request.put('/admin/user', data)
}

/** 删除用户 (支持批量, userIds 逗号分隔如 "1,2,3") */
export function deleteUser(userIds: string): Promise<{ code: number; msg: string }> {
  return request.delete(`/admin/user/${userIds}`)
}
