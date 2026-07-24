import './book.css'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Calendar, TimePicker, Switch, Radio, message } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { addBook, getBookList, type MeetingBook } from '../../api/book'

export interface BookModalProps {
  visible: boolean
  roomName: string
  roomId: number
  onClose: () => void
  onSuccess: () => void
}

function toDateTimeStr(d: Dayjs, t: Dayjs) {
  return `${d.format('YYYY-MM-DD')} ${t.format('HH:mm')}:00`
}

function BookModal({ visible, roomName, roomId, onClose, onSuccess }: BookModalProps) {
  const [meetingName, setMeetingName] = useState('')
  const [leaderName, setLeaderName] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [lineType, setLineType] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [bookings, setBookings] = useState<MeetingBook[]>([])

  const now = dayjs()
  const today = now.startOf('day')
  const maxDate = today.add(7, 'day')

  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [startTime, setStartTime] = useState<Dayjs>(now)
  const [endTime, setEndTime] = useState<Dayjs>(now)

  useEffect(() => {
    if (visible) {
      setMeetingName(''); setLeaderName(''); setIsOnline(false)
      setLineType('')
      setShowDetail(false); setStartDate(null); setEndDate(null)
      const n = dayjs(); setStartTime(n); setEndTime(n)
      // 查询该会议室前后8天的预定
      const t = dayjs()
      getBookList({
        roomId,
        pageSize: 999,
        params: {
          beginTime: t.subtract(8, 'day').format('YYYY-MM-DD 00:00:00'),
          endTime: t.add(8, 'day').format('YYYY-MM-DD 23:59:59'),
        },
      }).then(res => {
        if (res.code === 200) setBookings(res.rows || [])
      }).catch(() => setBookings([]))
    }
  }, [visible, roomId])

  const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    if (visible) { document.addEventListener('keydown', handleKeyDown); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = '' }
  }, [visible, handleKeyDown])

  const bookingsMap = useMemo(() => {
    const map = new Map<string, MeetingBook[]>()
    bookings.forEach(b => {
      if (b.meetingStartTime) {
        const d = dayjs(b.meetingStartTime).format('YYYY-MM-DD')
        if (!map.has(d)) map.set(d, [])
        map.get(d)!.push(b)
      }
    })
    // 每个日期的预定按开始时间排序
    map.forEach((list) => list.sort((a, b) => {
      if (!a.meetingStartTime) return 1
      if (!b.meetingStartTime) return -1
      return dayjs(a.meetingStartTime).valueOf() - dayjs(b.meetingStartTime).valueOf()
    }))
    return map
  }, [bookings])

  // DOM 方式给有预定的日期按时间比例涂蓝（24小时可视化）
  const calRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!calRef.current || !visible || bookingsMap.size === 0) return
    const container = calRef.current

    // 重试机制：antd Calendar 首次渲染可能较慢
    let attempts = 0
    let timer: ReturnType<typeof setTimeout>
    const tryInject = () => {
      container.querySelectorAll('.book-cal-bar').forEach(el => el.remove())
      let injected = false
      bookingsMap.forEach((dayBookings, key) => {
        const td = container.querySelector(`td[title="${key}"]`)
        if (!td) return
        const inner = td.querySelector('.ant-picker-cell-inner') as HTMLElement | null
        if (!inner) return
        if (inner.querySelector('.book-cal-bar')) return

        const overlay = document.createElement('div')
        overlay.className = 'book-cal-bar'
        overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;'

        dayBookings.forEach(b => {
          if (!b.meetingStartTime) return
          const start = dayjs(b.meetingStartTime)
          const end = b.meetingEndTime ? dayjs(b.meetingEndTime) : start.add(1, 'hour')
          const startMin = start.hour() * 60 + start.minute()
          const endMin = end.hour() * 60 + end.minute()
          if (endMin <= startMin) return
          const top = (startMin / 1440) * 100
          const h = ((endMin - startMin) / 1440) * 100

          const bar = document.createElement('div')
          bar.style.cssText = `position:absolute;left:0;right:0;top:${top}%;height:${h}%;min-height:3px;background:var(--accent);opacity:0.55;`
          overlay.appendChild(bar)
        })

        inner.appendChild(overlay)
        injected = true
      })
      // 如果没涂上且重试未满，隔一会儿再试
      if (!injected && attempts < 8) {
        attempts++
        timer = setTimeout(tryInject, 120 * attempts)
      }
    }
    timer = setTimeout(tryInject, 120)
    return () => clearTimeout(timer)
  }, [bookingsMap, visible])

  if (!visible) return null

  const canSubmit = startDate !== null && (!isOnline || lineType !== '')

  const handleSubmit = async () => {
    if (!canSubmit || !startDate) return

    const newStart = startDate.hour(startTime.hour()).minute(startTime.minute())
    const newEnd = (endDate || startDate).hour(endTime.hour()).minute(endTime.minute())

    if (!newEnd.isAfter(newStart)) { message.warning('结束时间必须晚于开始时间'); return }
    const mins = newEnd.diff(newStart, 'minute')
    if (mins > 480) { message.warning('会议时间不能超过 8 小时'); return }

    // 前端检查：是否与已有预定时间冲突
    for (const b of bookings) {
      if (!b.meetingStartTime || !b.meetingEndTime) continue
      const bStart = dayjs(b.meetingStartTime)
      const bEnd = dayjs(b.meetingEndTime)
      if (newStart.isBefore(bEnd) && newEnd.isAfter(bStart)) {
        message.warning(`该时间段已被预定（${b.bookerName || '已有预定'} ${bStart.format('HH:mm')}-${bEnd.format('HH:mm')}）`)
        return
      }
    }

    setLoading(true)
    try {
      const data: Record<string, unknown> = {
        roomName, roomId, meetingName: meetingName.trim(), leaderName: leaderName.trim(),
        meetingStartTime: toDateTimeStr(startDate, startTime),
        meetingEndTime: endDate ? toDateTimeStr(endDate, endTime) : undefined,
        isOnline: isOnline ? '1' : '0',
        isHxy: lineType === 'hxy' ? '1' : '0',
        isJyjLine: lineType === 'jyj' ? '1' : '0',
        isGbLine: lineType === 'gb' ? '1' : '0',
      }
      const res = await addBook(data as Parameters<typeof addBook>[0])
      if (res.code === 200) {
        message.success('会议预定成功')
        onSuccess()
      } else {
        message.error(res.msg || '预定失败')
      }
    } catch {
      message.error('网络错误，请稍后重试')
    }
    finally { setLoading(false) }
  }

  // 日历：只能选今天 ~ 今天+7天
  const disabledDate = (d: Dayjs) => {
    const day = d.startOf('day')
    return day.isBefore(today) || day.isAfter(maxDate)
  }

  const handleDateSelect = (d: Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(d); setEndDate(d)
    } else {
      if (d.isBefore(startDate)) { setEndDate(startDate); setStartDate(d) }
      else setEndDate(d)
    }
  }

  const isStartToday = startDate && startDate.isSame(today, 'day')
  const isEndMax = endDate && endDate.isSame(maxDate, 'day')

  const disabledStartTime = () => {
    if (!isStartToday) return {}
    const h = now.hour(), m = now.minute()
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(i => i < h),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === h) return Array.from({ length: 60 }, (_, i) => i).filter(i => i < m)
        return []
      },
    }
  }

  const disabledEndTime = () => {
    if (!isEndMax) return {}
    const h = now.hour(), m = now.minute()
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(i => i > h),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === h) return Array.from({ length: 60 }, (_, i) => i).filter(i => i > m)
        return []
      },
    }
  }

  // 选中日期的预定详情（按开始时间从早到晚排序）
  const selectedKey = startDate?.format('YYYY-MM-DD')
  const selectedBookings = selectedKey
    ? (bookingsMap.get(selectedKey) || []).slice().sort((a, b) => {
        if (!a.meetingStartTime) return 1
        if (!b.meetingStartTime) return -1
        return dayjs(a.meetingStartTime).valueOf() - dayjs(b.meetingStartTime).valueOf()
      })
    : []

  const handleOverlayClick = (e: React.MouseEvent) => { if (e.target === e.currentTarget) onClose() }

  return (
    <div className="book-overlay" onClick={handleOverlayClick}>
      <div className="book-container">
        {/* 标题栏 —— 固定不滚动 */}
        <div className="book-header">
          <h3 className="book-title">预定会议</h3>
          <span className="book-room-name">{roomName}</span>
          <button className="book-close" onClick={onClose}>&times;</button>
        </div>

        {/* 表单区域 —— 可滚动 */}
        <div className="book-scroll">
          <div className="book-body">
            {/* antd Calendar */}
            <div className="book-cal-section" ref={calRef}>
              <Calendar
                fullscreen={false}
                disabledDate={disabledDate}
                onSelect={handleDateSelect}
                value={startDate || undefined}
              />
            </div>

            {/* 选中日期的预定信息 */}
            {selectedBookings.length > 0 && (
              <div className="book-booking-list">
                <div className="book-booking-list-title">
                  当日预定 ({selectedBookings.length})
                </div>
                {selectedBookings.map((b) => (
                  <div key={b.bookId} className="book-booking-card">
                    <span className="book-booking-time">
                      {dayjs(b.meetingStartTime).format('HH:mm')}
                      {b.meetingEndTime ? ` - ${dayjs(b.meetingEndTime).format('HH:mm')}` : ''}
                    </span>
                    {b.meetingName && <span> · {b.meetingName}</span>}
                    {b.bookerName && <span> · {b.bookerName}</span>}
                    {b.isOnline === '1' && <span className="book-booking-tag">线上</span>}
                  </div>
                ))}
              </div>
            )}

            {/* 时间选择 */}
            {startDate ? (
              <div className="book-time-row">
                <div className="book-time-group">
                  <span className="book-time-label">开始</span>
                  <TimePicker
                    value={startTime}
                    onChange={(v) => { if (v) setStartTime(v) }}
                    format="HH:mm"
                    disabledTime={disabledStartTime}
                    allowClear={false}
                    showNow={false}
                    needConfirm={false}
                    getPopupContainer={trigger => trigger.parentElement!}
                    popupStyle={{ zIndex: 12000 }}
                    className="book-time-picker"
                  />
                </div>
                <span className="book-time-arrow">&rarr;</span>
                <div className="book-time-group">
                  <span className="book-time-label">结束</span>
                  <TimePicker
                    value={endTime}
                    onChange={(v) => { if (v) setEndTime(v) }}
                    format="HH:mm"
                    disabledTime={disabledEndTime}
                    allowClear={false}
                    showNow={false}
                    needConfirm={false}
                    getPopupContainer={trigger => trigger.parentElement!}
                    popupStyle={{ zIndex: 12000 }}
                    className="book-time-picker"
                  />
                </div>
              </div>
            ) : (
              <div className="book-date-hint">请点击日历选择日期</div>
            )}

            {/* 线上会议 - antd Switch 小号 */}
            <div className="book-switch-row">
              <span className="book-switch-label">线上会议</span>
              <Switch size="small"
                checked={isOnline}
                onChange={(v) => {
                  setIsOnline(v)
                  if (!v) { setLineType('') }
                }}
              />
            </div>

            {isOnline && (
              <div className="book-line-row">
                <label className="book-label">线路类型 <span className="book-required">*</span></label>
                <Radio.Group
                  value={lineType}
                  onChange={(e) => { setLineType(e.target.value) }}
                  optionType="button"
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="hxy">好信云</Radio.Button>
                  <Radio.Button value="jyj">机要局</Radio.Button>
                  <Radio.Button value="gb">国办</Radio.Button>
                </Radio.Group>
              </div>
            )}

            {!showDetail ? (
              <div className="book-detail-toggle" onClick={() => setShowDetail(true)}>填写详细信息 ▾</div>
            ) : (
              <>
                <div className="book-detail-toggle" onClick={() => setShowDetail(false)}>收起 ▲</div>
                <div className="book-detail-body">
                  <div className="book-field">
                    <label className="book-label">会议名称</label>
                    <input className="book-input" type="text" value={meetingName}
                      onChange={(e) => setMeetingName(e.target.value)} placeholder="请输入会议名称" />
                  </div>
                  <div className="book-field">
                    <label className="book-label">领导名称</label>
                    <input className="book-input" type="text" value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)} placeholder="请输入领导名称" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 底部按钮 —— 固定不滚动 */}
        <div className="book-footer">
          <button className="book-btn-cancel" onClick={onClose}>取消</button>
          <button className="book-btn-submit" disabled={!canSubmit || loading} onClick={handleSubmit}>
            {loading ? '预定中...' : '确认预定'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookModal
