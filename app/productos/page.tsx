'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import ProductTable from '@/components/products/ProductTable'
import StatsCard from '@/components/dashboard/StatsCard'
import AddProductForm from '@/components/products/AddProductForm'
import { Package, AlertTriangle, TrendingUp, DollarSign, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ProductosPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona el inventario de productos de SouthGenetics
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-mostaza hover:bg-mostaza/90">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
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
            title="Stock Bajo"
            value="0"
            change="Sin alertas"
            changeType="neutral"
            icon={AlertTriangle}
            color="red"
          />
          <StatsCard
            title="Valor Total"
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
        </div>

        {/* Product Table */}
        <ProductTable key={refreshKey} />

        {/* Add Product Form */}
        {showAddForm && (
          <AddProductForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </Layout>
  )
}
