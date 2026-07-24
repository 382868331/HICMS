import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeviceType } from '../../hooks/useDeviceType'

function MeNotices() {
  const deviceType = useDeviceType()
  const navigate = useNavigate()

  useEffect(() => {
    if (deviceType === 'pc' || deviceType === 'tablet') {
      navigate('/meeting', { replace: true })
    }
  }, [deviceType, navigate])

  return (
    <div style={{ flex: 1, padding: '16px 20px' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: 'var(--text-h)' }}>
        通知
      </h3>
      {[
        { id: 1, title: '内测启动通知', content: '信息中心V2.0版本即日起正式开启内部测试，测试范围涵盖会议管理、AI助手、通讯录等核心模块。请各位同事积极参与，发现问题请及时反馈至内测群。', time: '2026-07-06 15:30' },
        { id: 2, title: '内测环境已就绪', content: '内测环境已完成部署，测试账号已统一开通。请使用工号登录体验新系统，建议优先测试日常高频功能（会议预约、消息通知、文件共享等），体验过程中遇到问题可通过"内测反馈"入口提交。', time: '2026-07-06 14:15' },
        { id: 3, title: '内测功能一览', content: '本次内测重点功能：① 智能会议助手（支持语音转写、自动纪要）；② 跨部门通讯录（按组织架构快速查找）；③ AI问答引擎（支持自然语言检索）；④ 统一通知中心（系统消息实时推送）。欢迎体验并提交使用感受。', time: '2026-07-06 11:00' },
        { id: 4, title: '内测须知', content: '请各位参与内测的同事注意：① 内测环境数据不会同步至正式环境，请勿存入敏感信息；② 每日17:00-18:00为系统维护窗口，期间可能短暂不可用；③ 遇到Bug请截图并附上操作步骤提交至内测群，感谢配合。', time: '2026-07-06 09:00' },
      ].map((item) => (
        <div
          key={item.id}
          style={{
            padding: '14px 0',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-h)' }}>{item.title}</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.time}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
            {item.content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default MeNotices
