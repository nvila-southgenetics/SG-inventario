'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, Filter, X, Calendar, Package, ArrowUpDown } from 'lucide-react'

interface MovementFiltersProps {
  onFiltersChange: (filters: MovementFilters) => void
  loading?: boolean
}

export interface MovementFilters {
  searchTerm: string
  tipo: 'all' | 'entrada' | 'salida' | 'ajuste' | 'transferencia'
  fechaDesde: string
  fechaHasta: string
  sortBy: 'created_at' | 'tipo' | 'cantidad'
  sortOrder: 'asc' | 'desc'
}

const defaultFilters: MovementFilters = {
  searchTerm: '',
  tipo: 'all',
  fechaDesde: '',
  fechaHasta: '',
  sortBy: 'created_at',
  sortOrder: 'desc'
}

export default function MovementFilters({ onFiltersChange, loading = false }: MovementFiltersProps) {
  const [filters, setFilters] = useState<MovementFilters>(defaultFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof MovementFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const hasActiveFilters = filters.searchTerm || filters.tipo !== 'all' || filters.fechaDesde || filters.fechaHasta

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
              placeholder="Buscar por producto, usuario o descripción..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          {/* Filtros avanzados */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <ArrowUpDown className="w-4 h-4 inline mr-1" />
                  Tipo de Movimiento
                </label>
                <select
                  value={filters.tipo}
                  onChange={(e) => handleFilterChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="entrada">Entradas</option>
                  <option value="salida">Salidas</option>
                  <option value="ajuste">Ajustes</option>
                  <option value="transferencia">Transferencias</option>
                </select>
              </div>

              {/* Filtro por fecha desde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha desde
                </label>
                <Input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Filtro por fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha hasta
                </label>
                <Input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                  disabled={loading}
                />
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
                  <option value="tipo-asc">Tipo A-Z</option>
                  <option value="tipo-desc">Tipo Z-A</option>
                  <option value="cantidad-desc">Mayor cantidad</option>
                  <option value="cantidad-asc">Menor cantidad</option>
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
              {filters.tipo !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  {filters.tipo === 'entrada' ? 'Entradas' : 
                   filters.tipo === 'salida' ? 'Salidas' :
                   filters.tipo === 'ajuste' ? 'Ajustes' : 'Transferencias'}
                  <button
                    onClick={() => handleFilterChange('tipo', 'all')}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.fechaDesde && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <Calendar className="w-3 h-3 mr-1" />
                  Desde: {filters.fechaDesde}
                  <button
                    onClick={() => handleFilterChange('fechaDesde', '')}
                    className="ml-1 hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.fechaHasta && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <Calendar className="w-3 h-3 mr-1" />
                  Hasta: {filters.fechaHasta}
                  <button
                    onClick={() => handleFilterChange('fechaHasta', '')}
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
