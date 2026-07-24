import { useDeviceType } from '../../hooks/useDeviceType'
import ProfileDesktop from './Desktop'
import ProfileTablet from './Tablet'
import ProfileMobile from './Mobile'

function Profile() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <ProfileDesktop />
  if (deviceType === 'tablet') return <ProfileTablet />
  return <ProfileMobile />
}

export default Profile
