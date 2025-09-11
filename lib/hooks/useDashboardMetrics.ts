import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashboardMetrics {
  totalProductos: number
  valorInventario: number
  movimientosHoy: number
  alertasStock: number
  entradasMensuales: Array<{
    producto: string
    cantidad: number
    fecha: string
  }>
  salidasMensuales: Array<{
    producto: string
    cantidad: number
    fecha: string
  }>
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProductos: 0,
    valorInventario: 0,
    movimientosHoy: 0,
    alertasStock: 0,
    entradasMensuales: [],
    salidasMensuales: []
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
        // Total de productos
        supabase
          .from('producto')
          .select('id', { count: 'exact' })
          .eq('activo', true),

        // Valor total del inventario
        supabase
          .from('producto')
          .select('precio_venta, stock_actual')
          .eq('activo', true),

        // Movimientos de hoy
        supabase
          .from('movimiento')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date().toISOString().split('T')[0]),

        // Productos con stock bajo (menos de 10 unidades)
        supabase
          .from('producto')
          .select('id', { count: 'exact' })
          .eq('activo', true)
          .lt('stock_actual', 10),

        // Entradas mensuales (últimos 30 días)
        supabase
          .from('movimiento')
          .select(`
            cantidad,
            tipo,
            created_at,
            producto:producto_id(nombre)
          `)
          .eq('tipo', 'entrada')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false }),

        // Salidas mensuales (últimos 30 días)
        supabase
          .from('movimiento')
          .select(`
            cantidad,
            tipo,
            created_at,
            producto:producto_id(nombre)
          `)
          .eq('tipo', 'salida')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
      ])

      const [
        totalProductosResult,
        inventarioResult,
        movimientosHoyResult,
        alertasStockResult,
        entradasResult,
        salidasResult
      ] = await Promise.race([queriesPromise, timeoutPromise])

      // Procesar resultados
      const totalProductos = totalProductosResult.count || 0
      
      const valorInventario = inventarioResult.data?.reduce((total, producto) => {
        return total + (producto.precio_venta * producto.stock_actual)
      }, 0) || 0

      const movimientosHoy = movimientosHoyResult.count || 0
      const alertasStock = alertasStockResult.count || 0

      // Procesar entradas mensuales
      const entradasMensuales = entradasResult.data?.map(mov => ({
        producto: 'Producto',
        cantidad: mov.cantidad,
        fecha: mov.created_at
      })) || []

      // Procesar salidas mensuales
      const salidasMensuales = salidasResult.data?.map(mov => ({
        producto: 'Producto',
        cantidad: mov.cantidad,
        fecha: mov.created_at
      })) || []

      setMetrics({
        totalProductos,
        valorInventario,
        movimientosHoy,
        alertasStock,
        entradasMensuales,
        salidasMensuales
      })

    } catch (err: any) {
      console.error('Error fetching dashboard metrics:', err)
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
