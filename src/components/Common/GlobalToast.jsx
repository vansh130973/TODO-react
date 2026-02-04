import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { useToast } from '../../context/useToast'

function GlobalToast() {
  const { toast, hideToast } = useToast()

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 2000 }}>
      <Toast
        show={toast.show}
        onClose={hideToast}
        delay={3000}
        autohide
        bg={toast.bg}
      >
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default GlobalToast

