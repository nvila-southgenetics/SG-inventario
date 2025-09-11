'use client'

import { useState, Suspense, lazy } from 'react'
import Layout from '@/components/layout/Layout'
import StatsCard from '@/components/dashboard/StatsCard'
import ProductFilters from '@/components/products/ProductFilters'
import { Package, AlertTriangle, TrendingUp, DollarSign, Plus, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useProductMetrics } from '@/lib/hooks/useProductMetrics'
import { ProductFilters as ProductFiltersType } from '@/components/products/ProductFilters'

// Lazy load heavy components
const ProductTable = lazy(() => import('@/components/products/ProductTable'))
const AddProductForm = lazy(() => import('@/components/products/AddProductForm'))

export default function ProductosPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState<ProductFiltersType | undefined>(undefined)
  const { metrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useProductMetrics()

  const handleAddSuccess = () => {
    setRefreshKey(prev => prev + 1)
    refetchMetrics()
  }

  const handleFiltersChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona el inventario de productos de SouthGenetics
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
            <Button onClick={() => setShowAddForm(true)} className="bg-mostaza hover:bg-mostaza/90">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
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
            title="Total Productos"
            value={metricsLoading ? "..." : metrics.totalProductos}
            change={metricsLoading ? "Cargando..." : `${metrics.totalProductos} productos activos`}
            changeType="neutral"
            icon={Package}
            color="mostaza"
            loading={metricsLoading}
          />
          <StatsCard
            title="Stock Bajo"
            value={metricsLoading ? "..." : metrics.stockBajo}
            change={metricsLoading ? "Cargando..." : metrics.stockBajo > 0 ? `${metrics.stockBajo} productos con stock bajo` : "Sin alertas"}
            changeType={metrics.stockBajo > 0 ? "negative" : "neutral"}
            icon={AlertTriangle}
            color="red"
            loading={metricsLoading}
          />
          <StatsCard
            title="Valor Total"
            value={metricsLoading ? "..." : `$${metrics.valorTotal.toLocaleString()}`}
            change={metricsLoading ? "Cargando..." : `Valor total del inventario`}
            changeType="neutral"
            icon={DollarSign}
            color="violeta"
            loading={metricsLoading}
          />
          <StatsCard
            title="Movimientos Hoy"
            value={metricsLoading ? "..." : metrics.movimientosHoy}
            change={metricsLoading ? "Cargando..." : `${metrics.movimientosHoy} movimientos registrados hoy`}
            changeType="neutral"
            icon={TrendingUp}
            color="blue"
            loading={metricsLoading}
          />
        </div>

        {/* Product Filters */}
        <ProductFilters
          onFiltersChange={handleFiltersChange}
          loading={metricsLoading}
        />

        {/* Product Table */}
        <Suspense fallback={
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Cargando productos...</p>
              </div>
            </CardContent>
          </Card>
        }>
          <ProductTable key={refreshKey} filters={filters} />
        </Suspense>

        {/* Add Product Form */}
        {showAddForm && (
          <Suspense fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl mx-4">
                <CardHeader>
                  <CardTitle>Agregar Producto</CardTitle>
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
            <AddProductForm
              onClose={() => setShowAddForm(false)}
              onSuccess={handleAddSuccess}
            />
          </Suspense>
        )}
      </div>
    </Layout>
  )
}
