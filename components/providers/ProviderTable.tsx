'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Users, Star, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import LoadingWithTimeout from '@/components/ui/LoadingWithTimeout'
import { supabase } from '@/lib/supabase'
import { ProviderFilters } from './ProviderFilters'
import EditProviderForm from './EditProviderForm'

interface Provider {
  id: number
  nombre: string
  contacto: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  pais: string
  calificacion: string
  activo: boolean
  created_at: string
}

interface ProviderTableProps {
  filters?: ProviderFilters
}

export default function ProviderTable({ filters }: ProviderTableProps) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const limit = 10

  const fetchProviders = async (page: number, currentFilters?: ProviderFilters) => {
    setLoading(true)
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      // Crear una promesa con timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La consulta tardó demasiado')), 8000)
      })

      // Construir la consulta base
      let query = supabase
        .from('proveedor')
        .select('*', { count: 'exact' })

      // Aplicar filtros
      if (currentFilters) {
        // Filtro de búsqueda
        if (currentFilters.searchTerm) {
          query = query.or(`nombre.ilike.%${currentFilters.searchTerm}%,email.ilike.%${currentFilters.searchTerm}%,contacto.ilike.%${currentFilters.searchTerm}%`)
        }

        // Filtro por calificación mínima
        if (currentFilters.calificacionMinima) {
          query = query.gte('calificacion', currentFilters.calificacionMinima)
        }

        // Filtro por estado activo
        if (currentFilters.activo === 'activo') {
          query = query.eq('activo', true)
        } else if (currentFilters.activo === 'inactivo') {
          query = query.eq('activo', false)
        }

        // Ordenamiento
        const ascending = currentFilters.sortOrder === 'asc'
        query = query.order(currentFilters.sortBy, { ascending })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Aplicar paginación
      query = query.range(from, to)

      const { data, error, count } = await Promise.race([query, timeoutPromise])

      if (error) throw error
      
      setProviders(data || [])
      setTotalCount(count || 0)
      setTotalPages(Math.ceil((count || 0) / limit))
    } catch (error: any) {
      console.error('Error fetching providers:', error)
      if (error.message.includes('Timeout')) {
        console.log('Timeout en consulta de proveedores, reintentando...')
        // Reintentar después de 2 segundos
        setTimeout(() => fetchProviders(page, currentFilters), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders(currentPage, filters)
  }, [currentPage, filters])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proveedor?')) return

    try {
      const { error } = await supabase
        .from('proveedor')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchProviders(currentPage, filters)
    } catch (error) {
      console.error('Error deleting provider:', error)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider)
  }

  const handleEditSuccess = () => {
    fetchProviders(currentPage, filters)
    setEditingProvider(null)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWithTimeout 
            message="Cargando proveedores..."
            timeout={8000}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Proveedores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {providers.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proveedores</h3>
            <p className="text-gray-500">
              Comienza agregando proveedores a tu sistema
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Proveedor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contacto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Teléfono</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Calificación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr key={provider.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{provider.nombre}</div>
                          <div className="text-sm text-gray-500">{provider.ciudad}, {provider.pais}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{provider.contacto || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{provider.email || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{provider.telefono || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-gray-600">{parseFloat(provider.calificacion).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          provider.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {provider.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(provider)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(provider.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              onNext={nextPage}
              onPrev={prevPage}
              hasNextPage={currentPage < totalPages}
              hasPrevPage={currentPage > 1}
            />
          </>
        )}
      </CardContent>
      
      {/* Edit Provider Form */}
      {editingProvider && (
        <EditProviderForm
          provider={editingProvider}
          onClose={() => setEditingProvider(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  )
}