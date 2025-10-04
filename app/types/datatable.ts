type SelectItemKey
  = | boolean
    | string
    | (string | number)[]
    | ((item: Record<string, unknown>, fallback?: unknown) => unknown)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataTableCompareFunction<T = any> = (a: T, b: T) => number
export type DataTableHeader = {
  key: string
  value?: SelectItemKey
  title: string
  colspan?: number
  rowspan?: number
  fixed?: boolean
  align?: 'start' | 'end' | 'center'
  width?: number | string
  minWidth?: string
  maxWidth?: string
  sortable?: boolean
  sort?: DataTableCompareFunction
}

export type SortItem = {
  key: string
  order?: boolean | 'asc' | 'desc'
}
