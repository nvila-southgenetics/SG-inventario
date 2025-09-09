'use client'

import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  Database,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Package,
  AlertTriangle
} from 'lucide-react'

export default function ConfiguracionPage() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">
            Configuración general del sistema de inventario
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Empresa
                </label>
                <Input defaultValue="SouthGenetics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUC / NIT
                </label>
                <Input defaultValue="12345678901" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <Input defaultValue="Av. Científica 123, Ciudad" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input defaultValue="info@southgenetics.com" />
                </div>
              </div>
              <Button className="w-full bg-mostaza-500 hover:bg-mostaza-600">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          {/* Configuración de Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Configuración de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Mínimo por Defecto
                </label>
                <Input type="number" defaultValue="20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Días de Anticipación para Vencimiento
                </label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notificaciones por Email
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Stock bajo</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Productos por vencer</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Movimientos anómalos</span>
                  </label>
                </div>
              </div>
              <Button className="w-full bg-violeta-500 hover:bg-violeta-600">
                <Save className="w-4 h-4 mr-2" />
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>

          {/* Configuración de Inventario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Configuración de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prefijo de Código de Producto
                </label>
                <Input defaultValue="SG-" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Dígitos del Código
                </label>
                <Input type="number" defaultValue="3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Medida por Defecto
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mostaza-500">
                  <option>Unidades</option>
                  <option>Gramos</option>
                  <option>Litros</option>
                  <option>Metros</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categorías de Producto
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input defaultValue="Reactivos" />
                    <Button variant="outline" size="sm">-</Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input defaultValue="Consumibles" />
                    <Button variant="outline" size="sm">-</Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input defaultValue="Instrumentos" />
                    <Button variant="outline" size="sm">-</Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    + Agregar Categoría
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Usuario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Configuración de Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <Input defaultValue="Administrador" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input defaultValue="admin@southgenetics.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Actual
                </label>
                <Input type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <Input type="password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <Input type="password" />
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                Actualizar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Configuración de Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Configuraciones de Seguridad
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Requerir autenticación de dos factores</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Sesión automática después de 30 minutos</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Registrar todas las acciones</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de Sesión (minutos)
                </label>
                <Input type="number" defaultValue="30" />
              </div>
              <Button className="w-full bg-red-500 hover:bg-red-600">
                <Shield className="w-4 h-4 mr-2" />
                Actualizar Seguridad
              </Button>
            </CardContent>
          </Card>

          {/* Configuración de Base de Datos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Base de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Operaciones de Base de Datos
                </label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Crear Respaldo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Restaurar desde Respaldo
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Optimizar Base de Datos
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-yellow-700">
                    Último respaldo: 15 de enero, 2024
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
