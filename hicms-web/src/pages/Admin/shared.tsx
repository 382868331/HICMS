import { useState, useEffect, useCallback } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Popconfirm, message, Card, Typography, Row, Col, Statistic, Progress, List } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ApiOutlined, DatabaseOutlined, FileOutlined, TeamOutlined, DashboardOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { getBookList, deleteBook, type MeetingBook } from '../../api/book'
import { getRoomList, addRoom, editRoom, deleteRoom, type MeetingRoom } from '../../api/room'
import { getMemberList, addMember, editMember, deleteMember, type MeetingMember } from '../../api/worker'
import { getUserList, addUser, editUser, deleteUser, type SysUser } from '../../api/user'
import { getOnlineUserList, forceLogout, type OnlineUser } from '../../api/online'

// ==================== 预约会议管理 ====================
export function BookManagement() {
  const [data, setData] = useState<MeetingBook[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const fetchData = useCallback(async (p?: number, ps?: number) => {
    setLoading(true)
    try {
      const res = await getBookList({ pageNum: p ?? page, pageSize: ps ?? pageSize })
      if (res.code === 200) {
        setData(res.rows || [])
        setTotal(res.total || 0)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [page, pageSize])

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (bookIds: string) => {
    const res = await deleteBook(bookIds)
    if (res.code === 200) {
      message.success('删除成功')
      fetchData()
    } else {
      message.error(res.msg || '删除失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'bookId', width: 60 },
    { title: '会议名称', dataIndex: 'meetingName', width: 160 },
    { title: '会议室', dataIndex: 'roomName', width: 120 },
    { title: '预定人', dataIndex: 'bookerName', width: 100 },
    { title: '主持人', dataIndex: 'leaderName', width: 100 },
    {
      title: '开始时间', dataIndex: 'meetingStartTime', width: 160,
      render: (v: string) => v || '-'
    },
    {
      title: '结束时间', dataIndex: 'meetingEndTime', width: 160,
      render: (v: string) => v || '-'
    },
    {
      title: '状态', dataIndex: 'isCanceled', width: 80,
      render: (v: string, record: MeetingBook) => {
        if (record.isFinished === '1') return <Tag color="green">已完成</Tag>
        if (v === '1') return <Tag color="default">已取消</Tag>
        return <Tag color="blue">正常</Tag>
      }
    },
    {
      title: '操作', width: 80, fixed: 'right' as const,
      render: (_: unknown, record: MeetingBook) => (
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(String(record.bookId))}>
          <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <Table
      rowKey="bookId"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: 1000 }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
        onChange: (p, ps) => { setPage(p); setPageSize(ps); fetchData(p, ps) },
      }}
    />
  )
}

// ==================== 会议室管理 ====================
export function RoomManagement() {
  const [data, setData] = useState<MeetingRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<MeetingRoom | null>(null)
  const [form] = Form.useForm()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getRoomList()
      if (res.code === 200) setData(res.rows || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editRecord) {
      const res = await editRoom({ ...values, roomId: editRecord.roomId })
      if (res.code === 200) { message.success('修改成功'); setModalOpen(false); fetchData() }
      else message.error(res.msg)
    } else {
      const res = await addRoom(values)
      if (res.code === 200) { message.success('新增成功'); setModalOpen(false); fetchData() }
      else message.error(res.msg)
    }
  }

  const handleDelete = async (roomIds: string) => {
    const res = await deleteRoom(roomIds)
    if (res.code === 200) { message.success('删除成功'); fetchData() }
    else message.error(res.msg || '删除失败')
  }

  const openEdit = (record: MeetingRoom) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'roomId', width: 60 },
    { title: '名称', dataIndex: 'name', width: 160 },
    { title: '适用类型', dataIndex: 'applicableScope', width: 120 },
    { title: '面积', dataIndex: 'areaSize', width: 80 },
    { title: '布局', dataIndex: 'layout', width: 100 },
    { title: '正常容量', dataIndex: 'normalCapacity', width: 80 },
    { title: '防疫容量', dataIndex: 'covidCapacity', width: 80 },
    {
      title: '操作', width: 140, fixed: 'right' as const,
      render: (_: unknown, record: MeetingRoom) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(String(record.roomId))}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新增会议室</Button>
      </div>
      <Table rowKey="roomId" columns={columns} dataSource={data} loading={loading} scroll={{ x: 800 }} />
      <Modal
        title={editRecord ? '编辑会议室' : '新增会议室'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="applicableScope" label="适用类型">
            <Input />
          </Form.Item>
          <Form.Item name="areaSize" label="面积">
            <Input />
          </Form.Item>
          <Form.Item name="layout" label="布局">
            <Input />
          </Form.Item>
          <Form.Item name="normalCapacity" label="正常容量">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="covidCapacity" label="防疫容量">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="imageUrl" label="图片地址">
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ==================== 参数配置（Mock） ====================
export function ParamConfig() {
  const { Text } = Typography

  const ossData = [
    { key: 'endpoint', value: 'oss-cn-hangzhou.aliyuncs.com', desc: 'OSS 访问域名' },
    { key: 'bucket', value: 'hicms-files', desc: 'Bucket 名称' },
    { key: 'accessKeyId', value: 'LTAI5t****xxxx****', desc: 'AccessKey ID' },
    { key: 'region', value: 'cn-hangzhou', desc: '区域' },
  ]

  const phoneData = [
    { key: 'accessKeyId', value: 'LTAI5t****xxxx****', desc: '阿里云 AccessKey ID' },
    { key: 'accessKeySecret', value: '********************', desc: '阿里云 AccessKey Secret' },
    { key: 'calledShowNumber', value: '0571-88888888', desc: '主叫显号' },
  ]

  const smsData = [
    { key: 'accessKeyId', value: 'LTAI5t****xxxx****', desc: '阿里云 AccessKey ID' },
    { key: 'accessKeySecret', value: '********************', desc: '阿里云 AccessKey Secret' },
    { key: 'signName', value: 'HICMS', desc: '短信签名' },
  ]

  const mailData = [
    { key: 'host', value: 'smtp.example.com', desc: 'SMTP 服务器地址' },
    { key: 'port', value: '465', desc: 'SMTP 端口' },
    { key: 'username', value: 'noreply@example.com', desc: '发件人邮箱' },
    { key: 'password', value: '****************', desc: 'SMTP 授权码' },
    { key: 'ssl', value: 'true', desc: '启用 SSL' },
  ]

  const configSection = (title: string, icon: string, data: { key: string; value: string; desc: string }[]) => (
    <Card title={title} size="small" style={{ marginBottom: 16 }}
      extra={<Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>}>
      {data.map((item) => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <Text strong style={{ width: 160, fontSize: 13 }}>{item.key}</Text>
          <Text code style={{ flex: 1, fontSize: 13 }}>{item.value}</Text>
          <Text type="secondary" style={{ width: 160, fontSize: 12, marginLeft: 16 }}>{item.desc}</Text>
        </div>
      ))}
    </Card>
  )

  return (
    <div>
      <Tag color="orange" style={{ fontSize: 12, marginBottom: 12 }}>Mock 数据 · 功能开发中</Tag>
      {configSection('OSS 文件存储配置', '☁️', ossData)}
      {configSection('阿里云数字电话配置', '📞', phoneData)}
      {configSection('阿里云短信配置', '💬', smsData)}
      {configSection('SMTP 邮件配置', '✉️', mailData)}
    </div>
  )
}

// ==================== 模板管理（Mock） ====================
export function TemplateManagement() {
  const { Text } = Typography

  const smsTemplates = [
    { id: 1, name: '会议通知', code: 'SMS_001', content: '您预约的【{meetingName}】将于【{startTime}】在【{roomName}】召开，请准时参加。', status: '1' },
    { id: 2, name: '会议取消通知', code: 'SMS_002', content: '您预约的【{meetingName}】已取消，给您带来不便敬请谅解。', status: '1' },
  ]

  const miniTemplates = [
    { id: 1, name: '会议提醒', code: 'MINI_001', desc: '小程序服务通知', status: '1' },
    { id: 2, name: '审批通知', code: 'MINI_002', desc: '审批结果推送', status: '0' },
  ]

  const msgTemplates = [
    { id: 1, name: '系统通知', code: 'MSG_001', content: '【系统通知】{content}', channel: '站内信', status: '1' },
    { id: 2, name: '预警通知', code: 'MSG_002', content: '【预警通知】{content}', channel: '站内信+短信', status: '1' },
  ]

  const aiPhoneTemplates = [
    { id: 1, name: '会议确认', code: 'AI_001', scene: '会议确认', status: '1', updateTime: '2026-07-01' },
    { id: 2, name: '到会提醒', code: 'AI_002', scene: '到会提醒', status: '1', updateTime: '2026-06-28' },
  ]

  const mailTemplates = [
    { id: 1, name: '会议邀请邮件', code: 'MAIL_001', subject: '会议邀请：【{meetingName}】', status: '1' },
    { id: 2, name: '会议纪要邮件', code: 'MAIL_002', subject: '会议纪要：【{meetingName}】', status: '1' },
    { id: 3, name: '账号激活邮件', code: 'MAIL_003', subject: 'HICMS 账号激活', status: '0' },
  ]

  const templateTable = (
    title: string,
    columns: { title: string; dataIndex: string; width?: number; render?: (v: unknown, r: unknown) => React.ReactNode }[],
    data: Record<string, unknown>[],
    rowKey: string,
  ) => (
    <Card title={title} size="small" style={{ marginBottom: 16 }}>
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </Card>
  )

  const tagRender = (v: string) => v === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>

  return (
    <div>
      <Tag color="orange" style={{ fontSize: 12, marginBottom: 12 }}>Mock 数据 · 功能开发中</Tag>
      {templateTable('短信模板', [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '名称', dataIndex: 'name', width: 120 },
        { title: '模板编码', dataIndex: 'code', width: 120 },
        { title: '模板内容', dataIndex: 'content', width: 400, render: (v: unknown) => <Text code style={{ fontSize: 12 }}>{v as string}</Text> },
        { title: '状态', dataIndex: 'status', width: 80, render: (v: unknown) => tagRender(v as string) },
      ], smsTemplates, 'id')}
      {templateTable('小程序模板', [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '名称', dataIndex: 'name', width: 120 },
        { title: '模板编码', dataIndex: 'code', width: 120 },
        { title: '描述', dataIndex: 'desc', width: 200 },
        { title: '状态', dataIndex: 'status', width: 80, render: (v: unknown) => tagRender(v as string) },
      ], miniTemplates, 'id')}
      {templateTable('消息模板', [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '名称', dataIndex: 'name', width: 120 },
        { title: '模板编码', dataIndex: 'code', width: 120 },
        { title: '模板内容', dataIndex: 'content', width: 300, render: (v: unknown) => <Text code style={{ fontSize: 12 }}>{v as string}</Text> },
        { title: '推送渠道', dataIndex: 'channel', width: 120 },
        { title: '状态', dataIndex: 'status', width: 80, render: (v: unknown) => tagRender(v as string) },
      ], msgTemplates, 'id')}
      {templateTable('AI 电话模板', [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '名称', dataIndex: 'name', width: 120 },
        { title: '模板编码', dataIndex: 'code', width: 120 },
        { title: '场景', dataIndex: 'scene', width: 120 },
        { title: '更新时间', dataIndex: 'updateTime', width: 120 },
        { title: '状态', dataIndex: 'status', width: 80, render: (v: unknown) => tagRender(v as string) },
      ], aiPhoneTemplates, 'id')}
      {templateTable('邮件模板', [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '名称', dataIndex: 'name', width: 140 },
        { title: '模板编码', dataIndex: 'code', width: 120 },
        { title: '邮件主题', dataIndex: 'subject', width: 280 },
        { title: '状态', dataIndex: 'status', width: 80, render: (v: unknown) => tagRender(v as string) },
      ], mailTemplates, 'id')}
    </div>
  )
}

