import { useNavigate } from 'react-router-dom'

function MeMobile() {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
      <div
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'background 0.15s',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-h)' }}>个人信息</span>
        <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: 14 }}>&gt;</span>
      </div>
      <div
        onClick={() => navigate('/me/notices')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-h)' }}>通知</span>
        <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: 14 }}>&gt;</span>
      </div>
    </div>
  )
}

export default MeMobile
