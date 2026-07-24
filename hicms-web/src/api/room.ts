import request from '../utils/request'

export interface MeetingRoom {
  roomId: number
  name: string
  applicableScope: string
  areaSize: string
  layout: string
  normalCapacity: number
  covidCapacity: number
  imageUrl: string
  bookingJson: unknown
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string | null
  remark: string | null
}

export interface RoomListResult {
  code: number
  msg: string
  rows: MeetingRoom[]
  total: number
}

/** 查询会议室列表 */
export function getRoomList(params?: Record<string, unknown>): Promise<RoomListResult> {
  return request.get('/meeting/room/list', { params })
}

/** 新增会议室 */
export function addRoom(data: Partial<MeetingRoom>): Promise<{ code: number; msg: string }> {
  return request.post('/meeting/room', data)
}

/** 修改会议室 */
export function editRoom(data: Partial<MeetingRoom>): Promise<{ code: number; msg: string }> {
  return request.put('/meeting/room', data)
}

/** 删除会议室 (支持批量, roomIds 逗号分隔如 "1,2,3") */
export function deleteRoom(roomIds: string): Promise<{ code: number; msg: string }> {
  return request.delete(`/meeting/room/${roomIds}`)
}
