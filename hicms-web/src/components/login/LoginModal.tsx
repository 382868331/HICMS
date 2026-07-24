import { useState, useEffect } from 'react'
import { login, getCaptcha, type LoginResult, type CaptchaResult } from '../../api/auth'
import ServiceAgreement from './ServiceAgreement'
import PrivacyPolicy from './PrivacyPolicy'
import './login.css'

interface LoginModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: (result: LoginResult) => void
}

type LoginTab = 'phone' | 'account'

const REMEMBER_KEY = 'login_remember'

function LoginModal({ visible, onClose, onSuccess }: LoginModalProps) {
  const [tab, setTab] = useState<LoginTab>('phone')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [uuid, setUuid] = useState('')
  const [captchaImg, setCaptchaImg] = useState('')
  const [remember, setRemember] = useState(true)
  const [agreed, setAgreed] = useState(true)
  const [phone, setPhone] = useState('')
  const [protocolVisible, setProtocolVisible] = useState(false)
  const [protocolContent, setProtocolContent] = useState<React.ReactNode>(null)
  const [protocolTitle, setProtocolTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (!error) return; const t = setTimeout(() => setError(''), 3000); return () => clearTimeout(t) }, [error])

  useEffect(() => {
    if (visible) {
      const saved = localStorage.getItem(REMEMBER_KEY)
      if (saved) {
        try { const d = JSON.parse(saved); setUsername(d.username || ''); setPassword(d.password || '') } catch { /* */ }
      } else { setUsername(''); setPassword('') }
      setCode(''); setPhone(''); setError(''); setRemember(true); setAgreed(true); setTab('phone')
      refreshCaptcha()
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { protocolVisible ? setProtocolVisible(false) : onClose() }
    }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [visible, onClose, protocolVisible])

  const refreshCaptcha = async () => {
    try { const r: CaptchaResult = await getCaptcha(); if (r.code === 200 && r.uuid && r.img) { setUuid(r.uuid); setCaptchaImg(r.img) } } catch { /* */ }
  }

  const openProtocol = (title: string, content: React.ReactNode) => { setProtocolTitle(title); setProtocolContent(content); setProtocolVisible(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!username.trim()) { setError('请输入用户名'); return }
    if (!password.trim()) { setError('请输入密码'); return }
    if (!agreed) { setError('请先阅读并同意服务协议和隐私政策'); return }
    if (remember) { localStorage.setItem(REMEMBER_KEY, JSON.stringify({ username: username.trim(), password })) } else { localStorage.removeItem(REMEMBER_KEY) }
    setLoading(true)
    try {
      const res = await login({ username: username.trim(), password, code, uuid })
      if (res.code === 200) { onSuccess?.(res); onClose() }
      else { setError(res.msg || '登录失败'); refreshCaptcha() }
    } catch { setError('网络异常，请稍后重试'); refreshCaptcha() } finally { setLoading(false) }
  }

  if (!visible) return null

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-modal">
        <div className="login-left">
          <div className="qr-box">
            <p className="qr-title">快速安全登录</p>
            <div className="qr-code">
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
                <rect width="150" height="150" rx="14" fill="var(--bg)" stroke="var(--border)" strokeWidth="1" />
                <rect x="14" y="14" width="44" height="44" rx="5" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <rect x="92" y="14" width="44" height="44" rx="5" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <rect x="14" y="92" width="44" height="44" rx="5" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <rect x="92" y="92" width="44" height="44" rx="5" stroke="var(--accent)" strokeWidth="2" fill="none" />
                <path d="M27 27h18v18H27zM105 27h18v18h-18zM27 105h18v18H27zM105 105h18v18h-18z" fill="var(--accent)" opacity="0.6" />
                <circle cx="75" cy="42" r="2.5" fill="var(--accent)" opacity="0.4" />
                <circle cx="75" cy="54" r="2.5" fill="var(--accent)" opacity="0.4" />
                <circle cx="63" cy="48" r="2.5" fill="var(--accent)" opacity="0.4" />
                <circle cx="87" cy="48" r="2.5" fill="var(--accent)" opacity="0.4" />
              </svg>
            </div>
            <p className="qr-tip">请使用微信扫一扫或信息中心App扫码登录</p>
          </div>
        </div>

        <div className="login-right">
          <div className="login-tabs">
            <button type="button" className={`login-tab ${tab === 'phone' ? 'active' : ''}`} onClick={() => { setTab('phone'); setError('') }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
              </svg>
              <span>手机号</span>
            </button>
            <button type="button" className={`login-tab ${tab === 'account' ? 'active' : ''}`} onClick={() => { setTab('account'); setError('') }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span>账号</span>
            </button>
          </div>

          <div className="login-form-wrap">
            {tab === 'phone' && (
              <div className="login-form">
                <div className="login-field">
                  <span className="field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg></span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" maxLength={11} />
                </div>
                <div className="login-field">
                  <span className="field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg></span>
                  <input type="text" placeholder="短信验证码" maxLength={6} />
                  <button type="button" className="sms-btn" onClick={() => setError('手机号登录功能暂未开放')}>获取验证码</button>
                </div>
              </div>
            )}
            {tab === 'account' && (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                  <span className="field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></span>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="请输入用户名" autoComplete="username" />
                </div>
                <div className="login-field">
                  <span className="field-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg></span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" autoComplete="current-password" />
                </div>
                {captchaImg && (
                  <div className="login-field">
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="验证码" maxLength={4} className="captcha-input" />
                    <img src={captchaImg} alt="验证码" className="captcha-img" onClick={refreshCaptcha} title="点击刷新" />
                  </div>
                )}
              </form>
            )}
          </div>

          <div className="login-extra">
            <label className="extra-row"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>记住密码</span></label>
            <label className="extra-row">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>已阅读并同意<button type="button" className="protocol-link" onClick={() => openProtocol('服务协议', <ServiceAgreement />)}>《服务协议》</button>和<button type="button" className="protocol-link" onClick={() => openProtocol('隐私政策', <PrivacyPolicy />)}>《隐私政策》</button></span>
            </label>
          </div>

          <button type="submit" className="login-submit" disabled={loading} onClick={tab === 'phone' ? () => setError('手机号登录功能暂未开放') : handleSubmit}>
            {loading ? '登录中...' : '登录 / 注册'}
          </button>
          <p className="login-hint">{error || '\u00A0'}</p>
        </div>

        <button className="login-close" onClick={onClose} type="button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>

      {protocolVisible && (
        <div className="protocol-overlay" onClick={(e) => e.target === e.currentTarget && setProtocolVisible(false)}>
          <div className="protocol-modal">
            <div className="protocol-header">
              <h3>{protocolTitle}</h3>
              <button className="login-close" onClick={() => setProtocolVisible(false)} type="button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className="protocol-body">{protocolContent}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginModal
