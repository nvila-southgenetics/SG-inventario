'use client'

import { useState, Suspense, lazy } from 'react'
import Layout from '@/components/layout/Layout'
import StatsCard from '@/components/dashboard/StatsCard'
import ProviderFilters from '@/components/providers/ProviderFilters'
import { Users, Star, TrendingUp, Calendar, Plus, Loader2, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useProviderMetrics } from '@/lib/hooks/useProviderMetrics'
import { ProviderFilters as ProviderFiltersType } from '@/components/providers/ProviderFilters'

// Lazy load heavy components
const ProviderTable = lazy(() => import('@/components/providers/ProviderTable'))
const AddProviderForm = lazy(() => import('@/components/providers/AddProviderForm'))

export default function ProveedoresPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState<ProviderFiltersType | undefined>(undefined)
  const { metrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useProviderMetrics()

  const handleAddSuccess = () => {
    setRefreshKey(prev => prev + 1)
    refetchMetrics()
  }

  const handleFiltersChange = (newFilters: ProviderFiltersType) => {
    setFilters(newFilters)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
            <p className="text-gray-600 mt-2">
              Gestiona la información de proveedores y sus productos
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={refetchMetrics}
              disabled={metricsLoading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${metricsLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="bg-violeta hover:bg-violeta/90">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Proveedor
            </Button>
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
                  onClick={refetchMetrics}
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
            title="Total Proveedores"
            value={metricsLoading ? "..." : metrics.totalProveedores}
            change={metricsLoading ? "Cargando..." : `${metrics.totalProveedores} proveedores registrados`}
            changeType="neutral"
            icon={Users}
            color="mostaza"
            loading={metricsLoading}
          />
          <StatsCard
            title="Calificación Promedio"
            value={metricsLoading ? "..." : metrics.calificacionPromedio.toFixed(1)}
            change={metricsLoading ? "Cargando..." : `${metrics.calificacionPromedio.toFixed(1)} estrellas promedio`}
            changeType="neutral"
            icon={Star}
            color="violeta"
            loading={metricsLoading}
          />
          <StatsCard
            title="Proveedores Activos"
            value={metricsLoading ? "..." : metrics.proveedoresActivos}
            change={metricsLoading ? "Cargando..." : `${metrics.proveedoresActivos} proveedores activos`}
            changeType="neutral"
            icon={TrendingUp}
            color="blue"
            loading={metricsLoading}
          />
          <StatsCard
            title="Con Productos"
            value={metricsLoading ? "..." : metrics.proveedoresConProductos}
            change={metricsLoading ? "Cargando..." : `${metrics.proveedoresConProductos} proveedores con productos`}
            changeType="neutral"
            icon={Calendar}
            color="green"
            loading={metricsLoading}
          />
        </div>

        {/* Provider Filters */}
        <ProviderFilters
          onFiltersChange={handleFiltersChange}
          loading={metricsLoading}
        />

        {/* Provider Table */}
        <Suspense fallback={
          <Card>
            <CardHeader>
              <CardTitle>Proveedores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Cargando proveedores...</p>
              </div>
            </CardContent>
          </Card>
        }>
          <ProviderTable key={refreshKey} filters={filters} />
        </Suspense>

        {/* Add Provider Form */}
        {showAddForm && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl mx-4">
                <CardHeader>
                  <CardTitle>Agregar Proveedor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Cargando formulario...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          }>
            <AddProviderForm
              onClose={() => setShowAddForm(false)}
              onSuccess={handleAddSuccess}
            />
          </Suspense>
        )}
      </div>
    </Layout>
  )
}
