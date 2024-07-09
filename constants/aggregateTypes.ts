import type { AggregateType } from '~/types/problems'

export default [
  {
    value: 'all',
    text: '通常'
  },
  {
    value: 'sum',
    text: '合計 (Sum)'
  },
  {
    value: 'max',
    text: '最大 (Max)'
  },
  {
    value: 'min',
    text: '最小 (Min)'
  }
] satisfies {
  value: AggregateType
  text: string
}[]
