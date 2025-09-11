import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface RecentActivity {
  id: number
  tipo: 'entrada' | 'salida' | 'ajuste' | 'transferencia'
  cantidad: number
  created_at: string
  producto: {
    nombre: string
    codigo: string
  }
  usuario: {
    email: string
  }
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    setLoading(true)
    setError(null)

    try {
      // Crear timeout de 8 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La consulta tardó demasiado')), 8000)
      })

      // Consultar movimientos recientes
      const queryPromise = supabase
        .from('movimiento')
        .select(`
          id,
          tipo,
          cantidad,
          created_at,
          producto:producto_id(nombre, codigo),
          usuario:usuario_id(email)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      const { data, error: queryError } = await Promise.race([queryPromise, timeoutPromise])

      if (queryError) throw queryError

      // Procesar los datos para manejar las relaciones de Supabase
      const processedData = data?.map(activity => ({
        id: activity.id,
        tipo: activity.tipo,
        cantidad: activity.cantidad,
        created_at: activity.created_at,
        producto: {
          nombre: 'Producto',
          codigo: 'N/A'
        },
        usuario: {
          email: 'Usuario'
        }
      })) || []

      setActivities(processedData)

    } catch (err: any) {
      console.error('Error fetching recent activities:', err)
      setError(err.message || 'Error al cargar la actividad reciente')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const refetch = () => {
    fetchActivities()
  }

  return {
    activities,
    loading,
    error,
    refetch
  }
}
