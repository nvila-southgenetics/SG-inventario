'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { X, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: number
  nombre: string
  descripcion: string
  codigo: string
  precio: number
  precio_venta: number
  stock_actual: number
  stock_minimo: number
  ubicacion: string
  categoria_id: number | null
  proveedor_id: number | null
  activo: boolean
}

interface Category {
  id: number
  nombre: string
}

interface Provider {
  id: number
  nombre: string
}

interface EditProductFormProps {
  product: Product
  onClose: () => void
  onSuccess: () => void
}

export default function EditProductForm({ product, onClose, onSuccess }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: product.nombre,
    descripcion: product.descripcion,
    codigo: product.codigo,
    precio: product.precio,
    precio_venta: product.precio_venta,
    stock_actual: product.stock_actual,
    stock_minimo: product.stock_minimo,
    ubicacion: product.ubicacion,
    categoria_id: product.categoria_id || '',
    proveedor_id: product.proveedor_id || '',
    activo: product.activo
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesResult, providersResult] = await Promise.all([
        supabase.from('categoria').select('id, nombre').eq('activo', true).order('nombre'),
        supabase.from('proveedor').select('id, nombre').eq('activo', true).order('nombre')
      ])

      if (categoriesResult.error) throw categoriesResult.error
      if (providersResult.error) throw providersResult.error

      setCategories(categoriesResult.data || [])
      setProviders(providersResult.data || [])
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError('Error al cargar categorías y proveedores')
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('producto')
        .update({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          codigo: formData.codigo,
          precio: parseFloat(formData.precio.toString()),
          precio_venta: parseFloat(formData.precio_venta.toString()),
          stock_actual: parseInt(formData.stock_actual.toString()),
          stock_minimo: parseInt(formData.stock_minimo.toString()),
          ubicacion: formData.ubicacion,
          categoria_id: formData.categoria_id ? parseInt(formData.categoria_id.toString()) : null,
          proveedor_id: formData.proveedor_id ? parseInt(formData.proveedor_id.toString()) : null,
          activo: formData.activo
        })
        .eq('id', product.id)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error updating product:', err)
      setError(err.message || 'Error al actualizar el producto')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Editar Producto</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código *
                </label>
                <Input
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  placeholder="Código único"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <Input
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio de Compra
                </label>
                <Input
                  name="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio de Venta *
                </label>
                <Input
                  name="precio_venta"
                  type="number"
                  step="0.01"
                  value={formData.precio_venta}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Actual *
                </label>
                <Input
                  name="stock_actual"
                  type="number"
                  value={formData.stock_actual}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo *
                </label>
                <Input
                  name="stock_minimo"
                  type="number"
                  value={formData.stock_minimo}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <Input
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Ubicación en almacén"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <select
                  name="proveedor_id"
                  value={formData.proveedor_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500 focus:border-transparent"
                >
                  <option value="">Seleccionar proveedor</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-mostaza-600 focus:ring-mostaza-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Producto activo
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-mostaza hover:bg-mostaza/90">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
