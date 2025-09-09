import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertTriangle, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const lowStockItems: any[] = []

export default function LowStockAlerts() {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'Crítico'
      case 'medium':
        return 'Bajo'
      default:
        return 'Normal'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            Stock Bajo
          </CardTitle>
          <Button variant="outline" size="sm">
            Ver todos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay alertas de stock</p>
          <p className="text-sm text-gray-400 mt-1">Las alertas aparecerán aquí cuando sea necesario</p>
        </div>
      </CardContent>
    </Card>
  )
}
