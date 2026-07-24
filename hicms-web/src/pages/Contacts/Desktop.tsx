import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Card, Spin, Empty, Tag, Typography, Table, Button, Space, Avatar,
  Tooltip, Badge,
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

function getInitial(name: string): string {
  return name ? name.charAt(0) : '?'
}

const ACTION_BUTTONS: { key: ActionType; icon: React.ReactNode; label: string; color: string }[] = [
  { key: 'call', icon: <PhoneOutlined />, label: '网络电话', color: '#1677ff' },
  { key: 'aiCall', icon: <SoundOutlined />, label: 'AI通知', color: '#722ed1' },
  { key: 'sms', icon: <MessageOutlined />, label: '短信', color: '#fa8c16' },
  { key: 'wechat', icon: <QrcodeOutlined />, label: '扫码添加', color: '#52c41a' },
  { key: 'email', icon: <MailOutlined />, label: '邮件', color: '#13c2c2' },
  { key: 'miniapp', icon: <BellOutlined />, label: '小程序通知', color: '#eb2f96' },
]

function ContactsDesktop() {
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

  const columns = useMemo(() => [
    {
      title: '姓名', dataIndex: 'userName', key: 'userName', width: 90, fixed: 'left' as const,
      render: (text: string, record: MeetingMember) => (
        <Space>
          <Avatar size={28} style={{ backgroundColor: record.isCurrentDuty === '1' ? '#ff4d4f' : '#1677ff', flexShrink: 0 }}>
            {getInitial(text)}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '手机号', dataIndex: 'phone', key: 'phone', width: 120,
      render: (text: string) => text ? (
        <Text style={{ fontSize: 12 }}>
          <PhoneOutlined style={{ marginRight: 4, color: '#1677ff' }} />{text}
        </Text>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>-</Text>,
    },
    {
      title: '微信', dataIndex: 'wechat', key: 'wechat', width: 110,
      render: (text: string) => text ? (
        <Text style={{ fontSize: 12 }}>
          <WechatOutlined style={{ marginRight: 4, color: '#52c41a' }} />{text}
        </Text>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>-</Text>,
    },
    {
      title: '邮箱', dataIndex: 'email', key: 'email', width: 170, ellipsis: true,
      render: (text: string) => text ? (
        <Text style={{ fontSize: 12 }}>
          <MailOutlined style={{ marginRight: 4, color: '#13c2c2' }} />{text}
        </Text>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>-</Text>,
    },
    {
      title: '身份标签', key: 'tags', width: 180,
      render: (_: unknown, record: MeetingMember) => (
        <Space size={[2, 2]} wrap>
          {record.isInfoCenter === '1' && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>信息中心</Tag>}
          {record.isJiyaoBureau === '1' && <Tag color="purple" style={{ fontSize: 10, margin: 0 }}>机要局</Tag>}
          {record.isMeetingOrganizer === '1' && <Tag color="orange" style={{ fontSize: 10, margin: 0 }}>办会</Tag>}
          {record.isCurrentDuty === '1' && <Badge status="processing" text={<Text style={{ fontSize: 10 }}>值班中</Text>} />}
          {record.isMiniappAuth === '1' && <Tag color="green" style={{ fontSize: 10, margin: 0 }}>已授权</Tag>}
        </Space>
      ),
    },
    {
      title: '备注', dataIndex: 'remark', key: 'remark', width: 140, ellipsis: true,
      render: (text: string) => <Text type="secondary" style={{ fontSize: 12 }}>{text || '-'}</Text>,
    },
    {
      title: '操作', key: 'actions', width: 260, fixed: 'right' as const,
      render: (_: unknown, record: MeetingMember) => {
        const actions = getVisibleActions(record)
        if (actions.length === 0) return <Text type="secondary" style={{ fontSize: 11 }}>-</Text>
        return (
          <Space size={[4, 4]} wrap>
            {actions.map((act) => (
              <Tooltip key={act.key} title={act.label}>
                <Button
                  size="small"
                  icon={act.icon}
                  onClick={() => { setModalMember(record); setModalAction(act.key) }}
                  style={{
                    fontSize: 11,
                    padding: '0 6px',
                    borderColor: act.color,
                    color: act.color,
                    height: 24,
                  }}
                >
                  {act.label}
                </Button>
              </Tooltip>
            ))}
          </Space>
        )
      },
    },
  ], [getVisibleActions])

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
    <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#f5f5f5' }}>
      <Card bordered={false} style={{ marginBottom: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <CalendarOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <Title level={4} style={{ margin: 0 }}>最近七日各部门值班人员</Title>
            <Tag color="blue">{getDateStr(-6)} ~ {getDateStr(0)}</Tag>
          </Space>
          <Text type="secondary">共 {Object.keys(groupedByDepartment).length} 个部门，{members.length} 名值班人员</Text>
        </div>
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
            style={{ marginBottom: 16, borderRadius: 8 }}
            title={
              <Space>
                <Avatar size={32} icon={<TeamOutlined />} style={{ backgroundColor: '#1677ff' }} />
                <Text strong style={{ fontSize: 15 }}>{dept}</Text>
                <Tag>{deptMembers.length} 人</Tag>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={deptMembers}
              rowKey="memberId"
              pagination={false}
              size="small"
              scroll={{ x: 1050 }}
              style={{ marginTop: -8 }}
            />
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

export default ContactsDesktop
