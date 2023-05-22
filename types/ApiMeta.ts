export interface Pagination {
  current: number
  previous: number | null
  next: number | null
  pages: number
  count: number
}
