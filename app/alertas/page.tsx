'use client'

import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  XCircle,
  Clock,
  Package,
  TrendingDown,
  AlertCircle
} from 'lucide-react'

const alerts: any[] = []

export default function AlertasPage() {
  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return 'border-red-200 bg-red-50'
      case 'alta':
        return 'border-orange-200 bg-orange-50'
      case 'media':
        return 'border-yellow-200 bg-yellow-50'
      case 'baja':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getSeverityIcon = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'alta':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'media':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'baja':
        return <Bell className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-red-100 text-red-800'
      case 'revisada':
        return 'bg-yellow-100 text-yellow-800'
      case 'resuelta':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'Activa'
      case 'revisada':
        return 'Revisada'
      case 'resuelta':
        return 'Resuelta'
      default:
        return 'Desconocido'
    }
  }

  const activeAlerts = alerts.filter(alert => alert.estado === 'activa')
  const criticalAlerts = alerts.filter(alert => alert.severidad === 'critica')

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alertas</h1>
            <p className="text-gray-600 mt-2">
              Sistema de alertas y notificaciones del inventario
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar todas como leídas
            </Button>
            <Button className="bg-mostaza-500 hover:bg-mostaza-600">
              <Bell className="w-4 h-4 mr-2" />
              Configurar alertas
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alertas Críticas</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resueltas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay alertas</h3>
          <p className="text-gray-500 mb-6">El sistema de alertas está funcionando correctamente</p>
          <Button className="bg-mostaza-500 hover:bg-mostaza-600">
            <Bell className="w-4 h-4 mr-2" />
            Configurar Alertas
          </Button>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <TrendingDown className="w-6 h-6 text-red-500" />
                <span>Revisar Stock Bajo</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Package className="w-6 h-6 text-yellow-500" />
                <span>Productos por Vencer</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Bell className="w-6 h-6 text-blue-500" />
                <span>Configurar Alertas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
