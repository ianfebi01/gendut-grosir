import dayjs from 'dayjs'
import 'dayjs/locale/id'

/** One calendar day of sales; days without orders are filled with zeros. */
export interface DailyPoint {
  date: Date
  qty: number
  turnover: number
  buyPrice: number
  profit: number
}

// Categorical slots 1-2 of the dataviz reference palette (validated
// light-mode, CVD-safe as an adjacent pair).
export const SERIES = {
  turnover: { label: 'Omset', color: '#2a78d6' },
  profit: { label: 'Keuntungan', color: '#eb6834' },
  qty: { label: 'Produk terjual', color: '#2a78d6' },
} as const

const compact = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const full = new Intl.NumberFormat('id-ID')

/** Axis ticks and tiles: Rp 1,2 jt */
export const rupiahCompact = (value: number) =>
  value === 0 ? 'Rp 0' : `Rp ${compact.format(value)}`
/** Tooltips and tables: Rp 1.250.000 */
export const rupiahFull = (value: number) =>
  `Rp ${full.format(Math.round(value))}`
export const numberFull = (value: number) => full.format(value)

/** Dates in Indonesian: formatDay(d, 'dddd, D MMM YYYY') -> Sabtu, 26 Sep 2026 */
export const formatDay = (date: Date | dayjs.Dayjs, template: string) =>
  dayjs(date).locale('id').format(template)
