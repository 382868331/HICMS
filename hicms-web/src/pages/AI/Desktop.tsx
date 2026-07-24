import { useState } from 'react'
import { Layout, Typography } from 'antd'
import { AI_PANELS } from '../../components/ai/AiPanels'

const { Sider, Content } = Layout
const { Text } = Typography

function AIDesktop() {
  const [activeKey, setActiveKey] = useState(AI_PANELS[0].key)

  const activePanel = AI_PANELS.find((p) => p.key === activeKey)

  return (
    <Layout style={{ flex: 1, height: '100%', background: '#f5f5f5' }}>
      <Sider width={100} style={{ background: '#fff', borderRight: '1px solid #eee', overflow: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8 }}>
          {AI_PANELS.map((p) => (
            <div
              key={p.key}
              onClick={() => setActiveKey(p.key)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '10px 4px', borderRadius: 6, cursor: 'pointer',
                background: activeKey === p.key ? '#e6f4ff' : 'transparent',
                border: activeKey === p.key ? '1px solid #91caff' : '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (activeKey !== p.key) (e.currentTarget as HTMLElement).style.background = '#fafafa' }}
              onMouseLeave={(e) => { if (activeKey !== p.key) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: 20, color: activeKey === p.key ? '#1677ff' : '#666', marginBottom: 4 }}>
                {p.icon}
              </span>
              <Text
                style={{
                  fontSize: 11,
                  color: activeKey === p.key ? '#1677ff' : '#333',
                  fontWeight: activeKey === p.key ? 600 : 400,
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {p.label}
              </Text>
            </div>
          ))}
        </div>
      </Sider>

      <Content style={{ padding: '12px 16px', overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activePanel?.panel}
        </div>
      </Content>
    </Layout>
  )
}

export default AIDesktop
