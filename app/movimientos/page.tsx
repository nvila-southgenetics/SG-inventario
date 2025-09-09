'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import MovementTable from '@/components/movements/MovementTable'
import StatsCard from '@/components/dashboard/StatsCard'
import AddMovementForm from '@/components/movements/AddMovementForm'
import { ArrowUp, ArrowDown, TrendingUp, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function MovimientosPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddSuccess = () => {
    setRefreshKey(prev => prev + 1)
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
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Movimiento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Entradas Hoy"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={ArrowUp}
            color="green"
          />
          <StatsCard
            title="Salidas Hoy"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={ArrowDown}
            color="red"
          />
          <StatsCard
            title="Total Movimientos"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={TrendingUp}
            color="mostaza"
          />
          <StatsCard
            title="Promedio Diario"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={Calendar}
            color="violeta"
          />
        </div>

        {/* Movement Table */}
        <MovementTable key={refreshKey} />

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
