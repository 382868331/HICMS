import { useNavigate } from 'react-router-dom'
import { Divider, Typography } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  LogoutOutlined,
  BellOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { logout } from '../../api/auth'
import { clearToken } from '../../utils/request'
import { useNotice } from '../../context/NoticeContext'

const { Paragraph } = Typography

// 随机备案号
const ICP_NUM = '黑ICP备' + Math.random().toString(36).substring(2, 10) + '号'

interface Props {
  variant?: 'popover' | 'page'
  onNavigate?: () => void
}

function ProfileContent({ variant = 'page', onNavigate }: Props) {
  const navigate = useNavigate()
  const { openNotice } = useNotice()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearToken()
      navigate('/', { replace: true })
      window.location.reload()
    }
  }

  const handleNavigate = (path: string) => {
    onNavigate?.()
    navigate(path)
  }

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: variant === 'popover' ? '8px 0' : '12px 16px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#333',
    borderRadius: variant === 'popover' ? 4 : 8,
    transition: 'background 0.2s',
  }

  const renderMenuItem = (icon: React.ReactNode, label: string, onClick: () => void) => (
    <div
      style={menuItemStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = '#f5f5f5'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  )

  const footerInfo = (
    <div style={{ fontSize: 12, color: '#999', lineHeight: '20px', padding: variant === 'popover' ? '4px 0' : '8px 16px' }}>
      <div>{ICP_NUM}</div>
      <div>ICP备案：{ICP_NUM}</div>
      <div>开发者：黑龙江省政府信息化技术服务中心</div>
      <div>地址：黑龙江省政府信息化技术服务中心</div>
    </div>
  )

  // ========== Popover 模式 (PC / Tablet) ==========
  if (variant === 'popover') {
    return (
      <div style={{ width: 240, userSelect: 'none' }}>
        {renderMenuItem(<UserOutlined />, '修改信息', () => handleNavigate('/profile/edit'))}
        {renderMenuItem(<PhoneOutlined />, '联系我们', () => handleNavigate('/profile/contact'))}
        <Divider style={{ margin: '4px 0' }} />
        {renderMenuItem(<LogoutOutlined style={{ color: '#ff4d4f' }} />, '退出登录', handleLogout)}
        <Divider style={{ margin: '4px 0' }} />
        {footerInfo}
      </div>
    )
  }

  // ========== 手机端 全页面 ==========
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        {renderMenuItem(<BellOutlined style={{ fontSize: 18 }} />, '消息通知', () => {
          openNotice()
          onNavigate?.()
        })}
        {renderMenuItem(<UserOutlined style={{ fontSize: 18 }} />, '修改信息', () => handleNavigate('/profile/edit'))}
        {renderMenuItem(<PhoneOutlined style={{ fontSize: 18 }} />, '联系我们', () => handleNavigate('/profile/contact'))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        {renderMenuItem(
          <LogoutOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />,
          '退出登录',
          handleLogout,
        )}

        <Divider style={{ margin: '8px 0' }} />

        <div style={{ padding: '0 16px' }}>
          <Paragraph style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>{ICP_NUM}</Paragraph>
          <Paragraph style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>ICP备案：{ICP_NUM}</Paragraph>
          <Paragraph style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            开发者：黑龙江省政府信息化技术服务中心
          </Paragraph>
          <Paragraph style={{ fontSize: 12, color: '#999', marginBottom: 0 }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            地址：黑龙江省政府信息化技术服务中心
          </Paragraph>
        </div>
      </div>
    </div>
  )
}

export default ProfileContent
