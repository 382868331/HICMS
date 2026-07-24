import { createContext, useContext, useState, useCallback } from 'react'
import BookModal from './BookModal'

interface BookModalContextType {
  openBookModal: (roomName: string, roomId: number) => void
}

const BookModalContext = createContext<BookModalContextType | null>(null)

export function BookModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomId, setRoomId] = useState(0)

  const openBookModal = useCallback((name: string, id: number) => {
    setRoomName(name)
    setRoomId(id)
    setVisible(true)
  }, [])

  const closeBookModal = useCallback(() => setVisible(false), [])

  return (
    <BookModalContext.Provider value={{ openBookModal }}>
      {children}
      <BookModal
        visible={visible}
        roomName={roomName}
        roomId={roomId}
        onClose={closeBookModal}
        onSuccess={closeBookModal}
      />
    </BookModalContext.Provider>
  )
}

export function useBookModal() {
  const ctx = useContext(BookModalContext)
  if (!ctx) {
    throw new Error('useBookModal must be used within a BookModalProvider')
  }
  return ctx
}
