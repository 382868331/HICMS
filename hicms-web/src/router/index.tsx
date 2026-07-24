import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'
import img404 from '../assets/404.svg'
import img500 from '../assets/500.svg'
import imgNetwork from '../assets/网络异常.svg'
import ErrorPage from '../pages/ErrorPage'

const Meeting = lazy(() => import('../pages/Meeting'))
const Contacts = lazy(() => import('../pages/Contacts'))
const AI = lazy(() => import('../pages/AI'))
const Admin = lazy(() => import('../pages/Admin'))
const Profile = lazy(() => import('../pages/Profile'))
const Tools = lazy(() => import('../pages/Tools'))
const MePage = lazy(() => import('../pages/Me'))
const Notices = lazy(() => import('../pages/Me/Notices'))
const EditInfo = lazy(() => import('../pages/Profile/EditInfo'))
const Contact = lazy(() => import('../pages/Profile/Contact'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/meeting" replace /> },
      { path: 'meeting', element: <Meeting /> },
      { path: 'tools', element: <Tools /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'ai', element: <AI /> },
      { path: 'admin', element: <Admin /> },
      { path: 'profile', element: <Profile /> },
      { path: 'me', element: <MePage /> },
      { path: 'me/notices', element: <Notices /> },
      { path: 'profile/edit', element: <EditInfo /> },
      { path: 'profile/contact', element: <Contact /> },
      { path: '500', element: <ErrorPage img={img500} title="服务端异常" description="服务器暂时无法响应，请稍后重试或联系管理员" /> },
      { path: 'network-error', element: <ErrorPage img={imgNetwork} title="网络异常" description="网络连接失败，请检查网络设置后重试" /> },
      { path: '*', element: <ErrorPage img={img404} title="页面不存在" description="您访问的页面不存在或已被移除，请检查网址是否正确" /> },
    ],
  },
])

export default router
