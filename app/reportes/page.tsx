'use client'

import Layout from '@/components/layout/Layout'
import ChartCard from '@/components/dashboard/ChartCard'
import StatsCard from '@/components/dashboard/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react'

// Datos vacíos para los reportes
const salesData: any[] = []
const categoryData: any[] = []
const turnoverData: any[] = []
const topProducts: any[] = []

export default function ReportesPage() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600 mt-2">
              Análisis y reportes del inventario de SouthGenetics
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Filtrar período
            </Button>
            <Button className="bg-mostaza-500 hover:bg-mostaza-600">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Valor Total Inventario"
            value="$0"
            change="Sin datos"
            changeType="neutral"
            icon={DollarSign}
            color="mostaza"
          />
          <StatsCard
            title="Productos Activos"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={Package}
            color="violeta"
          />
          <StatsCard
            title="Rotación Promedio"
            value="0x"
            change="Sin datos"
            changeType="neutral"
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title="Alertas Activas"
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
              <CardTitle className="text-lg font-semibold text-gray-900">Ventas vs Compras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay datos de ventas disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Rotación de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay datos de rotación disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay productos para analizar</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Productos Más Movidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay movimientos registrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Resumen Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Entradas</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salidas</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nuevos Productos</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alertas Resueltas</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Eficiencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precisión Inventario</span>
                  <span className="font-medium text-gray-500">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo Promedio</span>
                  <span className="font-medium text-gray-500">0 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponibilidad</span>
                  <span className="font-medium text-gray-500">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfacción</span>
                  <span className="font-medium text-gray-500">0/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Próximas Acciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No hay acciones pendientes</p>
                <p className="text-sm text-gray-400 mt-1">Las acciones aparecerán aquí cuando sea necesario</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
