'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [message, setMessage] = useState('Verificando conexión...')
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    setStatus('testing')
    setMessage('Verificando conexión con Supabase...')
    setDetails(null)

    try {
      // Test 1: Verificar variables de entorno
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Faltan variables de entorno de Supabase')
      }

      // Test 2: Probar conexión básica
      const { data, error } = await supabase
        .from('producto')
        .select('id', { count: 'exact', head: true })

      if (error) {
        throw error
      }

      // Test 3: Verificar sesión de autenticación
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      setStatus('success')
      setMessage('✅ Conexión exitosa con Supabase')
      setDetails({
        url: supabaseUrl,
        hasKey: !!supabaseKey,
        canQueryDatabase: true,
        session: session ? 'Sesión activa' : 'Sin sesión',
        totalProducts: data
      })

    } catch (err: any) {
      console.error('Error en conexión:', err)
      setStatus('error')
      setMessage('❌ Error de conexión con Supabase')
      setDetails({
        error: err.message,
        suggestion: 'Verifica que las variables de entorno estén configuradas correctamente en .env.local'
      })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          {status === 'testing' && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
          {status === 'error' && <XCircle className="w-4 h-4 mr-2 text-red-500" />}
          Estado de Conexión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm font-medium mb-2 ${
          status === 'success' ? 'text-green-600' : 
          status === 'error' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {message}
        </p>

        {details && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <pre className="text-xs text-gray-700 overflow-x-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-800">
                <p className="font-medium mb-1">¿Cómo solucionar?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Verifica que existe el archivo .env.local</li>
                  <li>Confirma que las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY estén configuradas</li>
                  <li>Reinicia el servidor de desarrollo</li>
                  <li>Verifica que el proyecto de Supabase esté activo</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={testConnection}
          variant="outline"
          size="sm"
          className="w-full mt-3"
          disabled={status === 'testing'}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${status === 'testing' ? 'animate-spin' : ''}`} />
          Probar Conexión Nuevamente
        </Button>
      </CardContent>
    </Card>
  )
}

