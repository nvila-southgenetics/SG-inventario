'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import MovementTable from '@/components/movements/MovementTable'
import MovementFilters from '@/components/movements/MovementFilters'
import StatsCard from '@/components/dashboard/StatsCard'
import AddMovementForm from '@/components/movements/AddMovementForm'
import { ArrowUp, ArrowDown, TrendingUp, Calendar, Plus, RefreshCw, AlertTriangle, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useMovementMetrics } from '@/lib/hooks/useMovementMetrics'
import { MovementFilters as MovementFiltersType } from '@/components/movements/MovementFilters'

export default function MovimientosPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState<MovementFiltersType | undefined>(undefined)
  const { metrics, loading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useMovementMetrics()

  const handleAddSuccess = () => {
    setRefreshKey(prev => prev + 1)
    refetchMetrics()
  }

  const handleFiltersChange = (newFilters: MovementFiltersType) => {
    setFilters(newFilters)
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Movimientos</h1>
            <p className="text-gray-600 mt-2">
              Registro de entradas y salidas del inventario
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
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Movimiento
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
            title="Entradas Hoy"
            value={metricsLoading ? "..." : metrics.entradasHoy}
            change={metricsLoading ? "Cargando..." : `${metrics.entradasHoy} entradas registradas hoy`}
            changeType="neutral"
            icon={ArrowUp}
            color="green"
            loading={metricsLoading}
          />
          <StatsCard
            title="Salidas Hoy"
            value={metricsLoading ? "..." : metrics.salidasHoy}
            change={metricsLoading ? "Cargando..." : `${metrics.salidasHoy} salidas registradas hoy`}
            changeType="neutral"
            icon={ArrowDown}
            color="red"
            loading={metricsLoading}
          />
          <StatsCard
            title="Total Movimientos"
            value={metricsLoading ? "..." : metrics.totalMovimientos}
            change={metricsLoading ? "Cargando..." : `${metrics.totalMovimientos} movimientos totales`}
            changeType="neutral"
            icon={TrendingUp}
            color="mostaza"
            loading={metricsLoading}
          />
          <StatsCard
            title="Valor Entradas"
            value={metricsLoading ? "..." : `$${metrics.valorTotalEntradas.toLocaleString()}`}
            change={metricsLoading ? "Cargando..." : `Valor total de entradas hoy`}
            changeType="neutral"
            icon={DollarSign}
            color="violeta"
            loading={metricsLoading}
          />
        </div>

        {/* Movement Filters */}
        <MovementFilters
          onFiltersChange={handleFiltersChange}
          loading={metricsLoading}
        />

        {/* Movement Table */}
        <MovementTable key={refreshKey} filters={filters} />

        {/* Add Movement Form */}
        {showAddForm && (
          <AddMovementForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </Layout>
  )
}
