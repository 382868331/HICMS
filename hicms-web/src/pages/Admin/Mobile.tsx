import { useState, useEffect } from 'react'
import { Tabs, Typography, Spin, Button } from 'antd'
import { getUserInfo } from '../../api/auth'
import { useNavigate } from 'react-router-dom'
import {
  BookManagement,
  RoomManagement,
  MemberManagement,
  UserManagement,
  LlmManagement,
  RagManagement,
  FileManagement,
  OnlineUserManagement,
  DashboardView,
  ParamConfig,
  TemplateManagement,
} from './shared'
import './admin.css'

const { Title } = Typography

function AdminMobile() {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    getUserInfo().then((res) => {
      if (res.code === 200 && res.user?.userType === '00') {
        setAuthorized(true)
      } else {
        setAuthorized(false)
      }
    }).catch(() => setAuthorized(false))
  }, [])

  if (authorized === null) return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }} />
  if (authorized === false) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <Title level={4} type="secondary">无权访问管理中心</Title>
        <Button onClick={() => navigate('/meeting', { replace: true })}>返回首页</Button>
      </div>
    )
  }

  const tabItems = [
    { key: 'dashboard', label: '数据大盘', children: <DashboardView /> },
    { key: 'book', label: '预约会议', children: <BookManagement /> },
    { key: 'room', label: '会议室', children: <RoomManagement /> },
    { key: 'member', label: '工作人员', children: <MemberManagement /> },
    { key: 'user', label: '用户管理', children: <UserManagement /> },
    { key: 'online', label: '在线用户', children: <OnlineUserManagement /> },
    { key: 'llm', label: '大模型', children: <LlmManagement /> },
    { key: 'rag', label: '知识库', children: <RagManagement /> },
    { key: 'file', label: '文件管理', children: <FileManagement /> },
    { key: 'param', label: '参数配置', children: <ParamConfig /> },
    { key: 'template', label: '模板管理', children: <TemplateManagement /> },
  ]

  return (
    <div style={{ flex: 1, padding: '4px 6px', overflowY: 'auto' }}>
      <Tabs className="admin-tabs" defaultActiveKey="dashboard" items={tabItems} />
    </div>
  )
}

export default AdminMobile
