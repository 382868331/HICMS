import { useState, useCallback } from 'react'
import { Modal, Input, message } from 'antd'
import type { MeetingMember } from '../../api/worker'

const { TextArea } = Input

export type ActionType =
  | 'call'
  | 'aiCall'
  | 'sms'
  | 'wechat'
  | 'email'
  | 'miniapp'

/** 基础模板 */
const TEMPLATES: Record<string, string> = {
  aiCall: '您好，我是[单位名称]值班人员[您的姓名]。现通过AI智能电话通知您：请于[具体时间]参加[会议/活动名称]，地点在[具体地点]。收到请回复，如有疑问请联系值班电话。谢谢！',
  sms: '【值班提示】您好[接收人姓名]，提醒您于[具体时间]在[具体地点]参加[会议/活动名称]。请提前10分钟到场。如有变动请及时联系值班室。',
  email: '尊敬的[接收人姓名]：\n\n您好！\n\n兹定于[具体时间]在[具体地点]召开[会议/活动名称]，请您准时参加。\n\n会议主要内容：\n1. \n2. \n3. \n\n如有疑问，请联系值班人员。\n\n此致\n敬礼\n\n值班室\n[日期]',
  miniapp: '【小程序通知】您好[接收人姓名]，您有一条新的会议通知：会议主题为[会议/活动名称]，时间为[具体时间]，地点在[具体地点]。详情请登录小程序查看。感谢您的配合！',
}

interface Props {
  visible: boolean
  actionType: ActionType | null
  member: MeetingMember | null
  onClose: () => void
}

function ActionModals({ visible, actionType, member, onClose }: Props) {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [template, setTemplate] = useState('')

  const handleOpen = useCallback(() => {
    if (actionType && TEMPLATES[actionType]) {
      setTemplate(TEMPLATES[actionType])
    }
  }, [actionType])

  const handleClose = useCallback(() => {
    setTemplate('')
    setConfirmLoading(false)
    onClose()
  }, [onClose])

  const mockAction = useCallback(
    (action: string) => {
      setConfirmLoading(true)
      setTimeout(() => {
        setConfirmLoading(false)
        message.success(`已向 ${member?.userName || '目标用户'} ${action}`)
        handleClose()
      }, 800)
    },
    [member, handleClose]
  )

  if (!visible || !actionType || !member) return null

  // ── 拨打网络电话 ──
  if (actionType === 'call') {
    return (
      <Modal
        title="拨打网络电话"
        open={visible}
        onOk={() => mockAction('发起网络电话呼叫')}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="确认拨打"
        cancelText="取消"
        onOpen={handleOpen}
      >
        <div style={{ padding: '16px 0' }}>
          <p>
            即将向 <strong>{member.userName}</strong>（{member.phone}）发起网络电话呼叫。
          </p>
          <p style={{ color: '#8c8c8c', fontSize: 13 }}>
            网络电话将通过 IP 语音通道建立连接，请确保您的设备已连接麦克风和扬声器。
          </p>
        </div>
      </Modal>
    )
  }

  // ── AI智能电话通知 ──
  if (actionType === 'aiCall') {
    return (
      <Modal
        title="AI智能电话通知"
        open={visible}
        onOk={() => mockAction('发送AI智能电话通知')}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="确认发送"
        cancelText="取消"
        width={600}
        onOpen={handleOpen}
      >
        <div style={{ padding: '4px 0' }}>
          <p style={{ marginBottom: 8 }}>
            接收人：<strong>{member.userName}</strong>（{member.phone}）
          </p>
          <p style={{ marginBottom: 4, color: '#666' }}>
            通知话术模板（可修改）：
          </p>
          <TextArea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={6}
            style={{ fontSize: 13 }}
          />
        </div>
      </Modal>
    )
  }

  // ── 发送提示短信 ──
  if (actionType === 'sms') {
    return (
      <Modal
        title="发送提示短信"
        open={visible}
        onOk={() => mockAction('发送提示短信')}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="确认发送"
        cancelText="取消"
        width={580}
        onOpen={handleOpen}
      >
        <div style={{ padding: '4px 0' }}>
          <p style={{ marginBottom: 8 }}>
            接收人：<strong>{member.userName}</strong>（{member.phone}）
          </p>
          <p style={{ marginBottom: 4, color: '#666' }}>
            短信模板（可修改）：
          </p>
          <TextArea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={4}
            maxLength={500}
            showCount
            style={{ fontSize: 13 }}
          />
        </div>
      </Modal>
    )
  }

  // ── 扫码添加微信 ──
  if (actionType === 'wechat') {
    return (
      <Modal
        title="扫码添加好友"
        open={visible}
        onCancel={handleClose}
        footer={null}
        width={400}
        onOpen={handleOpen}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ marginBottom: 12 }}>
            使用微信扫描下方二维码添加 <strong>{member.userName}</strong> 为好友
          </p>
          <p style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 16 }}>
            微信号：{member.wechat}
          </p>
          <div
            style={{
              width: 200,
              height: 200,
              margin: '0 auto 16px',
              background: '#f5f5f5',
              border: '1px dashed #d9d9d9',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* 模拟二维码占位 */}
            <div
              style={{
                width: 140,
                height: 140,
                background: 'repeating-conic-gradient(#1677ff 0% 25%, #fff 0% 50%) 50% / 20px 20px',
                borderRadius: 4,
              }}
            />
            <span style={{ color: '#8c8c8c', fontSize: 12 }}>模拟二维码</span>
          </div>
        </div>
      </Modal>
    )
  }

  // ── 发送邮件 ──
  if (actionType === 'email') {
    return (
      <Modal
        title="发送邮件"
        open={visible}
        onOk={() => mockAction('发送邮件')}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="确认发送"
        cancelText="取消"
        width={640}
        onOpen={handleOpen}
      >
        <div style={{ padding: '4px 0' }}>
          <p style={{ marginBottom: 8 }}>
            收件人：<strong>{member.userName}</strong>（{member.email}）
          </p>
          <p style={{ marginBottom: 4 }}>
            主题：
            <Input
              defaultValue={`会议通知 - ${new Date().toLocaleDateString('zh-CN')}`}
              style={{ marginTop: 4, fontSize: 13 }}
            />
          </p>
          <p style={{ marginBottom: 4, marginTop: 12, color: '#666' }}>
            邮件正文模板（可修改）：
          </p>
          <TextArea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={10}
            style={{ fontSize: 13 }}
          />
        </div>
      </Modal>
    )
  }

  // ── 发送小程序微信通知 ──
  if (actionType === 'miniapp') {
    return (
      <Modal
        title="发送小程序微信通知"
        open={visible}
        onOk={() => mockAction('发送小程序微信通知')}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
        okText="确认发送"
        cancelText="取消"
        width={600}
        onOpen={handleOpen}
      >
        <div style={{ padding: '4px 0' }}>
          <p style={{ marginBottom: 8 }}>
            接收人：<strong>{member.userName}</strong>
            {member.isMiniappAuth === '1' && (
              <span style={{ color: '#52c41a', marginLeft: 8, fontSize: 12 }}>已授权小程序</span>
            )}
          </p>
          <p style={{ marginBottom: 4, color: '#666' }}>
            通知模板（可修改）：
          </p>
          <TextArea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={5}
            style={{ fontSize: 13 }}
          />
        </div>
      </Modal>
    )
  }

  return null
}

export { TEMPLATES }
export default ActionModals
