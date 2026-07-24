import { useState, useEffect, useCallback, Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ModalProvider } from './context/ModalContext'
import { NoticeProvider } from './context/NoticeContext'
import { BookModalProvider } from './components/book'
import { useDeviceType } from './hooks/useDeviceType'
import { setUnauthorizedHandler, setServerErrorHandler, setNetworkErrorHandler } from './utils/request'
import Toolbar from './components/Toolbar'
import { LoginModal, LoginModalMobile } from './components/login'
import { NoticeModal } from './components/notice'
import Loading from './components/Loading'

function AppLayout() {
  const deviceType = useDeviceType()
  const navigate = useNavigate()
  const [loginVisible, setLoginVisible] = useState(false)
  const [noticeVisible, setNoticeVisible] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const openLogin = useCallback(() => setLoginVisible(true), [])
  const openNotice = useCallback(() => setNoticeVisible(true), [])
  const goServerError = useCallback(() => navigate('/500', { replace: true }), [navigate])
  const goNetworkError = useCallback(() => navigate('/network-error', { replace: true }), [navigate])

  useEffect(() => {
    setUnauthorizedHandler(openLogin)
    setServerErrorHandler(goServerError)
    setNetworkErrorHandler(goNetworkError)
  }, [openLogin, goServerError, goNetworkError])

  const loginProps = {
    visible: loginVisible,
    onClose: () => setLoginVisible(false),
    onSuccess: () => {
      setLoginVisible(false)
      setRefreshKey(k => k + 1)
    },
  }

  if (deviceType === 'tablet') {
    return (
      <NoticeProvider value={{ openNotice }}>
        <div style={{ display: 'flex', height: '100svh', overflow: 'hidden' }}>
          <Toolbar key={refreshKey} onNoticeClick={openNotice} />
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
            <Suspense fallback={<Loading />}>
              <Outlet key={refreshKey} />
            </Suspense>
          </div>
          <LoginModal {...loginProps} />
          <NoticeModal visible={noticeVisible} onClose={() => setNoticeVisible(false)} />
        </div>
      </NoticeProvider>
    )
  }

  if (deviceType === 'mobile') {
    return (
      <NoticeProvider value={{ openNotice }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100svh', overflow: 'hidden' }}>
          <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
            <Suspense fallback={<Loading />}>
              <Outlet key={refreshKey} />
            </Suspense>
          </div>
          <Toolbar key={refreshKey} onNoticeClick={openNotice} />
          <LoginModalMobile {...loginProps} />
          <NoticeModal visible={noticeVisible} onClose={() => setNoticeVisible(false)} />
        </div>
      </NoticeProvider>
    )
  }

  return (
    <NoticeProvider value={{ openNotice }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Toolbar key={refreshKey} onNoticeClick={openNotice} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense fallback={<Loading />}>
            <Outlet key={refreshKey} />
          </Suspense>
        </div>
        <LoginModal {...loginProps} />
        <NoticeModal visible={noticeVisible} onClose={() => setNoticeVisible(false)} />
      </div>
    </NoticeProvider>
  )
}

function App() {
  return (
    <ModalProvider>
      <BookModalProvider>
        <AppLayout />
      </BookModalProvider>
    </ModalProvider>
  )
}

export default App
