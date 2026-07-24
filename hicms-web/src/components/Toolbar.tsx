import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Popover } from 'antd'
import { useDeviceType } from '../hooks/useDeviceType'
import logoSvg from '../assets/logo.svg'
import noticeSvg from '../assets/notice.svg'
import avatarPng from '../assets/avatar.png'
import { MeetingIcon, ContactsIcon, AIIcon, AdminIcon, ToolsIcon, ProfileIcon } from './icons'
import { getUserInfo } from '../api/auth'
import ProfileContent from '../pages/Profile/ProfileContent'
import './toolbar.css'

interface ToolbarProps {
  onNoticeClick: () => void
}

function Toolbar({ onNoticeClick }: ToolbarProps) {
  const deviceType = useDeviceType()
  const navigate = useNavigate()
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // 记录上一次的设备类型
  const prevDeviceType = useRef(deviceType)

  // 设备切换时处理
  useEffect(() => {
    const prev = prevDeviceType.current
    prevDeviceType.current = deviceType

    // 切换到手机端：关闭弹窗
    if (deviceType === 'mobile') {
      setProfileOpen(false)
    }

    // 从手机切换到 PC/平板：如果当前在 /profile 页面，跳转到会议页
    if (prev === 'mobile' && (deviceType === 'pc' || deviceType === 'tablet')) {
      if (location.pathname.startsWith('/profile')) {
        navigate('/meeting', { replace: true })
      }
    }
  }, [deviceType, location.pathname, navigate])

  useEffect(() => {
    getUserInfo().then((res) => {
      if (res.code === 200 && res.user?.userType === '00') {
        setIsAdmin(true)
      }
    }).catch(() => {})
  }, [])

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isActiveOrSub = (paths: string[]) => {
    return paths.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'))
  }

  if (deviceType === 'pc') {
    return (
      <header className="pc-toolbar">
        <div className="toolbar-left" onClick={() => navigate('/meeting')}>
          <img src={logoSvg} alt="logo" className="toolbar-logo unselectable" draggable={false} />
          <span className="toolbar-brand unselectable">信息中心</span>
        </div>

        <nav className="toolbar-center">
          <NavLink to="/meeting" className={({ isActive: a }) => `nav-item${a ? ' active' : ''}`}>
            会议
          </NavLink>
          <NavLink to="/contacts" className={({ isActive: a }) => `nav-item${a ? ' active' : ''}`}>
            通讯录
          </NavLink>
          <NavLink to="/ai" className={({ isActive: a }) => `nav-item${a ? ' active' : ''}`}>
            AI助手
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive: a }) => `nav-item${a ? ' active' : ''}`}>
              管理中心
            </NavLink>
          )}
        </nav>

        <div className="toolbar-right">
          <img
            src={noticeSvg}
            alt="通知"
            className="toolbar-notice"
            onClick={onNoticeClick}
            style={{ cursor: 'pointer' }}
          />
          <Popover
            open={profileOpen}
            onOpenChange={setProfileOpen}
            content={<ProfileContent variant="popover" onNavigate={() => setProfileOpen(false)} />}
            trigger="click"
            placement="bottomRight"
            overlayInnerStyle={{ borderRadius: 8, padding: '8px 16px' }}
          >
            <img
              src={avatarPng}
              alt="头像"
              className="toolbar-avatar"
              style={{ cursor: 'pointer' }}
            />
          </Popover>
        </div>
      </header>
    )
  }

  if (deviceType === 'tablet') {
    return (
      <aside className="tablet-sidebar">
        <div className="sidebar-top" onClick={() => navigate('/meeting')}>
          <img src={logoSvg} alt="logo" className="sidebar-logo unselectable" draggable={false} />
        </div>

        <nav className="sidebar-center">
          <NavLink to="/meeting" className={({ isActive: a }) => `side-item${a ? ' active' : ''}`}>
            <MeetingIcon className="side-icon" />
            <span className="side-label">会议</span>
          </NavLink>
          <NavLink to="/contacts" className={({ isActive: a }) => `side-item${a ? ' active' : ''}`}>
            <ContactsIcon className="side-icon" />
            <span className="side-label">通讯录</span>
          </NavLink>
          <NavLink to="/ai" className={({ isActive: a }) => `side-item${a ? ' active' : ''}`}>
            <AIIcon className="side-icon" />
            <span className="side-label">AI助手</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive: a }) => `side-item${a ? ' active' : ''}`}>
              <AdminIcon className="side-icon" />
              <span className="side-label">管理中心</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-bottom">
          <img
            src={noticeSvg}
            alt="通知"
            className="sidebar-icon"
            onClick={onNoticeClick}
            style={{ cursor: 'pointer' }}
          />
          <Popover
            open={profileOpen}
            onOpenChange={setProfileOpen}
            content={<ProfileContent variant="popover" onNavigate={() => setProfileOpen(false)} />}
            trigger="click"
            placement="rightTop"
            overlayInnerStyle={{ borderRadius: 8, padding: '8px 16px' }}
          >
            <img
              src={avatarPng}
              alt="头像"
              className="sidebar-avatar"
              style={{ cursor: 'pointer' }}
            />
          </Popover>
        </div>
      </aside>
    )
  }

  // mobile
  const toolsActive = isActiveOrSub(['/tools', '/contacts', '/ai', '/admin'])
  const meActive = isActiveOrSub(['/me', '/profile'])

  return (
    <footer className="mobile-tabbar">
      <div
        className={`tab-item ${isActive('/meeting') ? 'active' : ''}`}
        onClick={() => navigate('/meeting')}
      >
        <MeetingIcon className="tab-icon-img" />
        <span className="tab-label">会议</span>
      </div>
      <div
        className={`tab-item ${toolsActive ? 'active' : ''}`}
        onClick={() => navigate('/tools')}
      >
        <ToolsIcon className="tab-icon-img" />
        <span className="tab-label">工具</span>
      </div>
      <div
        className={`tab-item ${meActive ? 'active' : ''}`}
        onClick={() => navigate('/me')}
      >
        <ProfileIcon className="tab-icon-img" />
        <span className="tab-label">我</span>
      </div>
    </footer>
  )
}

export default Toolbar
