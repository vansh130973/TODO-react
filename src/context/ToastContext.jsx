import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toastContext'

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    bg: 'dark'
  })

  const showToast = useCallback((message, bg = 'dark') => {
    setToast({ show: true, message, bg })
  }, [])

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, show: false }))
  }, [])

  const value = useMemo(() => ({ toast, showToast, hideToast }), [toast, showToast, hideToast])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

