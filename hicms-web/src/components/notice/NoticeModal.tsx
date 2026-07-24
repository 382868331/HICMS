import './notice.css'

interface NoticeModalProps {
  visible: boolean
  onClose: () => void
}

const mockNotices = [
  { id: 1, title: '内测启动通知', content: '信息中心V2.0版本即日起正式开启内部测试，测试范围涵盖会议管理、AI助手、通讯录等核心模块。请各位同事积极参与，发现问题请及时反馈至内测群。', time: '2026-07-06 15:30', unread: true },
  { id: 2, title: '内测环境已就绪', content: '内测环境已完成部署，测试账号已统一开通。请使用工号登录体验新系统，建议优先测试日常高频功能（会议预约、消息通知、文件共享等），体验过程中遇到问题可通过"内测反馈"入口提交。', time: '2026-07-06 14:15', unread: true },
  { id: 3, title: '内测功能一览', content: '本次内测重点功能：① 智能会议助手（支持语音转写、自动纪要）；② 跨部门通讯录（按组织架构快速查找）；③ AI问答引擎（支持自然语言检索）；④ 统一通知中心（系统消息实时推送）。欢迎体验并提交使用感受。', time: '2026-07-06 11:00', unread: false },
  { id: 4, title: '内测须知', content: '请各位参与内测的同事注意：① 内测环境数据不会同步至正式环境，请勿存入敏感信息；② 每日17:00-18:00为系统维护窗口，期间可能短暂不可用；③ 遇到Bug请截图并附上操作步骤提交至内测群，感谢配合。', time: '2026-07-06 09:00', unread: false },
]

function NoticeModal({ visible, onClose }: NoticeModalProps) {
  if (!visible) return null

  return (
    <div className="notice-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="notice-modal">
        <div className="notice-header">
          <h3>通知</h3>
          <button className="notice-close" onClick={onClose} type="button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="notice-body">
          {mockNotices.length === 0 ? (
            <div className="notice-empty">暂无通知</div>
          ) : (
            mockNotices.map((item) => (
              <div key={item.id} className={`notice-item ${item.unread ? 'unread' : ''}`}>
                <div className="notice-item-top">
                  {item.unread && <span className="notice-dot" />}
                  <span className="notice-item-title">{item.title}</span>
                  <span className="notice-item-time">{item.time}</span>
                </div>
                <p className="notice-item-content">{item.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticeModal
