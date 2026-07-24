import { useState } from 'react'
import { Tabs } from 'antd'
import { AI_PANELS } from '../../components/ai/AiPanels'

function AITablet() {
  const [activeKey, setActiveKey] = useState(AI_PANELS[0].key)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f5f5' }}>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        size="small"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 8px 0' }}
        tabBarStyle={{ marginBottom: 8, flexShrink: 0 }}
        items={AI_PANELS.map((p) => ({
          key: p.key,
          label: <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{p.label}</span>,
          children: (
            <div style={{ padding: '0 8px', overflow: 'auto', height: '100%', minHeight: 0 }}>
              {p.panel}
            </div>
          ),
        }))}
      />
    </div>
  )
}

export default AITablet
