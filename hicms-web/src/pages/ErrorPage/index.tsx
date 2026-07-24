import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'

interface ErrorPageProps {
  img: string
  title: string
  description: string
}

function ErrorPage({ img, title, description }: ErrorPageProps) {
  const navigate = useNavigate()

  return (
    <div style={overlayStyle}>
      <img src={img} alt={title} style={{ width: 260, height: 260 }} />
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: 'var(--text-h)' }}>
        {title}
      </h2>
      <p style={{ margin: 0, fontSize: 14, color: '#9ca3af', textAlign: 'center', maxWidth: 400 }}>
        {description}
      </p>
      <button
        onClick={() => navigate('/meeting', { replace: true })}
        style={btnStyle}
      >
        返回首页
      </button>
    </div>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 24,
  padding: 40,
  background: 'var(--bg)',
}

const btnStyle: CSSProperties = {
  marginTop: 8,
  padding: '10px 32px',
  fontSize: 14,
  fontWeight: 500,
  color: '#fff',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'opacity 0.2s',
}

export default ErrorPage
