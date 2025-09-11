import { memo, useMemo } from 'react'

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

interface OptimizedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  className?: string
}

function OptimizedTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = ''
}: OptimizedTableProps<T>) {
  const memoizedData = useMemo(() => data, [data])
  const memoizedColumns = useMemo(() => columns, [columns])

  if (loading) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {memoizedColumns.map((column, index) => (
                <th key={index} className="text-left py-3 px-4 font-medium text-gray-700">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-gray-100">
                {memoizedColumns.map((_, colIndex) => (
                  <td key={colIndex} className="py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (memoizedData.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {memoizedColumns.map((column, index) => (
              <th key={index} className="text-left py-3 px-4 font-medium text-gray-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memoizedData.map((item, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              {memoizedColumns.map((column, colIndex) => (
                <td key={colIndex} className={`py-3 px-4 ${column.className || ''}`}>
                  {column.render 
                    ? column.render(item[column.key], item)
                    : item[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default memo(OptimizedTable) as <T extends Record<string, any>>(
  props: OptimizedTableProps<T>
) => JSX.Element
