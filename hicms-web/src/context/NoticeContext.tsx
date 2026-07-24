import { createContext, useContext } from 'react'

interface NoticeContextType {
  openNotice: () => void
}

const NoticeContext = createContext<NoticeContextType>({ openNotice: () => {} })

export const NoticeProvider = NoticeContext.Provider

export function useNotice() {
  return useContext(NoticeContext)
}
