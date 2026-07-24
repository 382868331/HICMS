import request from '../utils/request'

export interface MeetingMember {
  memberId: number
  userId: string
  userName: string
  phone: string
  wechat: string
  email: string
  department: string
  dutyDate: string
  isMiniappAuth: string
  isInfoCenter: string
  isJiyaoBureau: string
  isMeetingOrganizer: string
  isCurrentDuty: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string | null
  remark: string | null
}

export interface MemberListResult {
  code: number
  msg: string
  rows: MeetingMember[]
  total: number
}

export interface MemberQueryParams {
  pageNum?: number
  pageSize?: number
  userId?: string
  userName?: string
  phone?: string
  wechat?: string
  email?: string
  department?: string
  isMiniappAuth?: string
  isInfoCenter?: string
  isJiyaoBureau?: string
  isMeetingOrganizer?: string
  isCurrentDuty?: string
  params?: {
    beginDutyDate?: string
    endDutyDate?: string
  }
}

/** 分页+条件 查询通讯录成员列表 */
export function getMemberList(params?: MemberQueryParams): Promise<MemberListResult> {
  return request.get('/meeting/member/list', { params })
}

/** 新增通讯录成员 */
export function addMember(data: Partial<MeetingMember>): Promise<{ code: number; msg: string }> {
  return request.post('/meeting/member', data)
}

/** 修改通讯录成员 */
export function editMember(data: Partial<MeetingMember>): Promise<{ code: number; msg: string }> {
  return request.put('/meeting/member', data)
}

/** 删除通讯录成员 (支持批量, memberIds 逗号分隔如 "1,2,3") */
export function deleteMember(memberIds: string): Promise<{ code: number; msg: string }> {
  return request.delete(`/meeting/member/${memberIds}`)
}
