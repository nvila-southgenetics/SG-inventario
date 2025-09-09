# SouthGenetics - Sistema de Gestión de Inventario

Sistema web moderno para la gestión de inventarios desarrollado con Next.js 14 y Supabase.

## 🚀 Características

- **Dashboard completo** con métricas en tiempo real
- **Gestión de productos** con códigos únicos y ubicaciones
- **Control de proveedores** con calificaciones
- **Seguimiento de movimientos** de inventario
- **Sistema de alertas** para stock bajo
- **Reportes y análisis** detallados
- **Interfaz responsive** y moderna
- **Autenticación** con Supabase Auth

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **UI Components**: Componentes personalizados

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd gestion-inventario
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Configurar Supabase**
   - Crear un proyecto en [Supabase](https://supabase.com)
   - Ejecutar las migraciones SQL para crear las tablas
   - Configurar las políticas RLS

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🗄️ Estructura de la Base de Datos

### Tablas principales:
- **producto**: Información de productos
- **proveedor**: Datos de proveedores
- **categoria**: Categorías de productos
- **movimiento**: Movimientos de inventario
- **alerta**: Alertas del sistema
- **usuario**: Usuarios del sistema

## 🔐 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de acceso** configuradas para usuarios autenticados
- **Validación** de datos en frontend y backend

## 📱 Páginas

- **Dashboard** (`/`): Vista general del sistema
- **Productos** (`/productos`): Gestión de inventario
- **Categorías** (`/categorias`): Organización de productos
- **Movimientos** (`/movimientos`): Registro de entradas/salidas
- **Proveedores** (`/proveedores`): Gestión de proveedores
- **Reportes** (`/reportes`): Análisis y estadísticas
- **Alertas** (`/alertas`): Notificaciones del sistema
- **Mi Perfil** (`/perfil`): Información del usuario
- **Configuración** (`/configuracion`): Ajustes del sistema

## 🎨 Diseño

- **Colores principales**: Mostaza (#F59E0B) y Violeta (#8B5CF6)
- **Interfaz minimalista** y profesional
- **Responsive design** para todos los dispositivos
- **Componentes reutilizables** y consistentes

## 🚀 Despliegue

1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Iniciar servidor**
   ```bash
   npm start
   ```

## 📝 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | `eyJhbGciOiJIUzI1NiIs...` |

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado para **SouthGenetics** - Sistema de gestión de inventario de última generación.
