'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, Filter, X, Calendar, Package } from 'lucide-react'

interface ProductFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void
  loading?: boolean
}

export interface ProductFilters {
  searchTerm: string
  dateFrom: string
  dateTo: string
  stockFilter: 'all' | 'low' | 'normal' | 'high'
  sortBy: 'name' | 'created_at' | 'stock_actual' | 'precio_venta'
  sortOrder: 'asc' | 'desc'
}

const defaultFilters: ProductFilters = {
  searchTerm: '',
  dateFrom: '',
  dateTo: '',
  stockFilter: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc'
}

export default function ProductFilters({ onFiltersChange, loading = false }: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const hasActiveFilters = filters.searchTerm || filters.dateFrom || filters.dateTo || filters.stockFilter !== 'all'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ocultar' : 'Avanzados'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Búsqueda básica */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, código o descripción..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          {/* Filtros avanzados */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              {/* Filtro por fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha desde
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha hasta
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Filtro por stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Package className="w-4 h-4 inline mr-1" />
                  Stock
                </label>
                <select
                  value={filters.stockFilter}
                  onChange={(e) => handleFilterChange('stockFilter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="all">Todos</option>
                  <option value="low">Stock bajo (&lt; 10)</option>
                  <option value="normal">Stock normal (10-50)</option>
                  <option value="high">Stock alto (&gt; 50)</option>
                </select>
              </div>

              {/* Ordenamiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    handleFilterChange('sortBy', sortBy)
                    handleFilterChange('sortOrder', sortOrder)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="created_at-desc">Más recientes</option>
                  <option value="created_at-asc">Más antiguos</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="stock_actual-desc">Mayor stock</option>
                  <option value="stock_actual-asc">Menor stock</option>
                  <option value="precio_venta-desc">Mayor precio</option>
                  <option value="precio_venta-asc">Menor precio</option>
                </select>
              </div>
            </div>
          )}

          {/* Indicador de filtros activos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filters.searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-mostaza-100 text-mostaza-800">
                  Búsqueda: {filters.searchTerm}
                  <button
                    onClick={() => handleFilterChange('searchTerm', '')}
                    className="ml-1 hover:text-mostaza-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateFrom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Desde: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateTo && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Hasta: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.stockFilter !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Stock: {filters.stockFilter === 'low' ? 'Bajo' : filters.stockFilter === 'normal' ? 'Normal' : 'Alto'}
                  <button
                    onClick={() => handleFilterChange('stockFilter', 'all')}
                    className="ml-1 hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
