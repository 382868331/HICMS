import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ToolsDesktop() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/meeting', { replace: true })
  }, [navigate])

  return null
}

export default ToolsDesktop
