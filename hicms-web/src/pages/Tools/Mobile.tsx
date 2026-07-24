import { useNavigate } from 'react-router-dom'
import { ContactsIcon, AIIcon, AdminIcon } from '../../components/icons'

const menuItems = [
  { label: '通讯录', path: '/contacts', Icon: ContactsIcon },
  { label: 'AI助手', path: '/ai', Icon: AIIcon },
  { label: '管理中心', path: '/admin', Icon: AdminIcon },
]

function ToolsMobile() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
      {menuItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          <item.Icon style={{ width: 28, height: 28, flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-h)' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default ToolsMobile
