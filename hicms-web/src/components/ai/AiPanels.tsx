import { useState } from 'react'
import {
  Card, Input, Button, Space, Tag, Typography, List, Progress,
  Select, Radio, message, Row, Col, Timeline,
  Avatar, Skeleton, Statistic, Tooltip, Upload,
} from 'antd'
import {
  FileTextOutlined, SearchOutlined, EditOutlined, VideoCameraOutlined,
  AudioOutlined, SwapOutlined, CloudUploadOutlined, RobotOutlined,
  PictureOutlined, SendOutlined, HistoryOutlined, ThunderboltOutlined,
  FilePdfOutlined, FileWordOutlined, FileExcelOutlined, FilePptOutlined,
  FileImageOutlined, FileMarkdownOutlined, TranslationOutlined,
  DeleteOutlined, DownloadOutlined, LoadingOutlined, CheckCircleOutlined,
  FolderOutlined, FileAddOutlined, EyeOutlined, BulbOutlined,
  ExperimentOutlined, DatabaseOutlined, BookOutlined, UserOutlined,
} from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { TextArea } = Input
const { Dragger } = Upload

const THEME_BLUE = '#1677ff'

// ==================== 1. 公文管理 RAG知识库 ====================
function DocRagPanel() {
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<{ title: string; content: string; score: number; date: string }[]>([])

  const mockSearch = () => {
    if (!searchText.trim()) return
    setSearching(true)
    setTimeout(() => {
      setResults([
        { title: '关于加强信息安全管理工作的通知', content: '为进一步加强我单位信息安全管理，现就有关事项通知如下：一、严格落实信息安全责任制...', score: 0.96, date: '2026-07-01' },
        { title: '2026年第三季度工作会议纪要', content: '会议听取了各部门二季度工作汇报，对三季度重点工作进行了部署。会议强调要加快推进数字化转型...', score: 0.89, date: '2026-06-28' },
        { title: '关于开展网络安全应急演练的通知', content: '根据年度工作安排，定于7月15日组织开展网络安全应急演练。请各部门提前做好准备...', score: 0.82, date: '2026-06-25' },
        { title: '信息化项目建设管理办法（试行）', content: '第一章 总则。为规范我单位信息化项目建设管理，提高项目质量和资金使用效益...', score: 0.75, date: '2026-06-20' },
      ])
      setSearching(false)
    }, 1000)
  }

  const knowledgeCategories = [
    { label: '通知公告', count: 156 },
    { label: '会议纪要', count: 89 },
    { label: '制度办法', count: 42 },
    { label: '工作报告', count: 73 },
    { label: '领导讲话', count: 31 },
    { label: '政策法规', count: 118 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Input.Search
          placeholder="输入关键词搜索公文知识库..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={mockSearch}
          enterButton={<><SearchOutlined /> 检索</>}
          loading={searching}
        />
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['信息安全', '数字化转型', '应急演练', '项目管理办法'].map((t) => (
            <Tag key={t} style={{ cursor: 'pointer' }} onClick={() => setSearchText(t)}>{t}</Tag>
          ))}
        </div>
      </Card>

      {results.length === 0 && !searching && (
        <Card size="small" title="知识库概览" bordered={false} style={{ background: '#fff' }}>
          <Row gutter={[12, 12]}>
            {knowledgeCategories.map((cat) => (
              <Col span={8} key={cat.label}>
                <Card size="small" hoverable style={{ textAlign: 'center', background: '#fafafa' }}>
                  <Statistic title={cat.label} value={cat.count} suffix="篇" />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {searching && <Card bordered={false} style={{ background: '#fff' }}><Skeleton active paragraph={{ rows: 4 }} /></Card>}

      {results.length > 0 && (
        <Card size="small" title={`检索结果 (${results.length}条)`} bordered={false} style={{ background: '#fff' }}
          extra={<Button size="small" onClick={() => { setResults([]); setSearchText('') }}>清空</Button>}
        >
          <List
            dataSource={results}
            renderItem={(item) => (
              <List.Item
                extra={<Tooltip title={`相关度: ${(item.score * 100).toFixed(0)}%`}><Progress type="circle" percent={Math.round(item.score * 100)} size={32} /></Tooltip>}
                style={{ cursor: 'pointer' }}
              >
                <List.Item.Meta
                  title={<><FileTextOutlined style={{ color: THEME_BLUE, marginRight: 4 }} />{item.title}</>}
                  description={<><Text type="secondary" style={{ fontSize: 11 }}>{item.date}</Text><br /><Text ellipsis style={{ fontSize: 12 }}>{item.content}</Text></>}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  )
}

// ==================== 2. 公文编辑 ====================
function DocEditorPanel() {
  const [content, setContent] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [skillActive, setSkillActive] = useState('')
  const [kbResult, setKbResult] = useState('')

  const skills = [
    { key: 'format', label: '规范化', icon: <EditOutlined /> },
    { key: 'summarize', label: '摘要', icon: <BulbOutlined /> },
    { key: 'polish', label: '润色', icon: <ExperimentOutlined /> },
    { key: 'translate', label: '翻译', icon: <TranslationOutlined /> },
  ]

  const mockSkill = (key: string) => {
    setSkillActive(key)
    setTimeout(() => {
      if (key === 'format') {
        setContent((prev) => `【公文标题】${prev || '关于XXX工作的通知'}\n\n【正文】\n\n（规范化后的公文正文...）`)
        setKbResult('已参考《党政机关公文格式》(GB/T 9704-2012)')
      } else if (key === 'summarize') {
        setKbResult('AI摘要：本文主要讨论了关于信息化建设的三项重点工作和两个关键时间节点...')
      } else if (key === 'polish') {
        setContent((prev) => prev + '\n\n--- 润色后 ---')
        setKbResult('参考《党政机关公文用语规范》优化了3处措辞')
      } else if (key === 'translate') {
        setKbResult('Notice on Strengthening Information Security Management...')
      }
      setSkillActive('')
      setHistory((prev) => [...prev, `[${new Date().toLocaleTimeString()}] 执行「${skills.find((s) => s.key === key)?.label}」`])
    }, 1000)
  }

  const mockKbQuery = () => {
    setKbResult('')
    setTimeout(() => {
      setKbResult('知识库匹配：\n1. 《党政机关公文处理工作条例》第15条\n2. 类似公文模板 3 篇已加载')
    }, 600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Space wrap>
          {skills.map((skill) => (
            <Button key={skill.key} size="small" icon={skill.icon} loading={skillActive === skill.key} onClick={() => mockSkill(skill.key)}>
              {skill.label}
            </Button>
          ))}
          <Button size="small" icon={<BookOutlined />} onClick={mockKbQuery}>知识库</Button>
          <Button size="small" icon={<HistoryOutlined />} onClick={() => message.info('加载历史文件...')}>历史</Button>
        </Space>
      </Card>

      <Card size="small" title="编辑区" bordered={false} style={{ background: '#fff', flex: 1 }}
        extra={<Text type="secondary" style={{ fontSize: 11 }}>{content.length} 字</Text>}>
        <TextArea value={content} onChange={(e) => setContent(e.target.value)}
          placeholder="输入公文内容，使用上方 AI Skill 辅助编辑..."
          style={{ fontSize: 13, fontFamily: 'SimSun, serif' }} rows={14} />
      </Card>

      {kbResult && (
        <Card size="small" title="知识库查询结果" bordered={false} style={{ background: '#fff' }}>
          <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 12, margin: 0 }}>{kbResult}</Paragraph>
        </Card>
      )}

      {history.length > 0 && (
        <Card size="small" title="操作历史" bordered={false} style={{ background: '#fff' }}>
          <Timeline items={history.slice(-6).map((h) => ({ children: <Text style={{ fontSize: 11 }}>{h}</Text> }))} />
        </Card>
      )}
    </div>
  )
}

// ==================== 3. 视频AI分析 ====================
function VideoAnalysisPanel() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<Record<string, string> | null>(null)

  const mockAnalyze = () => {
    setAnalyzing(true); setResult(null)
    setTimeout(() => {
      setResult({
        时长: '03:42', 分辨率: '1920×1080', 帧率: '30 fps', 编码: 'MP4 (H.264)',
        内容摘要: '该视频记录了一场工作会议，包含领导讲话、部门汇报和讨论环节。',
        标签: '#工作会议 #数字化转型', 语音转录: '已提取，转录文字见附件',
        人物识别: '检测到 8 名参会人员，2 人为主要发言人',
      })
      setAnalyzing(false); message.success('分析完成')
    }, 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Dragger name="video" multiple={false} accept="video/*" showUploadList={false}
          customRequest={({ onSuccess }: any) => { setTimeout(() => onSuccess?.('ok'), 500) }}
          onChange={(info: any) => { if (info.file.status === 'done') mockAnalyze() }}>
          <p className="ant-upload-drag-icon"><VideoCameraOutlined style={{ fontSize: 36, color: THEME_BLUE }} /></p>
          <p className="ant-upload-text">点击或拖拽视频文件</p>
          <p className="ant-upload-hint">MP4 / AVI / MOV / WMV</p>
        </Dragger>
      </Card>
      {analyzing && (
        <Card bordered={false} style={{ background: '#fff' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><LoadingOutlined spin /> 分析中...</Text>
            <Progress percent={65} status="active" />
          </Space>
        </Card>
      )}
      {result && (
        <Card size="small" title="分析结果" bordered={false} style={{ background: '#fff' }}>
          <Row gutter={[8, 8]}>
            {Object.entries(result).map(([k, v]) => (
              <Col span={['内容摘要', '标签', '语音转录', '人物识别'].includes(k) ? 24 : 6} key={k}>
                <Card size="small" style={{ background: '#fafafa' }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>{k}</Text><br />
                  <Text style={{ fontSize: 12 }}>{v}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  )
}

// ==================== 4. 音频AI分析 ====================
function AudioAnalysisPanel() {
  const [analyzing, setAnalyzing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')

  const mockAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setTranscript(`【A】(00:00): 各位同事，今天我们召开三季度工作部署会议。\n【A】(00:15): 首先由各部门汇报二季度工作完成情况。\n【B】(00:32): 信息中心二季度完成了网络安全升级...\n【A】(01:05): 接下来讨论三季度重点工作任务...`)
      setSummary('本次会议为三季度工作部署会议，时长约3分钟，参会人共3人。')
      setAnalyzing(false); message.success('分析完成')
    }, 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Dragger name="audio" multiple={false} accept="audio/*" showUploadList={false}
          customRequest={({ onSuccess }: any) => { setTimeout(() => onSuccess?.('ok'), 500) }}
          onChange={(info: any) => { if (info.file.status === 'done') mockAnalyze() }}>
          <p className="ant-upload-drag-icon"><AudioOutlined style={{ fontSize: 36, color: THEME_BLUE }} /></p>
          <p className="ant-upload-text">点击或拖拽音频文件</p>
          <p className="ant-upload-hint">MP3 / WAV / AAC / FLAC</p>
        </Dragger>
      </Card>
      {analyzing && (
        <Card bordered={false} style={{ background: '#fff' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><LoadingOutlined spin /> 语音识别中...</Text>
            <Progress percent={80} status="active" />
          </Space>
        </Card>
      )}
      {transcript && (
        <>
          <Card size="small" title="语音转录" bordered={false} style={{ background: '#fff' }}
            extra={<Button size="small" icon={<DownloadOutlined />} onClick={() => message.info('导出（mock）')}>导出</Button>}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 12, margin: 0 }}>{transcript}</Paragraph>
          </Card>
          <Card size="small" title="AI智能摘要" bordered={false} style={{ background: '#fff' }}>
            <Paragraph style={{ fontSize: 12, margin: 0 }}>{summary}</Paragraph>
          </Card>
        </>
      )}
    </div>
  )
}

// ==================== 5. 格式转换 ====================
function FormatConvertPanel() {
  const [targetFormat, setTargetFormat] = useState('pdf')
  const [converting, setConverting] = useState(false)
  const [done, setDone] = useState(false)

  const formats = [
    { value: 'pdf', label: 'PDF', icon: <FilePdfOutlined /> },
    { value: 'docx', label: 'Word', icon: <FileWordOutlined /> },
    { value: 'xlsx', label: 'Excel', icon: <FileExcelOutlined /> },
    { value: 'pptx', label: 'PPT', icon: <FilePptOutlined /> },
    { value: 'md', label: 'MD', icon: <FileMarkdownOutlined /> },
    { value: 'txt', label: 'TXT', icon: <FileTextOutlined /> },
    { value: 'jpg', label: '图片', icon: <FileImageOutlined /> },
  ]

  const mockConvert = () => {
    setConverting(true); setDone(false)
    setTimeout(() => { setConverting(false); setDone(true); message.success('转换完成') }, 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Dragger name="file" multiple={false} showUploadList={false}
          customRequest={({ onSuccess }: any) => { setTimeout(() => onSuccess?.('ok'), 500) }}
          onChange={() => message.success('文件已上传')}>
          <p className="ant-upload-drag-icon"><SwapOutlined style={{ fontSize: 36, color: THEME_BLUE }} /></p>
          <p className="ant-upload-text">点击或拖拽文件</p>
        </Dragger>
      </Card>
      <Card size="small" title="目标格式" bordered={false} style={{ background: '#fff' }}>
        <Radio.Group value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)}>
          <Row gutter={[8, 8]}>
            {formats.map((f) => (
              <Col span={12} key={f.value}>
                <Radio.Button value={f.value} style={{ width: '100%', textAlign: 'center' }}>
                  {f.icon} {f.label}
                </Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Button type="primary" size="large" icon={<SwapOutlined />} loading={converting} onClick={mockConvert}>
            {converting ? '转换中...' : '开始转换'}
          </Button>
        </div>
      </Card>
      {converting && <Card bordered={false} style={{ background: '#fff' }}><Progress percent={75} status="active" /></Card>}
      {done && (
        <Card size="small" bordered={false} style={{ background: '#fff', textAlign: 'center' }}>
          <CheckCircleOutlined style={{ fontSize: 28, color: THEME_BLUE }} /><br />
          <Text strong>转换完成</Text><br />
          <Space style={{ marginTop: 8 }}>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => message.info('下载（mock）')}>下载</Button>
            <Button onClick={() => setDone(false)}>继续</Button>
          </Space>
        </Card>
      )}
    </div>
  )
}

// ==================== 6. 会务文件云盘 ====================
function MeetingCloudPanel() {
  const [files] = useState([
    { name: 'Q3工作会议资料汇总.pdf', type: 'pdf', size: '2.4 MB', date: '2026-07-05', author: '张三' },
    { name: '数字化转型汇报PPT.pptx', type: 'pptx', size: '8.1 MB', date: '2026-07-03', author: '李四' },
    { name: '安全演练方案.docx', type: 'docx', size: '1.2 MB', date: '2026-07-02', author: '王五' },
    { name: '会议录音20260701.mp3', type: 'audio', size: '32 MB', date: '2026-07-01', author: '赵六' },
    { name: '会议布局图.png', type: 'image', size: '5.6 MB', date: '2026-06-30', author: '孙七' },
    { name: '参会人员名单.xlsx', type: 'xlsx', size: '0.8 MB', date: '2026-06-29', author: '周八' },
  ])

  const getIcon = (type: string) => {
    const style = { fontSize: 24 }
    switch (type) {
      case 'pdf': return <FilePdfOutlined style={style} />
      case 'pptx': return <FilePptOutlined style={style} />
      case 'docx': return <FileWordOutlined style={style} />
      case 'xlsx': return <FileExcelOutlined style={style} />
      case 'audio': return <AudioOutlined style={style} />
      case 'image': return <FileImageOutlined style={style} />
      default: return <FileTextOutlined style={style} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Text strong><FolderOutlined /> 云盘文件</Text>
            <Tag>{files.length} 个</Tag>
          </Space>
          <Space>
            <Input.Search placeholder="搜索..." style={{ width: 160 }} />
            <Button type="primary" icon={<CloudUploadOutlined />} onClick={() => message.info('上传（mock）')}>上传</Button>
            <Button icon={<FileAddOutlined />} onClick={() => message.info('新建（mock）')}>新建</Button>
          </Space>
        </Space>
      </Card>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <List dataSource={files} renderItem={(f) => (
          <List.Item actions={[
            <Button key="v" size="small" type="link" icon={<EyeOutlined />} onClick={() => message.info(`预览: ${f.name}`)} />,
            <Button key="d" size="small" type="link" icon={<DownloadOutlined />} onClick={() => message.info(`下载: ${f.name}`)} />,
            <Button key="del" size="small" type="link" danger icon={<DeleteOutlined />} onClick={() => message.warning(`删除: ${f.name}`)} />,
          ]}>
            <List.Item.Meta avatar={getIcon(f.type)}
              title={<Text style={{ fontSize: 13 }}>{f.name}</Text>}
              description={<Text type="secondary" style={{ fontSize: 11 }}>{f.size} | {f.date} | {f.author}</Text>} />
          </List.Item>
        )} />
      </Card>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Row gutter={12}>
          <Col span={8}><Statistic title="文件总数" value={files.length} prefix={<FileTextOutlined />} /></Col>
          <Col span={8}><Statistic title="总大小" value={50.1} suffix="MB" precision={1} /></Col>
          <Col span={8}><Statistic title="修改中" value={2} /></Col>
        </Row>
      </Card>
    </div>
  )
}

// ==================== 7. 高级收费模型对话 ====================
function PremiumChatPanel() {
  const [model, setModel] = useState('deepseek')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '您好！请描述您的需求。' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const models = [
    { key: 'deepseek', label: 'DeepSeek' },
    { key: 'chatgpt', label: 'ChatGPT' },
    { key: 'claude', label: 'Claude' },
    { key: 'glm', label: 'GLM' },
    { key: 'qianwen', label: '千问' },
    { key: 'huoshan', label: '火山' },
  ]

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setSending(true)
    setTimeout(() => {
      let reply = ''
      if (userMsg.includes('公文')) reply = '好的，以下为您生成的公文初稿：\n\n【标题】关于加强信息化建设工作的通知\n\n【正文】为贯彻落实上级关于加快数字化转型的重要指示精神...'
      else if (userMsg.includes('会议')) reply = '建议从以下方面组织会议：\n1. 议程安排 2. 参会名单 3. 资料准备 4. 纪要模板'
      else reply = `收到：「${userMsg}」\n\n正在使用 ${models.find((m) => m.key === model)?.label} 模型处理...\n\n这是一段模拟回复（mock）。正式环境将调用对应模型API。`
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setSending(false)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Space>
          <Text type="secondary" style={{ fontSize: 12 }}>模型：</Text>
          <Select value={model} onChange={setModel} size="small" style={{ width: 120 }}>
            {models.map((m) => (
              <Select.Option key={m.key} value={m.key}>{m.label}</Select.Option>
            ))}
          </Select>
        </Space>
      </Card>

      <Card size="small" bordered={false} style={{ background: '#fff', flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 10, display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <Avatar size={28} icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
              style={{ backgroundColor: msg.role === 'user' ? THEME_BLUE : '#ddd', flexShrink: 0 }} />
            <div style={{
              maxWidth: '78%', padding: '6px 10px', borderRadius: 6, fontSize: 12,
              background: msg.role === 'user' ? '#f0f5ff' : '#fafafa',
              border: `1px solid ${msg.role === 'user' ? '#d6e4ff' : '#eee'}`,
              whiteSpace: 'pre-wrap', lineHeight: 1.5,
            }}>{msg.content}</div>
          </div>
        ))}
        {sending && <Text type="secondary" style={{ fontSize: 12 }}><LoadingOutlined spin /> 思考中...</Text>}
      </Card>

      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="输入问题，Enter 发送..."
            rows={2} style={{ fontSize: 13 }} />
        </Space.Compact>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <Space>
            <Button size="small" icon={<PictureOutlined />} onClick={() => message.info('上传图片')}>图片</Button>
            <Button size="small" icon={<FileTextOutlined />} onClick={() => message.info('上传文件')}>文件</Button>
          </Space>
          <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={sendMessage}>发送</Button>
        </div>
      </Card>
    </div>
  )
}

// ==================== 8. 多模态生成 ====================
function MultimodalGenPanel() {
  const [genType, setGenType] = useState('image')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')

  const genOptions = [
    { key: 'image', label: '图片', icon: <PictureOutlined />, placeholder: '描述您想要的图片...' },
    { key: 'audio', label: '音频', icon: <AudioOutlined />, placeholder: '描述音频内容...' },
    { key: 'video', label: '视频', icon: <VideoCameraOutlined />, placeholder: '描述视频场景...' },
    { key: 'ppt', label: 'PPT', icon: <FilePptOutlined />, placeholder: '描述PPT主题...' },
  ]

  const mockGenerate = () => {
    if (!prompt.trim()) return
    setGenerating(true); setResult('')
    setTimeout(() => {
      const results: Record<string, string> = {
        image: '图片已生成\n分辨率：1024×1024\n格式：PNG\n[模拟预览区]',
        audio: '音频已生成\n时长：45秒\n格式：MP3\n[模拟波形]',
        video: '视频已生成\n时长：30秒\n格式：MP4\n[模拟预览]',
        ppt: 'PPT已生成 · 12页\n1.封面 2.目录 3-4.背景分析\n5-8.方案 9-10.路线图\n11.效果 12.致谢',
      }
      setResult(results[genType] || '')
      setGenerating(false); message.success('生成完成')
    }, 2000)
  }

  const active = genOptions.find((g) => g.key === genType)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Radio.Group value={genType} onChange={(e) => { setGenType(e.target.value); setResult(''); setPrompt('') }}>
          {genOptions.map((opt) => (
            <Radio.Button key={opt.key} value={opt.key} style={{ padding: '0 12px' }}>
              <Space size={4}>{opt.icon}{opt.label}</Space>
            </Radio.Button>
          ))}
        </Radio.Group>
      </Card>

      <Card size="small" bordered={false} style={{ background: '#fff' }}>
        <Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>{active.icon} {active.label}生成</Text>
        <TextArea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={active.placeholder} rows={4} />
        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <Button type="primary" size="large" icon={<ThunderboltOutlined />} loading={generating} onClick={mockGenerate}>
            {generating ? '生成中...' : `生成${active.label}`}
          </Button>
        </div>
      </Card>

      {generating && (
        <Card bordered={false} style={{ background: '#fff' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><LoadingOutlined spin /> 生成中...</Text>
            <Progress percent={70} status="active" />
          </Space>
        </Card>
      )}

      {result && (
        <Card size="small" title="生成结果" bordered={false} style={{ background: '#fff' }}
          extra={<Space><Button size="small" icon={<DownloadOutlined />} onClick={() => message.info('下载')}>下载</Button><Button size="small" onClick={mockGenerate}>重新生成</Button></Space>}>
          <div style={{ background: '#fafafa', borderRadius: 6, padding: 20, textAlign: 'center', minHeight: 160,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            {genType === 'image' && <PictureOutlined style={{ fontSize: 48, color: '#ccc' }} />}
            {genType === 'audio' && <AudioOutlined style={{ fontSize: 48, color: '#ccc' }} />}
            {genType === 'video' && <VideoCameraOutlined style={{ fontSize: 48, color: '#ccc' }} />}
            {genType === 'ppt' && <FilePptOutlined style={{ fontSize: 48, color: '#ccc' }} />}
            <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 12, margin: 0 }}>{result}</Paragraph>
          </div>
        </Card>
      )}
    </div>
  )
}

// ==================== 导航配置 ====================

export const AI_PANELS = [
  { key: 'rag',       label: '公文RAG知识库', icon: <DatabaseOutlined />,      panel: <DocRagPanel />,         desc: '智能检索 · 语义匹配' },
  { key: 'editor',    label: '公文编辑',       icon: <EditOutlined />,          panel: <DocEditorPanel />,      desc: 'AI Skill · 历史记忆' },
  { key: 'video',     label: '视频AI分析',     icon: <VideoCameraOutlined />,   panel: <VideoAnalysisPanel />,  desc: '内容识别 · 关键帧' },
  { key: 'audio',     label: '音频AI分析',     icon: <AudioOutlined />,         panel: <AudioAnalysisPanel />,  desc: '语音转写 · 摘要' },
  { key: 'convert',   label: '格式转换',       icon: <SwapOutlined />,          panel: <FormatConvertPanel />,  desc: '文档格式互转' },
  { key: 'cloud',     label: '会务文件云盘',   icon: <CloudUploadOutlined />,   panel: <MeetingCloudPanel />,   desc: '文件管理 · 协作' },
  { key: 'premium',   label: '高级模型对话',   icon: <RobotOutlined />,         panel: <PremiumChatPanel />,    desc: 'DeepSeek · 千问 · 火山' },
  { key: 'multimodal', label: '多模态生成',    icon: <ThunderboltOutlined />,   panel: <MultimodalGenPanel />,  desc: '图片 · 视频 · PPT' },
] as const


