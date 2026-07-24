import { Typography, Divider, Card, Row, Col, theme } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
  QrcodeOutlined,
  AndroidOutlined,
  AppleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

/** 生成一个伪二维码 SVG，seed 不同则图案不同 */
function MockQrCode({ size = 120, seed = 42 }: { size?: number; seed?: number }) {
  const grid = 21 // QR 码 21x21 (version 1)
  const cellSize = size / (grid + 8) // 留白
  const offset = 4 * cellSize

  // 用 seed 生成伪随机模块
  const pseudoRandom = (x: number, y: number) => {
    const n = Math.sin((x * 31 + y * 17 + seed) * 12.9898) * 43758.5453
    return n - Math.floor(n) > 0.45
  }

  // 3 个定位图案 (7x7) 的位置
  const isFinder = (x: number, y: number) => {
    const inSquare = (fx: number, fy: number) =>
      x >= fx && x < fx + 7 && y >= fy && y < fy + 7
    if (inSquare(0, 0) || inSquare(grid - 7, 0) || inSquare(0, grid - 7)) {
      // 定位图案: 外框全黑, 内圈 5x5 白, 最内 3x3 黑
      const localX = (inSquare(0, 0) ? x : inSquare(grid - 7, 0) ? x - (grid - 7) : x)
      const localY = (inSquare(0, 0) ? y : inSquare(grid - 7, 0) ? y : y - (grid - 7))
      if (localX === 0 || localX === 6 || localY === 0 || localY === 6) return true
      if (localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4) return true
      return false
    }
    return false
  }

  // 时序图案 (第 6 行/列交替)
  const isTiming = (x: number, y: number) => {
    if (y === 6 && x >= 8 && x % 2 === 0) return true
    if (x === 6 && y >= 8 && y % 2 === 0) return true
    return false
  }

  const cells: { x: number; y: number; fill: boolean }[] = []
  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      if (isFinder(col, row)) {
        cells.push({ x: col, y: row, fill: true })
      } else if (isTiming(col, row)) {
        cells.push({ x: col, y: row, fill: true })
      } else if (pseudoRandom(col, row)) {
        cells.push({ x: col, y: row, fill: true })
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="#ffffff" rx={4} />
      {cells.map((c, i) => (
        <rect
          key={i}
          x={offset + c.x * cellSize}
          y={offset + c.y * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#1a1a2e"
          rx={cellSize * 0.15}
        />
      ))}
    </svg>
  )
}

/** 单个二维码卡片 */
function QrCard({ icon, label, seed }: { icon: React.ReactNode; label: string; seed: number }) {
  const { token } = theme.useToken()
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-block',
          padding: 8,
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <MockQrCode size={132} seed={seed} />
      </div>
      <div style={{ marginTop: 10 }}>
        <span style={{ marginRight: 6, color: token.colorPrimary }}>{icon}</span>
        <Text style={{ fontSize: 13 }}>{label}</Text>
      </div>
    </div>
  )
}

function Contact() {
  const { token } = theme.useToken()

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        padding: '24px 16px 48px',
        maxWidth: 640,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          联系我们
        </Title>
        <Text type="secondary">欢迎通过以下方式与我们取得联系</Text>
      </div>

      {/* 联系方式卡片 */}
      <Card
        styles={{ body: { padding: '16px 20px' } }}
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PhoneOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>客服热线</Text>
              <br />
              <Text strong copyable style={{ fontSize: 16 }}>400-888-6666</Text>
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MailOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>电子邮箱</Text>
              <br />
              <Text strong copyable style={{ fontSize: 16 }}>hicms@heilongjiang.gov.cn</Text>
            </div>
          </div>
        </div>
      </Card>

      {/* 二维码区域 */}
      <Card
        title={
          <span>
            <QrcodeOutlined style={{ marginRight: 8 }} />
            扫码关注 / 下载
          </span>
        }
        styles={{ body: { padding: '12px 16px 20px' } }}
      >
        <Row gutter={[24, 24]} justify="center">
          <Col xs={12} sm={8}>
            <QrCard icon={<WechatOutlined />} label="微信客服二维码" seed={11} />
          </Col>
          <Col xs={12} sm={8}>
            <QrCard icon={<WechatOutlined />} label="微信小程序二维码" seed={22} />
          </Col>
          <Col xs={12} sm={8}>
            <QrCard icon={<QrcodeOutlined />} label="页面二维码" seed={33} />
          </Col>
          <Col xs={12} sm={8}>
            <QrCard icon={<AndroidOutlined />} label="安卓 App 下载" seed={44} />
          </Col>
          <Col xs={12} sm={8}>
            <QrCard icon={<AppleOutlined />} label="鸿蒙 OS 下载" seed={55} />
          </Col>
        </Row>
      </Card>

      {/* 底部提示 */}
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          以上联系方式及二维码均为示例展示，后续将替换为正式信息
        </Text>
      </div>
    </div>
  )
}

export default Contact