// ==================== 大模型 API 管理（Mock） ====================
export function LlmManagement() {
  const mockData = [
    { id: 1, name: 'DeepSeek', apiUrl: 'https://api.deepseek.com/v1', apiKey: 'sk-xxxx****xxxx', status: '1', createTime: '2026-01-15 10:30:00' },
    { id: 2, name: '通义千问', apiUrl: 'https://dashscope.aliyuncs.com/api/v1', apiKey: 'sk-yyyy****yyyy', status: '1', createTime: '2026-03-20 14:00:00' },
    { id: 3, name: '文心一言', apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1', apiKey: 'sk-zzzz****zzzz', status: '0', createTime: '2026-05-10 09:15:00' },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '模型名称', dataIndex: 'name', width: 140 },
    { title: 'API 地址', dataIndex: 'apiUrl', width: 280 },
    { title: 'API Key', dataIndex: 'apiKey', width: 180 },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => v === '1' ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>
    },
    { title: '创建时间', dataIndex: 'createTime', width: 160 },
    {
      title: '操作', width: 140,
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Popconfirm title="确定删除？">
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color="orange" style={{ fontSize: 12 }}>Mock 数据 · 功能开发中</Tag>
        <Button type="primary" icon={<PlusOutlined />}>新增大模型</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={mockData} pagination={false} />
    </>
  )
}

// ==================== RAG 知识库管理（Mock） ====================
export function RagManagement() {
  const mockData = [
    { id: 1, name: '政府公文知识库', docCount: 1280, vectorDim: 1536, status: '1', updateTime: '2026-07-01 08:00:00' },
    { id: 2, name: '会议制度规范', docCount: 356, vectorDim: 768, status: '1', updateTime: '2026-06-28 16:30:00' },
    { id: 3, name: '政策法规库', docCount: 2400, vectorDim: 1536, status: '0', updateTime: '2026-06-15 11:00:00' },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '知识库名称', dataIndex: 'name', width: 180 },
    { title: '文档数量', dataIndex: 'docCount', width: 100 },
    { title: '向量维度', dataIndex: 'vectorDim', width: 100 },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => v === '1' ? <Tag color="green">已索引</Tag> : <Tag color="orange">索引中</Tag>
    },
    { title: '更新时间', dataIndex: 'updateTime', width: 160 },
    {
      title: '操作', width: 200,
      render: () => (
        <Space>
          <Button type="link" size="small">文档管理</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Popconfirm title="确定删除？">
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color="orange" style={{ fontSize: 12 }}>Mock 数据 · 功能开发中</Tag>
        <Button type="primary" icon={<PlusOutlined />}>新建知识库</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={mockData} pagination={false} />
    </>
  )
}

// ==================== 文件管理（Mock） ====================
export function FileManagement() {
  const mockData = [
    { id: 1, name: '2026年Q2工作报告.docx', size: '2.4 MB', type: 'docx', uploader: 'admin', uploadTime: '2026-07-05 14:30:00' },
    { id: 2, name: '会议室布局图.pdf', size: '5.1 MB', type: 'pdf', uploader: '张三', uploadTime: '2026-07-03 09:15:00' },
    { id: 3, name: '会议纪要模板.xlsx', size: '856 KB', type: 'xlsx', uploader: 'admin', uploadTime: '2026-06-28 16:00:00' },
    { id: 4, name: '活动照片.jpg', size: '3.8 MB', type: 'jpg', uploader: '李四', uploadTime: '2026-06-20 11:00:00' },
  ]

  const typeColors: Record<string, string> = { docx: 'blue', pdf: 'red', xlsx: 'green', jpg: 'purple' }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '文件名', dataIndex: 'name', width: 240 },
    { title: '大小', dataIndex: 'size', width: 100 },
    {
      title: '类型', dataIndex: 'type', width: 80,
      render: (v: string) => <Tag color={typeColors[v] || 'default'}>{v.toUpperCase()}</Tag>
    },
    { title: '上传者', dataIndex: 'uploader', width: 100 },
    { title: '上传时间', dataIndex: 'uploadTime', width: 160 },
    {
      title: '操作', width: 180,
      render: () => (
        <Space>
          <Button type="link" size="small">下载</Button>
          <Button type="link" size="small">预览</Button>
          <Popconfirm title="确定删除？">
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tag color="orange" style={{ fontSize: 12 }}>Mock 数据 · 功能开发中</Tag>
        <Button type="primary" icon={<PlusOutlined />}>上传文件</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={mockData} pagination={false} />
    </>
  )
}

// ==================== 当前在线用户 ====================
export function OnlineUserManagement() {
  const [data, setData] = useState<OnlineUser[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getOnlineUserList()
      if (res.code === 200) {
        setData(res.rows || [])
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleForceLogout = async (tokenId: string) => {
    const res = await forceLogout(tokenId)
    if (res.code === 200) { message.success('已强制下线'); fetchData() }
    else message.error(res.msg || '操作失败')
  }

  const columns = [
    { title: '会话编号', dataIndex: 'tokenId', width: 80, ellipsis: true },
    { title: '账号', dataIndex: 'userName', width: 120 },
    { title: '部门', dataIndex: 'deptName', width: 100 },
    { title: 'IP 地址', dataIndex: 'ipaddr', width: 140 },
    { title: '登录地点', dataIndex: 'loginLocation', width: 100 },
    { title: '浏览器', dataIndex: 'browser', width: 120 },
    { title: '操作系统', dataIndex: 'os', width: 120 },
    {
      title: '登录时间', dataIndex: 'loginTime', width: 160,
      render: (v: number) => v ? new Date(v).toLocaleString('zh-CN') : '-'
    },
    {
      title: '操作', width: 80,
      render: (_: unknown, record: OnlineUser) => (
        <Popconfirm title={`确定强制下线 ${record.userName}？`} onConfirm={() => handleForceLogout(record.tokenId)}>
          <Button type="link" danger size="small">强制下线</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <span style={{ color: '#666' }}>
          <TeamOutlined style={{ marginRight: 4 }} />当前在线：{data.length} 人
        </span>
      </div>
      <Table
        rowKey="tokenId"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={false}
      />
    </>
  )
}

// ==================== 数据可视化大盘（Mock） ====================
export function DashboardView() {
  const { Text, Title } = Typography

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Tag color="orange" style={{ fontSize: 12 }}>Mock 数据 · 功能开发中</Tag>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="今日会议" value={12} prefix={<ClockCircleOutlined />} suffix="场" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="在线用户" value={4} prefix={<UserOutlined />} suffix="人" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="会议室总数" value={8} prefix={<TeamOutlined />} suffix="间" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="本月预约" value={186} prefix={<DashboardOutlined />} suffix="次" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="会议室使用率（Mock）" size="small">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <Text style={{ fontSize: 12 }}>大会议室（501）</Text>
                <Progress percent={85} status="active" size="small" />
              </div>
              <div>
                <Text style={{ fontSize: 12 }}>中型会议室（302）</Text>
                <Progress percent={62} status="active" size="small" />
              </div>
              <div>
                <Text style={{ fontSize: 12 }}>小型会议室（203）</Text>
                <Progress percent={45} size="small" />
              </div>
              <div>
                <Text style={{ fontSize: 12 }}>视频会议室（V01）</Text>
                <Progress percent={73} status="active" size="small" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="最近操作日志（Mock）" size="small">
            <List
              size="small"
              dataSource={[
                { time: '10:45:22', user: '张三', action: '预定会议室 501' },
                { time: '10:30:15', user: 'admin', action: '修改用户信息' },
                { time: '10:15:08', user: '李四', action: '取消会议预约' },
                { time: '09:50:33', user: 'admin', action: '新增会议室' },
                { time: '09:30:01', user: '王五', action: '上传会议纪要' },
                { time: '09:00:00', user: 'admin', action: '系统登录' },
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '4px 0' }}>
                  <Text type="secondary" style={{ fontSize: 11, width: 70 }}>{item.time}</Text>
                  <Text strong style={{ fontSize: 11, width: 60 }}>{item.user}</Text>
                  <Text style={{ fontSize: 11 }}>{item.action}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

// ==================== 工作人员管理 ====================
export function MemberManagement() {
  const [data, setData] = useState<MeetingMember[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<MeetingMember | null>(null)
  const [form] = Form.useForm()

  const fetchData = useCallback(async (p?: number, ps?: number) => {
    setLoading(true)
    try {
      const res = await getMemberList({ pageNum: p ?? page, pageSize: ps ?? pageSize })
      if (res.code === 200) {
        setData(res.rows || [])
        setTotal(res.total || 0)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [page, pageSize])

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editRecord) {
      const res = await editMember({ ...values, memberId: editRecord.memberId })
      if (res.code === 200) { message.success('修改成功'); setModalOpen(false); fetchData() }
      else message.error(res.msg)
    } else {
      const res = await addMember(values)
      if (res.code === 200) { message.success('新增成功'); setModalOpen(false); fetchData() }
      else message.error(res.msg)
    }
  }

  const handleDelete = async (memberIds: string) => {
    const res = await deleteMember(memberIds)
    if (res.code === 200) { message.success('删除成功'); fetchData() }
    else message.error(res.msg || '删除失败')
  }

  const openEdit = (record: MeetingMember) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'memberId', width: 60 },
    { title: '姓名', dataIndex: 'userName', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 120 },
    { title: '微信号', dataIndex: 'wechat', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 160 },
    { title: '部门', dataIndex: 'department', width: 120 },
    { title: '值班日期', dataIndex: 'dutyDate', width: 100 },
    {
      title: '信息中心', dataIndex: 'isInfoCenter', width: 80,
      render: (v: string) => v === '1' ? <Tag color="blue">是</Tag> : <Tag>否</Tag>
    },
    {
      title: '机要局', dataIndex: 'isJiyaoBureau', width: 80,
      render: (v: string) => v === '1' ? <Tag color="blue">是</Tag> : <Tag>否</Tag>
    },
    {
      title: '操作', width: 140, fixed: 'right' as const,
      render: (_: unknown, record: MeetingMember) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(String(record.memberId))}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新增工作人员</Button>
      </div>
      <Table
        rowKey="memberId"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); fetchData(p, ps) },
        }}
      />
      <Modal
        title={editRecord ? '编辑工作人员' : '新增工作人员'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input />
          </Form.Item>
          <Form.Item name="wechat" label="微信号">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>
          <Form.Item name="department" label="部门">
            <Input />
          </Form.Item>
          <Form.Item name="dutyDate" label="值班日期">
            <Input />
          </Form.Item>
          <Form.Item name="isInfoCenter" label="信息中心">
            <Select options={[{ label: '是', value: '1' }, { label: '否', value: '0' }]} />
          </Form.Item>
          <Form.Item name="isJiyaoBureau" label="机要局">
            <Select options={[{ label: '是', value: '1' }, { label: '否', value: '0' }]} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ==================== 用户管理 ====================
export function UserManagement() {
  const [data, setData] = useState<SysUser[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<SysUser | null>(null)
  const [form] = Form.useForm()

  const fetchData = useCallback(async (p?: number, ps?: number) => {
    setLoading(true)
    try {
      const res = await getUserList({ pageNum: p ?? page, pageSize: ps ?? pageSize })
      if (res.code === 200) {
        setData(res.rows || [])
        setTotal(res.total || 0)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [page, pageSize])

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editRecord) {
      const res = await editUser({ ...values, userId: editRecord.userId })
      if (res.code === 200) { message.success('修改成功'); setModalOpen(false); fetchData() }
      else message.error(res.msg)
    } else {
      const res = await addUser(values)
      if (res.code === 200) { message.success('新增成功'); setModalOpen(false); fetchData() }
      else message.error(res.msg)
    }
  }

  const handleDelete = async (userIds: string) => {
    const res = await deleteUser(userIds)
    if (res.code === 200) { message.success('删除成功'); fetchData() }
    else message.error(res.msg || '删除失败')
  }

  const openEdit = (record: SysUser) => {
    setEditRecord(record)
    form.setFieldsValue({ ...record, password: undefined })
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'userId', width: 60 },
    { title: '账号', dataIndex: 'userName', width: 120 },
    { title: '昵称', dataIndex: 'nickName', width: 120 },
    { title: '手机号', dataIndex: 'phonenumber', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 160 },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => v === '0' ? <Tag color="green">正常</Tag> : <Tag color="red">停用</Tag>
    },
    {
      title: '用户类型', dataIndex: 'userType', width: 80,
      render: (v: string) => v === '00' ? <Tag color="blue">管理员</Tag> : <Tag>普通</Tag>
    },
    {
      title: '操作', width: 140, fixed: 'right' as const,
      render: (_: unknown, record: SysUser) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(String(record.userId))}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新增用户</Button>
      </div>
      <Table
        rowKey="userId"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); fetchData(p, ps) },
        }}
      />
      <Modal
        title={editRecord ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nickName" label="昵称">
            <Input />
          </Form.Item>
          <Form.Item name="password" label={editRecord ? '密码（留空不修改）' : '密码'} rules={editRecord ? [] : [{ required: true, message: '请输入密码' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="phonenumber" label="手机号">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别">
            <Select options={[
              { label: '男', value: '0' },
              { label: '女', value: '1' },
              { label: '未知', value: '2' },
            ]} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[
              { label: '正常', value: '0' },
              { label: '停用', value: '1' },
            ]} />
          </Form.Item>
          <Form.Item name="userType" label="用户类型">
            <Select options={[
              { label: '系统用户', value: '00' },
              { label: '普通用户', value: '01' },
            ]} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
