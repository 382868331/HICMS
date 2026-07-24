import { createContext, useContext, useState, useCallback } from 'react'
import Modal, { type ModalConfig } from '../components/Modal'

interface ModalContextType {
  openModal: (config: ModalConfig) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalConfig | null>(null)

  const openModal = useCallback((config: ModalConfig) => {
    setModal(config)
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        visible={modal !== null}
        title={modal?.title}
        content={modal?.content ?? ''}
        onConfirm={modal?.onConfirm}
        onCancel={modal?.onCancel}
        confirmText={modal?.confirmText}
        cancelText={modal?.cancelText}
        showCancel={modal?.showCancel}
        onClose={closeModal}
      />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return ctx
}
