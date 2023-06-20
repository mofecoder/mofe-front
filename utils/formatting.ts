import dayjs from 'dayjs'

export function formatDate(date: Date, second = true): string {
  const dt = dayjs(date)
  const timeFormat = second ? 'HH:mm:ss' : 'HH:mm'
  return dt.year() === dayjs().year()
    ? dt.format(`MM/DD ${timeFormat}`)
    : dt.format(`YYYY/MM/DD ${timeFormat}`)
}
