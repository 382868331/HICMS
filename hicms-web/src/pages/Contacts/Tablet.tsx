import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Card, Spin, Empty, Tag, Typography, Button, Space, Avatar, Divider, Tooltip, Flex,
} from 'antd'
import {
  TeamOutlined, PhoneOutlined, MailOutlined, WechatOutlined, CalendarOutlined,
  MessageOutlined, BellOutlined, SoundOutlined, QrcodeOutlined, UserOutlined,
} from '@ant-design/icons'
import { getMemberList, type MeetingMember } from '../../api/worker'
import ActionModals, { type ActionType } from '../../components/contacts/ActionModals'

const { Title, Text } = Typography

function getDateStr(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const ACTION_BUTTONS: { key: ActionType; icon: React.ReactNode; label: string; color: string }[] = [
  { key: 'call', icon: <PhoneOutlined />, label: '网络电话', color: '#1677ff' },
  { key: 'aiCall', icon: <SoundOutlined />, label: 'AI通知', color: '#722ed1' },
  { key: 'sms', icon: <MessageOutlined />, label: '短信', color: '#fa8c16' },
  { key: 'wechat', icon: <QrcodeOutlined />, label: '扫码添加', color: '#52c41a' },
  { key: 'email', icon: <MailOutlined />, label: '邮件', color: '#13c2c2' },
  { key: 'miniapp', icon: <BellOutlined />, label: '小程序通知', color: '#eb2f96' },
]

function ContactsTablet() {
  const [members, setMembers] = useState<MeetingMember[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAction, setModalAction] = useState<ActionType | null>(null)
  const [modalMember, setModalMember] = useState<MeetingMember | null>(null)

  useEffect(() => {
    setLoading(true)
    const beginDate = getDateStr(-6)
    const endDate = getDateStr(0)
    getMemberList({
      pageNum: 1,
      pageSize: 1000,
      isCurrentDuty: '1',
      params: { beginDutyDate: beginDate, endDutyDate: endDate },
    })
      .then((res) => { if (res.code === 200) setMembers(res.rows || []) })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  const getVisibleActions = useCallback((record: MeetingMember) =>
    ACTION_BUTTONS.filter((btn) => {
      if (btn.key === 'call' || btn.key === 'aiCall' || btn.key === 'sms') return !!record.phone
      if (btn.key === 'wechat') return !!record.wechat
      if (btn.key === 'email') return !!record.email
      if (btn.key === 'miniapp') return record.isMiniappAuth === '1'
      return false
    }), [])

  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, MeetingMember[]> = {}
    members.forEach((m) => {
      const dept = m.department || '未分配部门'
      if (!groups[dept]) groups[dept] = []
      groups[dept].push(m)
    })
    return groups
  }, [members])

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="加载值班信息..." />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, padding: 14, overflowY: 'auto', background: '#f5f5f5' }}>
      <Card bordered={false} style={{ marginBottom: 14, borderRadius: 8 }}>
        <Space>
          <CalendarOutlined style={{ fontSize: 18, color: '#1677ff' }} />
          <Title level={5} style={{ margin: 0 }}>最近七日各部门值班人员</Title>
          <Tag color="blue" style={{ fontSize: 11 }}>{getDateStr(-6)} ~ {getDateStr(0)}</Tag>
        </Space>
      </Card>

      {members.length === 0 ? (
        <Card bordered={false} style={{ borderRadius: 8 }}>
          <Empty description="暂无值班人员数据" />
        </Card>
      ) : (
        Object.entries(groupedByDepartment).map(([dept, deptMembers]) => (
          <Card
            key={dept}
            bordered={false}
            style={{ marginBottom: 14, borderRadius: 8 }}
            title={
              <Space>
                <Avatar size={28} icon={<TeamOutlined />} style={{ backgroundColor: '#1677ff' }} />
                <Text strong style={{ fontSize: 14 }}>{dept}</Text>
                <Tag>{deptMembers.length} 人</Tag>
              </Space>
            }
          >
            {deptMembers.map((m, idx) => {
              const actions = getVisibleActions(m)
              return (
                <div key={m.memberId}>
                  {/* 成员头部 */}
                  <Flex align="center" justify="space-between" style={{ padding: '8px 0' }}>
                    <Space>
                      <Avatar
                        size={32}
                        style={{ backgroundColor: m.isCurrentDuty === '1' ? '#ff4d4f' : '#1677ff' }}
                      >
                        {m.userName?.charAt(0) || <UserOutlined />}
                      </Avatar>
                      <div>
                        <Text strong style={{ fontSize: 14 }}>{m.userName}</Text>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                          {m.phone && <Text style={{ fontSize: 11 }}><PhoneOutlined style={{ color: '#1677ff' }} /> {m.phone}</Text>}
                          {m.wechat && <Text style={{ fontSize: 11, marginLeft: 8 }}><WechatOutlined style={{ color: '#52c41a' }} /> {m.wechat}</Text>}
                          {m.email && <Text style={{ fontSize: 11, marginLeft: 8 }}><MailOutlined style={{ color: '#13c2c2' }} /> {m.email}</Text>}
                        </div>
                      </div>
                    </Space>
                    <Space size={[2, 2]} wrap style={{ justifyContent: 'flex-end' }}>
                      {m.isInfoCenter === '1' && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>信息中心</Tag>}
                      {m.isJiyaoBureau === '1' && <Tag color="purple" style={{ fontSize: 10, margin: 0 }}>机要局</Tag>}
                      {m.isMeetingOrganizer === '1' && <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>办会</Tag>}
                      {m.isCurrentDuty === '1' && <Tag color="red" style={{ fontSize: 10, margin: 0 }}>值班中</Tag>}
                      {m.isMiniappAuth === '1' && <Tag color="green" style={{ fontSize: 10, margin: 0 }}>已授权</Tag>}
                    </Space>
                  </Flex>

                  {/* 操作按钮行 */}
                  {actions.length > 0 && (
                    <Flex gap={4} wrap="wrap" style={{ padding: '4px 0 8px 40px' }}>
                      {actions.map((act) => (
                        <Tooltip key={act.key} title={act.label}>
                          <Button
                            size="small"
                            icon={act.icon}
                            onClick={() => { setModalMember(m); setModalAction(act.key) }}
                            style={{ fontSize: 11, borderColor: act.color, color: act.color, borderRadius: 4 }}
                          >
                            {act.label}
                          </Button>
                        </Tooltip>
                      ))}
                    </Flex>
                  )}

                  {idx < deptMembers.length - 1 && <Divider style={{ margin: '0 0 0 40px' }} />}
                </div>
              )
            })}
          </Card>
        ))
      )}

      <ActionModals
        visible={modalAction !== null}
        actionType={modalAction}
        member={modalMember}
        onClose={() => { setModalAction(null); setModalMember(null) }}
      />
    </div>
  )
}

export default ContactsTablet
