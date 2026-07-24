import { useEffect, useCallback } from 'react'
import './modal.css'

export interface ModalConfig {
  title?: string
  content: React.ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

interface ModalProps extends ModalConfig {
  visible: boolean
  onClose: () => void
}

function Modal({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel ? onCancel() : onClose()
      }
    },
    [onCancel, onClose]
  )

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [visible, handleKeyDown])

  if (!visible) return null

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close" onClick={handleCancel}>
              &times;
            </button>
          </div>
        )}
        <div className="modal-body">{content}</div>
        <div className="modal-footer">
          {showCancel && (
            <button className="btn btn-cancel" onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button className="btn btn-confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
