'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { memo } from 'react'

interface MovementData {
  producto: string
  cantidad: number
  fecha: string
}

interface MonthlyMovementsChartProps {
  entradas: MovementData[]
  salidas: MovementData[]
  loading?: boolean
}

const MonthlyMovementsChart = memo(function MonthlyMovementsChart({
  entradas,
  salidas,
  loading = false
}: MonthlyMovementsChartProps) {
  // Agrupar por producto
  const entradasPorProducto = entradas.reduce((acc, mov) => {
    const producto = mov.producto
    if (!acc[producto]) {
      acc[producto] = 0
    }
    acc[producto] += mov.cantidad
    return acc
  }, {} as Record<string, number>)

  const salidasPorProducto = salidas.reduce((acc, mov) => {
    const producto = mov.producto
    if (!acc[producto]) {
      acc[producto] = 0
    }
    acc[producto] += mov.cantidad
    return acc
  }, {} as Record<string, number>)

  // Obtener todos los productos únicos
  const todosProductos = new Set([
    ...Object.keys(entradasPorProducto),
    ...Object.keys(salidasPorProducto)
  ])

  // Ordenar por cantidad total (entradas + salidas)
  const productosOrdenados = Array.from(todosProductos).sort((a, b) => {
    const totalA = (entradasPorProducto[a] || 0) + (salidasPorProducto[a] || 0)
    const totalB = (entradasPorProducto[b] || 0) + (salidasPorProducto[b] || 0)
    return totalB - totalA
  }).slice(0, 10) // Mostrar solo los 10 productos con más movimiento

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Movimientos Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (productosOrdenados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Movimientos Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay movimientos en los últimos 30 días</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Movimientos Mensuales (Últimos 30 días)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productosOrdenados.map((producto) => {
            const entradasCantidad = entradasPorProducto[producto] || 0
            const salidasCantidad = salidasPorProducto[producto] || 0
            const totalMovimientos = entradasCantidad + salidasCantidad

            return (
              <div key={producto} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {producto}
                  </span>
                  <span className="text-sm text-gray-500">
                    Total: {totalMovimientos}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {/* Barra de entradas */}
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Entradas: {entradasCantidad}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${totalMovimientos > 0 ? (entradasCantidad / totalMovimientos) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Barra de salidas */}
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      <span className="text-xs text-red-600">Salidas: {salidasCantidad}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${totalMovimientos > 0 ? (salidasCantidad / totalMovimientos) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
})

export default MonthlyMovementsChart
