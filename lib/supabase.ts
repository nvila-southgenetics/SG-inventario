import { createClient, User, Session, AuthError } from '@supabase/supabase-js'

// Re-exportar tipos de Supabase para uso en otros archivos
export type { User, Session, AuthError }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos TypeScript para la base de datos
export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  color: string
  activa: boolean
  created_at: string
  updated_at: string
}

export interface Proveedor {
  id: number
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  calificacion: number
  activo: boolean
  ultima_compra?: string
  created_at: string
  updated_at: string
}

export interface Producto {
  id: number
  codigo: string
  nombre: string
  descripcion?: string
  categoria_id?: number
  proveedor_id?: number
  stock_actual: number
  stock_minimo: number
  precio: number
  costo?: number
  unidad_medida: string
  ubicacion?: string
  fecha_vencimiento?: string
  activo: boolean
  created_at: string
  updated_at: string
  categoria?: Categoria
  proveedor?: Proveedor
}

export interface Movimiento {
  id: number
  producto_id: number
  tipo: 'entrada' | 'salida' | 'ajuste' | 'transferencia'
  cantidad: number
  motivo?: string
  referencia?: string
  notas?: string
  usuario?: string
  proveedor_id?: number
  numero_factura?: string
  observaciones?: string
  created_at: string
  producto?: Producto
  proveedor?: Proveedor
}

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: 'admin' | 'gestor' | 'usuario'
  activo: boolean
  ultimo_acceso?: string
  created_at: string
  updated_at: string
}

export interface Alerta {
  id: number
  producto_id: number
  tipo: 'stock_bajo' | 'vencimiento' | 'movimiento_anomalo' | 'proveedor'
  severidad: 'critica' | 'alta' | 'media' | 'baja'
  titulo: string
  descripcion?: string
  estado: 'activa' | 'revisada' | 'resuelta'
  accion_recomendada?: string
  created_at: string
  resolved_at?: string
  producto?: Producto
}
