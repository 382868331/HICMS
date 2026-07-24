import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ToolsTablet() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/meeting', { replace: true })
  }, [navigate])

  return null
}

export default ToolsTablet
