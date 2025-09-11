'use client'

import { useEffect, Suspense, lazy } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'
import StatsCard from '@/components/dashboard/StatsCard'
import MonthlyMovementsChart from '@/components/dashboard/MonthlyMovementsChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  ShoppingCart,
  Users,
  Activity
} from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { useDashboardMetrics } from '@/lib/hooks/useDashboardMetrics'

// Lazy load heavy components
const RecentActivity = lazy(() => import('@/components/dashboard/RecentActivity'))

// Datos de ejemplo para los gráficos
const salesData = [
  { name: 'Ene', ventas: 4000 },
  { name: 'Feb', ventas: 3000 },
  { name: 'Mar', ventas: 5000 },
  { name: 'Abr', ventas: 4500 },
  { name: 'May', ventas: 6000 },
  { name: 'Jun', ventas: 5500 },
]

const inventoryData = [
  { name: 'Reactivos', cantidad: 400 },
  { name: 'Consumibles', cantidad: 300 },
  { name: 'Instrumentos', cantidad: 200 },
  { name: 'EPP', cantidad: 150 },
]

const categoryData = [
  { name: 'Reactivos', value: 35 },
  { name: 'Consumibles', value: 25 },
  { name: 'Instrumentos', value: 20 },
  { name: 'EPP', value: 20 },
]

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { metrics, loading: metricsLoading, error: metricsError, refetch } = useDashboardMetrics()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-mostaza-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Resumen general del inventario de SouthGenetics
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refetch}
              disabled={metricsLoading}
              className="px-4 py-2 bg-mostaza-500 text-white rounded-lg hover:bg-mostaza-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>{metricsLoading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {metricsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error al cargar métricas</h3>
                <p className="text-sm text-red-600 mt-1">{metricsError}</p>
                <button
                  onClick={refetch}
                  className="text-sm text-red-700 underline hover:text-red-800 mt-2"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Productos"
            value={metrics.totalProductos}
            change={metricsLoading ? "Cargando..." : `${metrics.totalProductos} productos activos`}
            changeType="neutral"
            icon={Package}
            color="mostaza"
            loading={metricsLoading}
          />
          <StatsCard
            title="Valor Inventario"
            value={`$${metrics.valorInventario.toLocaleString()}`}
            change={metricsLoading ? "Cargando..." : "Valor total en stock"}
            changeType="neutral"
            icon={DollarSign}
            color="violeta"
            loading={metricsLoading}
          />
          <StatsCard
            title="Movimientos Hoy"
            value={metrics.movimientosHoy}
            change={metricsLoading ? "Cargando..." : "Movimientos registrados hoy"}
            changeType="neutral"
            icon={Activity}
            color="blue"
            loading={metricsLoading}
          />
          <StatsCard
            title="Alertas Stock"
            value={metrics.alertasStock}
            change={metricsLoading ? "Cargando..." : metrics.alertasStock > 0 ? "Productos con stock bajo" : "Sin alertas"}
            changeType={metrics.alertasStock > 0 ? "negative" : "neutral"}
            icon={AlertTriangle}
            color="red"
            loading={metricsLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyMovementsChart
            entradas={metrics.entradasMensuales}
            salidas={metrics.salidasMensuales}
            loading={metricsLoading}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Resumen de Movimientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Entradas Totales</span>
                  </div>
                  <span className="text-lg font-bold text-green-900">
                    {metricsLoading ? "..." : metrics.entradasMensuales.reduce((sum, mov) => sum + mov.cantidad, 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-red-600 mr-2 rotate-180" />
                    <span className="text-sm font-medium text-red-800">Salidas Totales</span>
                  </div>
                  <span className="text-lg font-bold text-red-900">
                    {metricsLoading ? "..." : metrics.salidasMensuales.reduce((sum, mov) => sum + mov.cantidad, 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Productos Únicos</span>
                  </div>
                  <span className="text-lg font-bold text-blue-900">
                    {metricsLoading ? "..." : new Set([...metrics.entradasMensuales.map(m => m.producto), ...metrics.salidasMensuales.map(m => m.producto)]).size}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div>
            <Suspense fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Cargando actividad...</p>
                  </div>
                </CardContent>
              </Card>
            }>
              <RecentActivity />
            </Suspense>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Proveedores Activos"
            value={metricsLoading ? "..." : "Cargando..."}
            change={metricsLoading ? "Cargando..." : "Proveedores registrados"}
            changeType="neutral"
            icon={Users}
            color="green"
            loading={metricsLoading}
          />
          <StatsCard
            title="Movimientos Totales"
            value={metricsLoading ? "..." : metrics.entradasMensuales.length + metrics.salidasMensuales.length}
            change={metricsLoading ? "Cargando..." : "Últimos 30 días"}
            changeType="neutral"
            icon={ShoppingCart}
            color="blue"
            loading={metricsLoading}
          />
          <StatsCard
            title="Productos con Movimiento"
            value={metricsLoading ? "..." : new Set([...metrics.entradasMensuales.map(m => m.producto), ...metrics.salidasMensuales.map(m => m.producto)]).size}
            change={metricsLoading ? "Cargando..." : "Últimos 30 días"}
            changeType="neutral"
            icon={TrendingUp}
            color="mostaza"
            loading={metricsLoading}
          />
        </div>
      </div>
    </Layout>
  )
}