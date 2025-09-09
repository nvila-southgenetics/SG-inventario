'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'
import StatsCard from '@/components/dashboard/StatsCard'
import ChartCard from '@/components/dashboard/ChartCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import LowStockAlerts from '@/components/dashboard/LowStockAlerts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  ShoppingCart,
  Users
} from 'lucide-react'
import { Loader2 } from 'lucide-react'

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Resumen general del inventario de SouthGenetics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Productos"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={Package}
            color="mostaza"
          />
          <StatsCard
            title="Valor Inventario"
            value="$0"
            change="Sin datos"
            changeType="neutral"
            icon={DollarSign}
            color="violeta"
          />
          <StatsCard
            title="Movimientos Hoy"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title="Alertas Stock"
            value="0"
            change="Sin alertas"
            changeType="neutral"
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Ventas Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay datos de ventas disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay productos para mostrar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LowStockAlerts />
          </div>
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Proveedores Activos"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Órdenes Pendientes"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={ShoppingCart}
            color="blue"
          />
          <StatsCard
            title="Eficiencia Inventario"
            value="0%"
            change="Sin datos"
            changeType="neutral"
            icon={TrendingUp}
            color="mostaza"
          />
        </div>
      </div>
    </Layout>
  )
}