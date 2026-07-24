import { useState } from 'react'
import { Typography } from 'antd'
import { AI_PANELS } from '../../components/ai/AiPanels'

const { Text } = Typography

function AIMobile() {
  const [activeKey, setActiveKey] = useState<string>(AI_PANELS[0].key)

  const activePanel = AI_PANELS.find((p) => p.key === activeKey)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f5f5' }}>
      {/* 顶部功能选择 - 手写 flex-wrap 网格 */}
      <div style={{ flexShrink: 0, padding: '4px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {AI_PANELS.map((p) => (
          <div
            key={p.key}
            onClick={() => setActiveKey(p.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '4px 8px', borderRadius: 4, cursor: 'pointer',
              background: activeKey === p.key ? '#e6f4ff' : '#fff',
              border: activeKey === p.key ? '1px solid #91caff' : '1px solid #eee',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 12, color: activeKey === p.key ? '#1677ff' : '#666' }}>{p.icon}</span>
            <Text style={{
              fontSize: 11,
              color: activeKey === p.key ? '#1677ff' : '#333',
              fontWeight: activeKey === p.key ? 600 : 400,
              whiteSpace: 'nowrap',
            }}>
              {p.label}
            </Text>
          </div>
        ))}
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, padding: '6px 4px', overflow: 'auto', minHeight: 0 }}>
        {activePanel?.panel}
      </div>
    </div>
  )
}

export default AIMobile
