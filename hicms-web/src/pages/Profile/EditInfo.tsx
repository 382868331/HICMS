import { Typography } from 'antd'
import { FormOutlined } from '@ant-design/icons'

function EditInfo() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 12 }}>
      <FormOutlined style={{ fontSize: 48, color: '#1677ff' }} />
      <Typography.Title level={4} type="secondary">修改信息</Typography.Title>
      <Typography.Text type="secondary">用于修改账号密码、基础信息等，功能开发中</Typography.Text>
    </div>
  )
}

export default EditInfo
