import request from '../utils/request'

export interface MeetingBook {
  bookId: number
  roomName: string
  roomId: number
  bookerName: string
  bookerId: number
  meetingName: string
  leaderName: string
  audioFileUrl: string
  audioTranscriptUrl: string
  meetingStartTime: string
  meetingEndTime: string
  agendaPdfUrl: string
  seatMapUrl: string
  isOnline: string
  isHxy: string
  isJyjLine: string
  isGbLine: string
  isCanceled: string
  isFinished: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string | null
  remark: string | null
}

export interface BookListResult {
  code: number
  msg: string
  rows: MeetingBook[]
  total: number
}

export interface BookQueryParams {
  pageNum?: number
  pageSize?: number
  roomName?: string
  roomId?: number
  bookerName?: string
  bookerId?: number
  meetingName?: string
  leaderName?: string
  isOnline?: string
  isHxy?: string
  isJyjLine?: string
  isGbLine?: string
  isCanceled?: string
  isFinished?: string
  params?: Record<string, unknown>
}

/** 条件+分页 查询会议预定列表 */
export function getBookList(params?: BookQueryParams): Promise<BookListResult> {
  return request.get('/meeting/book/list', { params })
}

/** 新增会议预定 */
export function addBook(data: Partial<MeetingBook>): Promise<{ code: number; msg: string }> {
  return request.post('/meeting/book', data)
}

/** 修改会议预定 */
export function editBook(data: Partial<MeetingBook>): Promise<{ code: number; msg: string }> {
  return request.put('/meeting/book', data)
}

/** 删除会议预定 (支持批量, bookIds 逗号分隔如 "1,2,3") */
export function deleteBook(bookIds: string): Promise<{ code: number; msg: string }> {
  return request.delete(`/meeting/book/${bookIds}`)
}
