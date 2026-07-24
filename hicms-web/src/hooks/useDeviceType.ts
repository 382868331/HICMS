import { useState, useEffect } from 'react'

export type DeviceType = 'pc' | 'tablet' | 'mobile'

const BREAKPOINTS = {
  tablet: 1024,
  mobile: 768,
} as const

function getDeviceType(width: number): DeviceType {
  if (width >= BREAKPOINTS.tablet) return 'pc'
  if (width >= BREAKPOINTS.mobile) return 'tablet'
  return 'mobile'
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(() =>
    getDeviceType(window.innerWidth)
  )

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setDeviceType(getDeviceType(window.innerWidth))
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [])

  return deviceType
}
