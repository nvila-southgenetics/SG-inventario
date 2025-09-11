import { useState, useEffect } from 'react'
import { Button } from './Button'
import { RefreshCw, Clock } from 'lucide-react'

interface LoadingWithTimeoutProps {
  message?: string
  timeout?: number
  onTimeout?: () => void
  showRefreshButton?: boolean
}

export default function LoadingWithTimeout({ 
  message = 'Cargando...', 
  timeout = 10000,
  onTimeout,
  showRefreshButton = true
}: LoadingWithTimeoutProps) {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true)
      if (onTimeout) {
        onTimeout()
      }
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onTimeout])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mostaza-500 mb-4"></div>
      <p className="text-gray-600 mb-4">{message}</p>
      
      {showTimeoutMessage && (
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-yellow-700 font-medium">
              La carga está tardando más de lo esperado
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Esto puede ser normal. Si continúa, intenta recargar la página.
          </p>
          {showRefreshButton && (
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar página
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
