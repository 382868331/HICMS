import { useDeviceType } from '../../hooks/useDeviceType'
import HomeDesktop from './Desktop'
import HomeTablet from './Tablet'
import HomeMobile from './Mobile'

function Home() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <HomeDesktop />
  if (deviceType === 'tablet') return <HomeTablet />
  return <HomeMobile />
}

export default Home
