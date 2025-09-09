'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ArrowUpDown, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

interface Movement {
  id: number
  producto_id: number
  tipo: string
  cantidad: number
  motivo: string
  observaciones: string
  created_at: string
}

export default function MovementTable() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      const { data, error } = await supabase
        .from('movimiento')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovements(data || [])
    } catch (error) {
      console.error('Error fetching movements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este movimiento?')) return

    try {
      const { error } = await supabase
        .from('movimiento')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchMovements()
    } catch (error) {
      console.error('Error deleting movement:', error)
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
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando movimientos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowUpDown className="w-5 h-5 mr-2" />
          Movimientos ({movements.length})
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
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Producto ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cantidad</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Motivo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Observaciones</th>
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
                    <td className="py-3 px-4 text-gray-600">#{movement.producto_id}</td>
                    <td className="py-3 px-4 text-gray-600">{movement.cantidad}</td>
                    <td className="py-3 px-4 text-gray-600">{movement.motivo || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{movement.observaciones || '-'}</td>
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
          </div>
        )}
      </CardContent>
    </Card>
  )
}