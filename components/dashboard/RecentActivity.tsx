import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Package, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react'

const activities: any[] = []

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay actividad reciente</p>
          <p className="text-sm text-gray-400 mt-1">Los movimientos aparecerán aquí</p>
        </div>
      </CardContent>
    </Card>
  )
}
