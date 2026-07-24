import { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Spin, Empty, Tag, Typography, Button, message } from 'antd'
import { ClockCircleOutlined, EnvironmentOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { getRoomList, type MeetingRoom } from '../../api/room'
import { getBookList, editBook, type MeetingBook } from '../../api/book'
import { getUserInfo } from '../../api/auth'
import { useBookModal } from '../../components/book'

const { Text } = Typography

function toImageUrl(path: string): string {
  const name = path.replace(/\\/g, '/').split('/').pop()
  return name ? `/rooms/${name}` : ''
}

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getTomorrowStr(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getAfter7DaysStr(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getStatusTag(book: MeetingBook) {
  if (book.isCanceled === '1') return { color: 'default', text: '已取消' }
  if (book.isFinished === '1') return { color: 'green', text: '已完成' }
  const now = new Date().getTime()
  const start = new Date(book.meetingStartTime).getTime()
  const end = new Date(book.meetingEndTime).getTime()
  if (now >= start && now <= end) return { color: 'blue', text: '进行中' }
  if (now > end) return { color: 'default', text: '已结束' }
  return { color: 'orange', text: '待开始' }
}

// ==================== 会议预定日程面板 ====================
function BookingSchedule() {
  const [books, setBooks] = useState<MeetingBook[]>([])
  const [myBooks, setMyBooks] = useState<MeetingBook[]>([])
  const [loading, setLoading] = useState(true)

  const [userId, setUserId] = useState<number | null>(null)

  const fetchAllBooks = useCallback(() => {
    const today = getTodayStr()
    const tomorrow = getTomorrowStr()
    const endDay = getAfter7DaysStr()

    // 今天 + 明天
    getBookList({
      pageNum: 1,
      pageSize: 1000,
      isCanceled: '0',
      params: { beginTime: `${today} 00:00:00`, endTime: `${tomorrow} 23:59:59` },
    })
      .then((res) => { if (res.code === 200) setBooks(res.rows || []) })
      .catch(() => setBooks([]))

    // 我的预约
    if (userId) {
      getBookList({
        pageNum: 1,
        pageSize: 1000,
        bookerId: userId,
        params: { beginTime: `${today} 00:00:00`, endTime: `${endDay} 23:59:59` },
      })
        .then((res) => {
          if (res.code === 200) {
            setMyBooks((res.rows || []).sort((a, b) => a.meetingStartTime.localeCompare(b.meetingStartTime)))
          }
        })
        .catch(() => setMyBooks([]))
    }
  }, [userId])

  useEffect(() => {
    setLoading(true)
    getUserInfo()
      .then((userRes) => {
        if (userRes.code === 200 && userRes.user) {
          const id = (userRes.user as Record<string, unknown>).userId as number
          if (id) setUserId(id)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (userId === null) return
    setLoading(true)
    fetchAllBooks()
    setLoading(false)
  }, [userId, fetchAllBooks])

  const { todayBooks, tomorrowBooks } = useMemo(() => {
    const today = getTodayStr()
    const tomorrow = getTomorrowStr()
    const sortFn = (a: MeetingBook, b: MeetingBook) =>
      a.meetingStartTime.localeCompare(b.meetingStartTime)

    return {
      todayBooks: books.filter((b) => b.meetingStartTime?.startsWith(today)).sort(sortFn),
      tomorrowBooks: books.filter((b) => b.meetingStartTime?.startsWith(tomorrow)).sort(sortFn),
    }
  }, [books])

  const handleCancel = async (bookId: number, bookerId: number) => {
    if (bookerId !== userId) { message.error('只能操作自己的会议'); return }
    try {
      const res = await editBook({ bookId, isCanceled: '1', bookerId })
      if (res.code === 200) {
        message.success('已取消预约')
        fetchAllBooks()
      } else {
        message.error(res.msg || '操作失败')
      }
    } catch {
      message.error('网络异常')
    }
  }

  const handleRestore = async (bookId: number, bookerId: number) => {
    if (bookerId !== userId) { message.error('只能操作自己的会议'); return }
    try {
      const res = await editBook({ bookId, isCanceled: '0', bookerId })
      if (res.code === 200) {
        message.success('已恢复预约')
        fetchAllBooks()
      } else {
        message.error(res.msg || '操作失败')
      }
    } catch {
      message.error('网络异常')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        <Spin tip="加载日程中..." />
      </div>
    )
  }

  const renderDaySchedule = (title: string, dayBooks: MeetingBook[]) => (
    <Card
      title={
        <Text strong style={{ fontSize: 12 }}>
          <ClockCircleOutlined style={{ marginRight: 4, color: '#1677ff' }} />
          {title}
        </Text>
      }
      size="small"
      style={{ marginBottom: 8 }}
      styles={{ body: { padding: '4px 8px' } }}
    >
      {dayBooks.length === 0 ? (
        <Text type="secondary" style={{ fontSize: 11 }}>暂无会议预定</Text>
      ) : (
        dayBooks.map((book) => {
          const status = getStatusTag(book)
          return (
            <div
              key={book.bookId}
              style={{
                padding: '4px 6px',
                marginBottom: 3,
                borderLeft: `3px solid ${status.color === 'blue' ? '#1677ff' : status.color === 'orange' ? '#fa8c16' : '#d9d9d9'}`,
                background: '#fafafa',
                borderRadius: 3,
              }}
            >
              <Text type="secondary" style={{ fontSize: 10, whiteSpace: 'nowrap' }}>
                {formatTime(book.meetingStartTime)}-{formatTime(book.meetingEndTime)}
              </Text>
              <Tag color="blue" style={{ fontSize: 9, lineHeight: '14px', margin: '0 4px' }}>{book.roomName}</Tag>
              <Text strong style={{ fontSize: 11 }}>{book.meetingName}</Text>
              <Text type="secondary" style={{ fontSize: 10 }}>
                <UserOutlined style={{ marginRight: 1 }} />{book.bookerName}
              </Text>
              <Tag color={status.color} style={{ fontSize: 9, lineHeight: '12px', margin: 0, marginLeft: 'auto' }}>
                {status.text}
              </Tag>
            </div>
          )
        })
      )}
    </Card>
  )

  const renderMyBooks = () => (
    <Card
      title={
        <Text strong style={{ fontSize: 12 }}>
          <CalendarOutlined style={{ marginRight: 4, color: '#1677ff' }} />
          我的预约
        </Text>
      }
      size="small"
      styles={{ body: { padding: '4px 8px' } }}
    >
      {myBooks.length === 0 ? (
        <Text type="secondary" style={{ fontSize: 11 }}>暂无预约</Text>
      ) : (
        myBooks.map((book) => {
          const isCanceled = book.isCanceled === '1'
          return (
            <div
              key={book.bookId}
              style={{
                padding: '4px 6px',
                marginBottom: 3,
                borderLeft: `3px solid ${isCanceled ? '#d9d9d9' : '#d9d9d9'}`,
                background: isCanceled ? '#fff' : '#fafafa',
                borderRadius: 3,
                opacity: isCanceled ? 0.6 : 1,
              }}
            >
              <Text type="secondary" style={{ fontSize: 10, whiteSpace: 'nowrap' }}>
                {formatTime(book.meetingStartTime)}-{formatTime(book.meetingEndTime)}
              </Text>
              <Tag color="blue" style={{ fontSize: 9, lineHeight: '14px', margin: '0 4px' }}>{book.roomName}</Tag>
              <Text strong style={{ fontSize: 11 }}>{book.meetingName}</Text>
              <span style={{ marginLeft: 'auto' }}>
                {book.isFinished !== '1' && new Date(book.meetingStartTime).getTime() > Date.now() && (
                  isCanceled ? (
                    <Button size="small" type="link" style={{ fontSize: 9, padding: 0, height: 16 }} onClick={() => handleRestore(book.bookId, book.bookerId)}>
                      恢复
                    </Button>
                  ) : (
                    <Button size="small" type="link" danger style={{ fontSize: 9, padding: 0, height: 16 }} onClick={() => handleCancel(book.bookId, book.bookerId)}>
                      取消
                    </Button>
                  )
                )}
              </span>
            </div>
          )
        })
      )}
    </Card>
  )

  return (
    <div>
      {renderDaySchedule(`今天 (${getTodayStr()})`, todayBooks)}
      {renderDaySchedule(`明天 (${getTomorrowStr()})`, tomorrowBooks)}
      {renderMyBooks()}
    </div>
  )
}

// ==================== 会议室卡片 ====================
function RoomCardItem({ room }: { room: MeetingRoom }) {
  const { openBookModal } = useBookModal()
  const imgSrc = room.imageUrl ? toImageUrl(room.imageUrl) : ''

  return (
    <Card
      hoverable
      size="small"
      style={{ marginBottom: 8 }}
      cover={
        imgSrc ? (
          <div style={{ height: 100, overflow: 'hidden' }}>
            <img src={imgSrc} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div
            style={{
              height: 100,
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EnvironmentOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
          </div>
        )
      }
      styles={{ body: { padding: '8px 10px' } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text strong style={{ fontSize: 12 }}>{room.name}</Text>
        <Button type="primary" size="small" style={{ fontSize: 10, padding: '0 6px' }} onClick={() => openBookModal(room.name, room.roomId)}>
          预约
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Tag style={{ fontSize: 10 }}>{room.areaSize}</Tag>
        <Tag style={{ fontSize: 10 }}>{room.layout}</Tag>
        <Tag color="blue" style={{ fontSize: 10 }}>{room.normalCapacity}人</Tag>
      </div>
    </Card>
  )
}

// ==================== 手机主页面 ====================
function MeetingMobile() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRoomList()
      .then((res) => { if (res.code === 200) setRooms(res.rows || []) })
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* 上部：会议预定日程 */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0f0', overflowY: 'auto', maxHeight: '40%' }}>
        <Text strong style={{ fontSize: 13, marginBottom: 6, display: 'block' }}>会议预定日程</Text>
        <BookingSchedule />
      </div>

      {/* 下部：会议室卡片 */}
      <div style={{ flex: 1, padding: 10, overflowY: 'auto' }}>
        {loading ? (
          <Spin tip="加载中...">
            <div style={{ height: 200 }} />
          </Spin>
        ) : rooms.length === 0 ? (
          <Empty description="暂无会议室数据" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {rooms.map((room) => (
              <RoomCardItem key={room.roomId} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingMobile
