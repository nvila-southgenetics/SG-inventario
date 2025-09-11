import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ProductMetrics {
  totalProductos: number
  stockBajo: number
  valorTotal: number
  movimientosHoy: number
}

export function useProductMetrics() {
  const [metrics, setMetrics] = useState<ProductMetrics>({
    totalProductos: 0,
    stockBajo: 0,
    valorTotal: 0,
    movimientosHoy: 0
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
        // Total de productos activos
        supabase
          .from('producto')
          .select('id', { count: 'exact' })
          .eq('activo', true),

        // Productos con stock bajo (menos de 10 unidades)
        supabase
          .from('producto')
          .select('id', { count: 'exact' })
          .eq('activo', true)
          .lt('stock_actual', 10),

        // Valor total del inventario
        supabase
          .from('producto')
          .select('precio_venta, stock_actual')
          .eq('activo', true),

        // Movimientos de hoy
        supabase
          .from('movimiento')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date().toISOString().split('T')[0])
      ])

      const [
        totalProductosResult,
        stockBajoResult,
        valorTotalResult,
        movimientosHoyResult
      ] = await Promise.race([queriesPromise, timeoutPromise])

      // Procesar resultados
      const totalProductos = totalProductosResult.count || 0
      const stockBajo = stockBajoResult.count || 0
      
      const valorTotal = valorTotalResult.data?.reduce((total, producto) => {
        return total + (producto.precio_venta * producto.stock_actual)
      }, 0) || 0

      const movimientosHoy = movimientosHoyResult.count || 0

      setMetrics({
        totalProductos,
        stockBajo,
        valorTotal,
        movimientosHoy
      })

    } catch (err: any) {
      console.error('Error fetching product metrics:', err)
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
