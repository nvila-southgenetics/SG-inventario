import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface UseSupabaseQueryOptions {
  timeout?: number
  retries?: number
  retryDelay?: number
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: UseSupabaseQueryOptions = {}
) {
  const {
    timeout = 10000, // 10 segundos por defecto
    retries = 2,
    retryDelay = 1000
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const executeQuery = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Crear una promesa con timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La consulta tardó demasiado')), timeout)
      })

      // Ejecutar la consulta con timeout
      const result = await Promise.race([
        queryFn(),
        timeoutPromise
      ])

      if (result.error) {
        throw result.error
      }

      setData(result.data)
      setRetryCount(0)
    } catch (err: any) {
      console.error('Error en consulta Supabase:', err)
      
      if (retryCount < retries) {
        // Reintentar después de un delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, retryDelay)
      } else {
        setError(err.message || 'Error desconocido')
      }
    } finally {
      setLoading(false)
    }
  }, [queryFn, timeout, retries, retryDelay, retryCount])

  useEffect(() => {
    executeQuery()
  }, [executeQuery])

  const refetch = useCallback(() => {
    setRetryCount(0)
    executeQuery()
  }, [executeQuery])

  return {
    data,
    loading,
    error,
    refetch,
    retryCount
  }
}

// Hook específico para consultas de productos con paginación
export function useProductsQuery(page: number, limit: number = 10) {
  return useSupabaseQuery(
    async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('producto')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      return { data: { data: data || [], count: count || 0 }, error }
    },
    { timeout: 8000, retries: 3 }
  )
}

// Hook específico para consultas de proveedores con paginación
export function useProvidersQuery(page: number, limit: number = 10) {
  return useSupabaseQuery(
    async () => {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('proveedor')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      return { data: { data: data || [], count: count || 0 }, error }
    },
    { timeout: 8000, retries: 3 }
  )
}
