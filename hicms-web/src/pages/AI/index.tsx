import { useDeviceType } from '../../hooks/useDeviceType'
import AIDesktop from './Desktop'
import AITablet from './Tablet'
import AIMobile from './Mobile'

function AI() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <AIDesktop />
  if (deviceType === 'tablet') return <AITablet />
  return <AIMobile />
}

export default AI
