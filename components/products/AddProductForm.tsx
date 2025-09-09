'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { Package, Save, X } from 'lucide-react'

interface AddProductFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddProductForm({ onClose, onSuccess }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    precio: '',
    stock_minimo: '',
    stock_actual: '',
    categoria_id: '',
    proveedor_id: '',
    ubicacion: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('producto')
        .insert([{
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          codigo: formData.codigo,
          precio: parseFloat(formData.precio),
          stock_minimo: parseInt(formData.stock_minimo),
          stock_actual: parseInt(formData.stock_actual),
          categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null,
          proveedor_id: formData.proveedor_id ? parseInt(formData.proveedor_id) : null,
          ubicacion: formData.ubicacion
        }])

      if (error) throw error

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Agregar Producto
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Nombre del producto"
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
                  required
                  placeholder="Código del producto"
                />
              </div>
            </div>

            <div>
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
                Precio *
              </label>
              <Input
                name="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Actual *
                </label>
                <Input
                  name="stock_actual"
                  type="number"
                  value={formData.stock_actual}
                  onChange={handleChange}
                  required
                  placeholder="0"
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
                  required
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría ID
                </label>
                <Input
                  name="categoria_id"
                  type="number"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  placeholder="ID de categoría"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor ID
                </label>
                <Input
                  name="proveedor_id"
                  type="number"
                  value={formData.proveedor_id}
                  onChange={handleChange}
                  placeholder="ID de proveedor"
                />
              </div>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
