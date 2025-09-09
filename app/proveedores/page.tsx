'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import ProviderTable from '@/components/providers/ProviderTable'
import StatsCard from '@/components/dashboard/StatsCard'
import AddProviderForm from '@/components/providers/AddProviderForm'
import { Users, Star, TrendingUp, Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ProveedoresPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
            <p className="text-gray-600 mt-2">
              Gestiona la información de proveedores y sus productos
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-violeta hover:bg-violeta/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Proveedor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Proveedores"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={Users}
            color="mostaza"
          />
          <StatsCard
            title="Calificación Promedio"
            value="0.0"
            change="Sin datos"
            changeType="neutral"
            icon={Star}
            color="violeta"
          />
          <StatsCard
            title="Productos Únicos"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title="Compras Este Mes"
            value="0"
            change="Sin datos"
            changeType="neutral"
            icon={Calendar}
            color="green"
          />
        </div>

        {/* Provider Table */}
        <ProviderTable key={refreshKey} />

        {/* Add Provider Form */}
        {showAddForm && (
          <AddProviderForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </Layout>
  )
}
