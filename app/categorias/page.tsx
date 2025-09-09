'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import AddCategoryForm from '@/components/categories/AddCategoryForm'
import CategoryTable from '@/components/categories/CategoryTable'
import { Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CategoriasPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
            <p className="text-gray-600 mt-2">
              Gestiona las categorías de productos
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Categoría
          </Button>
        </div>

        {/* Categories Table */}
        <CategoryTable key={refreshKey} />

        {/* Add Category Form */}
        {showAddForm && (
          <AddCategoryForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </Layout>
  )
}
