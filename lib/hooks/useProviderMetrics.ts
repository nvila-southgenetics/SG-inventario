import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ProviderMetrics {
  totalProveedores: number
  proveedoresActivos: number
  calificacionPromedio: number
  proveedoresConProductos: number
}

export function useProviderMetrics() {
  const [metrics, setMetrics] = useState<ProviderMetrics>({
    totalProveedores: 0,
    proveedoresActivos: 0,
    calificacionPromedio: 0,
    proveedoresConProductos: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    setLoading(true)
    setError(null)

    try {
      // Crear timeout de 10 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La consulta tardó demasiado')), 10000)
      })

      // Ejecutar todas las consultas en paralelo
      const queriesPromise = Promise.all([
        // Total de proveedores
        supabase
          .from('proveedor')
          .select('id', { count: 'exact' }),

        // Proveedores activos
        supabase
          .from('proveedor')
          .select('id', { count: 'exact' })
          .eq('activo', true),

        // Calificación promedio
        supabase
          .from('proveedor')
          .select('calificacion')
          .eq('activo', true),

        // Proveedores que tienen productos
        supabase
          .from('producto')
          .select('proveedor_id')
          .eq('activo', true)
          .not('proveedor_id', 'is', null)
      ])

      const [
        totalProveedoresResult,
        proveedoresActivosResult,
        calificacionResult,
        proveedoresConProductosResult
      ] = await Promise.race([queriesPromise, timeoutPromise])

      // Procesar resultados
      const totalProveedores = totalProveedoresResult.count || 0
      const proveedoresActivos = proveedoresActivosResult.count || 0
      
      // Calcular calificación promedio
      const calificaciones = calificacionResult.data?.map(p => p.calificacion) || []
      const calificacionPromedio = calificaciones.length > 0 
        ? calificaciones.reduce((sum, cal) => sum + (parseFloat(cal) || 0), 0) / calificaciones.length
        : 0

      // Contar proveedores únicos que tienen productos
      const proveedoresUnicos = new Set(proveedoresConProductosResult.data?.map(p => p.proveedor_id) || [])
      const proveedoresConProductos = proveedoresUnicos.size

      setMetrics({
        totalProveedores,
        proveedoresActivos,
        calificacionPromedio,
        proveedoresConProductos
      })

    } catch (err: any) {
      console.error('Error fetching provider metrics:', err)
      setError(err.message || 'Error al cargar las métricas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  const refetch = () => {
    fetchMetrics()
  }

  return {
    metrics,
    loading,
    error,
    refetch
  }
}
