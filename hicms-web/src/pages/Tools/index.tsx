import { useDeviceType } from '../../hooks/useDeviceType'
import ToolsDesktop from './Desktop'
import ToolsTablet from './Tablet'
import ToolsMobile from './Mobile'

function Tools() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <ToolsDesktop />
  if (deviceType === 'tablet') return <ToolsTablet />
  return <ToolsMobile />
}

export default Tools
