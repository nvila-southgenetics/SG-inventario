'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Package, AlertTriangle, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import LoadingWithTimeout from '@/components/ui/LoadingWithTimeout'
import { supabase } from '@/lib/supabase'
import { ProductFilters } from './ProductFilters'
import EditProductForm from './EditProductForm'

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
  created_at: string
  categoria?: {
    nombre: string
  }
  proveedor?: {
    nombre: string
  }
}

interface ProductTableProps {
  filters?: ProductFilters
}

export default function ProductTable({ filters }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const limit = 10

  const fetchProducts = async (page: number, currentFilters?: ProductFilters) => {
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
        .from('producto')
        .select(`
          *,
          categoria:categoria_id(nombre),
          proveedor:proveedor_id(nombre)
        `, { count: 'exact' })
        .eq('activo', true)

      // Aplicar filtros
      if (currentFilters) {
        // Filtro de búsqueda
        if (currentFilters.searchTerm) {
          query = query.or(`nombre.ilike.%${currentFilters.searchTerm}%,codigo.ilike.%${currentFilters.searchTerm}%,descripcion.ilike.%${currentFilters.searchTerm}%`)
        }

        // Filtro por fecha
        if (currentFilters.dateFrom) {
          query = query.gte('created_at', currentFilters.dateFrom)
        }
        if (currentFilters.dateTo) {
          query = query.lte('created_at', currentFilters.dateTo + 'T23:59:59.999Z')
        }

        // Filtro por stock
        if (currentFilters.stockFilter === 'low') {
          query = query.lt('stock_actual', 10)
        } else if (currentFilters.stockFilter === 'normal') {
          query = query.gte('stock_actual', 10).lte('stock_actual', 50)
        } else if (currentFilters.stockFilter === 'high') {
          query = query.gt('stock_actual', 50)
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
      
      setProducts(data || [])
      setTotalCount(count || 0)
      setTotalPages(Math.ceil((count || 0) / limit))
    } catch (error: any) {
      console.error('Error fetching products:', error)
      if (error.message.includes('Timeout')) {
        console.log('Timeout en consulta de productos, reintentando...')
        // Reintentar después de 2 segundos
        setTimeout(() => fetchProducts(page, currentFilters), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, filters)
  }, [currentPage, filters])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    try {
      const { error } = await supabase
        .from('producto')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchProducts(currentPage, filters)
    } catch (error) {
      console.error('Error deleting product:', error)
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleEditSuccess = () => {
    fetchProducts(currentPage, filters)
    setEditingProduct(null)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingWithTimeout 
            message="Cargando productos..."
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
          <Package className="w-5 h-5 mr-2" />
          Productos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {products.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-500">
              Comienza agregando productos a tu inventario
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Producto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Proveedor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Precio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Ubicación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{product.nombre}</div>
                          <div className="text-sm text-gray-500">{product.descripcion}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.codigo}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {product.categoria?.nombre || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {product.proveedor?.nombre || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-600">{product.stock_actual}</span>
                          {product.stock_actual <= product.stock_minimo && (
                            <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">${product.precio_venta.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-600">{product.ubicacion || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(product.id)}
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
      
      {/* Edit Product Form */}
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  )
}