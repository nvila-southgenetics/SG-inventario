'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Search, Filter, X, Star, Users, Calendar } from 'lucide-react'

interface ProviderFiltersProps {
  onFiltersChange: (filters: ProviderFilters) => void
  loading?: boolean
}

export interface ProviderFilters {
  searchTerm: string
  calificacionMinima: string
  activo: 'all' | 'activo' | 'inactivo'
  sortBy: 'nombre' | 'created_at' | 'calificacion' | 'email'
  sortOrder: 'asc' | 'desc'
}

const defaultFilters: ProviderFilters = {
  searchTerm: '',
  calificacionMinima: '',
  activo: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc'
}

export default function ProviderFilters({ onFiltersChange, loading = false }: ProviderFiltersProps) {
  const [filters, setFilters] = useState<ProviderFilters>(defaultFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof ProviderFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const hasActiveFilters = filters.searchTerm || filters.calificacionMinima || filters.activo !== 'all'

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
              placeholder="Buscar por nombre, email o contacto..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          {/* Filtros avanzados */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              {/* Filtro por calificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Star className="w-4 h-4 inline mr-1" />
                  Calificación mínima
                </label>
                <select
                  value={filters.calificacionMinima}
                  onChange={(e) => handleFilterChange('calificacionMinima', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Todas las calificaciones</option>
                  <option value="5">5 estrellas</option>
                  <option value="4">4+ estrellas</option>
                  <option value="3">3+ estrellas</option>
                  <option value="2">2+ estrellas</option>
                  <option value="1">1+ estrellas</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Estado
                </label>
                <select
                  value={filters.activo}
                  onChange={(e) => handleFilterChange('activo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="all">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
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
                  <option value="nombre-asc">Nombre A-Z</option>
                  <option value="nombre-desc">Nombre Z-A</option>
                  <option value="calificacion-desc">Mayor calificación</option>
                  <option value="calificacion-asc">Menor calificación</option>
                  <option value="email-asc">Email A-Z</option>
                  <option value="email-desc">Email Z-A</option>
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
              {filters.calificacionMinima && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  <Star className="w-3 h-3 mr-1" />
                  {filters.calificacionMinima}+ estrellas
                  <button
                    onClick={() => handleFilterChange('calificacionMinima', '')}
                    className="ml-1 hover:text-yellow-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.activo !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <Users className="w-3 h-3 mr-1" />
                  {filters.activo === 'activo' ? 'Activos' : 'Inactivos'}
                  <button
                    onClick={() => handleFilterChange('activo', 'all')}
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
