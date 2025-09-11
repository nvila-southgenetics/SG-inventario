'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import LoadingWithTimeout from '@/components/ui/LoadingWithTimeout'
import { supabase } from '@/lib/supabase'
import { MovementFilters } from './MovementFilters'

interface Movement {
  id: number
  producto_id: number
  tipo: string
  cantidad: number
  motivo: string
  observaciones: string
  created_at: string
  producto?: {
    nombre: string
    codigo: string
  }
  usuario?: {
    email: string
  }
}

interface MovementTableProps {
  filters?: MovementFilters
}

export default function MovementTable({ filters }: MovementTableProps) {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 10

  const fetchMovements = async (page: number, currentFilters?: MovementFilters) => {
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
        .from('movimiento')
        .select(`
          *,
          producto:producto_id(nombre, codigo),
          usuario:usuario_id(email)
        `, { count: 'exact' })

      // Aplicar filtros
      if (currentFilters) {
        // Filtro de búsqueda
        if (currentFilters.searchTerm) {
          query = query.or(`motivo.ilike.%${currentFilters.searchTerm}%,observaciones.ilike.%${currentFilters.searchTerm}%`)
        }

        // Filtro por tipo
        if (currentFilters.tipo !== 'all') {
          query = query.eq('tipo', currentFilters.tipo)
        }

        // Filtro por fecha desde
        if (currentFilters.fechaDesde) {
          query = query.gte('created_at', currentFilters.fechaDesde)
        }

        // Filtro por fecha hasta
        if (currentFilters.fechaHasta) {
          query = query.lte('created_at', currentFilters.fechaHasta + 'T23:59:59.999Z')
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
      
      setMovements(data || [])
      setTotalCount(count || 0)
      setTotalPages(Math.ceil((count || 0) / limit))
    } catch (error: any) {
      console.error('Error fetching movements:', error)
      if (error.message.includes('Timeout')) {
        console.log('Timeout en consulta de movimientos, reintentando...')
        // Reintentar después de 2 segundos
        setTimeout(() => fetchMovements(page, currentFilters), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovements(currentPage, filters)
  }, [currentPage, filters])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este movimiento?')) return

    try {
      const { error } = await supabase
        .from('movimiento')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchMovements(currentPage, filters)
    } catch (error) {
      console.error('Error deleting movement:', error)
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

  const getMovementIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'salida':
        return <ArrowDown className="w-4 h-4 text-red-500" />
      default:
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />
    }
  }

  const getMovementColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'bg-green-100 text-green-800'
      case 'salida':
        return 'bg-red-100 text-red-800'
      case 'ajuste':
        return 'bg-blue-100 text-blue-800'
      case 'transferencia':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMovementText = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'Entrada'
      case 'salida':
        return 'Salida'
      case 'ajuste':
        return 'Ajuste'
      case 'transferencia':
        return 'Transferencia'
      default:
        return tipo
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowUpDown className="w-5 h-5 mr-2" />
            Movimientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWithTimeout 
            message="Cargando movimientos..."
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
          <ArrowUpDown className="w-5 h-5 mr-2" />
          Movimientos ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <div className="text-center py-12">
            <ArrowUpDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay movimientos</h3>
            <p className="text-gray-500">
              Los movimientos de inventario aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cantidad</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Motivo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {getMovementIcon(movement.tipo)}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getMovementColor(movement.tipo)}`}>
                          {getMovementText(movement.tipo)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {movement.producto?.nombre || `Producto #${movement.producto_id}`}
                      {movement.producto?.codigo && (
                        <div className="text-sm text-gray-500">{movement.producto.codigo}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{movement.cantidad}</td>
                    <td className="py-3 px-4 text-gray-600">{movement.motivo || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{movement.usuario?.email || 'Usuario'}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(movement.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(movement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              onNext={nextPage}
              onPrev={prevPage}
              hasNextPage={currentPage < totalPages}
              hasPrevPage={currentPage > 1}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}