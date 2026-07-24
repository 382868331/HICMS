import { useDeviceType } from '../../hooks/useDeviceType'
import MeetingDesktop from './Desktop'
import MeetingTablet from './Tablet'
import MeetingMobile from './Mobile'

function Meeting() {
  const deviceType = useDeviceType()

  if (deviceType === 'pc') return <MeetingDesktop />
  if (deviceType === 'tablet') return <MeetingTablet />
  return <MeetingMobile />
}

export default Meeting
