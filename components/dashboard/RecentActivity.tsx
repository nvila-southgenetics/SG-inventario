'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Package, ArrowUp, ArrowDown, AlertTriangle, RefreshCw, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRecentActivity } from '@/lib/hooks/useRecentActivity'
import { memo } from 'react'

const RecentActivity = memo(function RecentActivity() {
  const { activities, loading, error, refetch } = useRecentActivity()

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'salida':
        return <ArrowDown className="w-4 h-4 text-red-500" />
      case 'ajuste':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'transferencia':
        return <Package className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getActivityColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'salida':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'ajuste':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'transferencia':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getActivityText = (tipo: string) => {
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
        return 'Movimiento'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Hace unos minutos'
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error al cargar actividad</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay actividad reciente</p>
            <p className="text-sm text-gray-400 mt-1">Los movimientos aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Actividad Reciente
          </CardTitle>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${getActivityColor(activity.tipo)}`}
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">
                    {activity.producto?.nombre || 'Producto desconocido'}
                  </h4>
                  <span className="text-xs opacity-75">
                    {formatDate(activity.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-75">
                    {getActivityText(activity.tipo)} de {activity.cantidad} unidades
                  </p>
                  <span className="text-xs font-medium">
                    {activity.producto?.codigo || 'N/A'}
                  </span>
                </div>
                {activity.usuario?.email && (
                  <p className="text-xs opacity-60 mt-1">
                    Por: {activity.usuario.email.split('@')[0]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

export default RecentActivity