'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { ArrowUpDown, Save, X } from 'lucide-react'

interface AddMovementFormProps {
  onClose: () => void
  onSuccess: () => void
}

interface Product {
  id: number
  nombre: string
  codigo: string
  stock_actual: number
}

export default function AddMovementForm({ onClose, onSuccess }: AddMovementFormProps) {
  const [formData, setFormData] = useState({
    producto_id: '',
    tipo: 'entrada',
    cantidad: '',
    motivo: '',
    notas: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('producto')
          .select('id, nombre, codigo, stock_actual')
          .order('nombre')

        if (error) throw error

        setProducts(data || [])
      } catch (error) {
        console.error('Error loading products:', error)
        setError('Error al cargar productos')
      } finally {
        setLoadingData(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const cantidad = parseInt(formData.cantidad)
      const productoId = parseInt(formData.producto_id)

      // Crear el movimiento
      const { error: movimientoError } = await supabase
        .from('movimiento')
        .insert([{
          producto_id: productoId,
          tipo: formData.tipo,
          cantidad: cantidad,
          motivo: formData.motivo,
          observaciones: formData.notas
        }])

      if (movimientoError) throw movimientoError

      // Actualizar el stock del producto
      const { data: productoActual, error: productoError } = await supabase
        .from('producto')
        .select('stock_actual')
        .eq('id', productoId)
        .single()

      if (productoError) throw productoError

      let nuevoStock = productoActual.stock_actual

      // Calcular nuevo stock según el tipo de movimiento
      switch (formData.tipo) {
        case 'entrada':
          nuevoStock += cantidad
          break
        case 'salida':
          nuevoStock -= cantidad
          // Validar que no quede stock negativo
          if (nuevoStock < 0) {
            throw new Error(`No hay suficiente stock. Stock actual: ${productoActual.stock_actual}, intentando sacar: ${cantidad}`)
          }
          break
        case 'ajuste':
          nuevoStock = cantidad // El ajuste establece el stock exacto
          break
        case 'transferencia':
          // Para transferencias, asumimos que es una salida
          nuevoStock -= cantidad
          // Validar que no quede stock negativo
          if (nuevoStock < 0) {
            throw new Error(`No hay suficiente stock para transferir. Stock actual: ${productoActual.stock_actual}, intentando transferir: ${cantidad}`)
          }
          break
        default:
          throw new Error('Tipo de movimiento no válido')
      }

      // Actualizar el stock en la base de datos
      const { error: updateError } = await supabase
        .from('producto')
        .update({ stock_actual: nuevoStock })
        .eq('id', productoId)

      if (updateError) throw updateError

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })

    // Si se selecciona un producto, actualizar el estado del producto seleccionado
    if (name === 'producto_id') {
      const product = products.find(p => p.id === parseInt(value))
      setSelectedProduct(product || null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ArrowUpDown className="w-5 h-5 mr-2" />
            Agregar Movimiento
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loadingData && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                Cargando productos...
              </div>
            )}

            {selectedProduct && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                <strong>Producto seleccionado:</strong> {selectedProduct.nombre} ({selectedProduct.codigo})
                <br />
                <strong>Stock actual:</strong> {selectedProduct.stock_actual} unidades
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producto *
                </label>
                <select
                  name="producto_id"
                  value={formData.producto_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                  required
                  disabled={loadingData}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nombre} ({product.codigo}) - Stock: {product.stock_actual}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Movimiento *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                  <option value="ajuste">Ajuste</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad *
                </label>
                <Input
                  name="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo
                </label>
                <Input
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  placeholder="Motivo del movimiento"
                />
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notas adicionales sobre el movimiento"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar Movimiento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
