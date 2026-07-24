import { useDeviceType } from '../../hooks/useDeviceType'
import MeDesktop from './Desktop'
import MeTablet from './Tablet'
import MeMobile from './Mobile'

function MePage() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <MeDesktop />
  if (deviceType === 'tablet') return <MeTablet />
  return <MeMobile />
}

export default MePage
