import { useDeviceType } from '../../hooks/useDeviceType'
import ContactsDesktop from './Desktop'
import ContactsTablet from './Tablet'
import ContactsMobile from './Mobile'

function Contacts() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <ContactsDesktop />
  if (deviceType === 'tablet') return <ContactsTablet />
  return <ContactsMobile />
}

export default Contacts
