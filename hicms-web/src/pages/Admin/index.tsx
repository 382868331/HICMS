import { useDeviceType } from '../../hooks/useDeviceType'
import AdminDesktop from './Desktop'
import AdminTablet from './Tablet'
import AdminMobile from './Mobile'

function Admin() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <AdminDesktop />
  if (deviceType === 'tablet') return <AdminTablet />
  return <AdminMobile />
}

export default Admin
