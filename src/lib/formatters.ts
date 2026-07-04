const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const PCT = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number): string {
  return BRL.format(value)
}

export function formatPercent(value: number): string {
  return PCT.format(value / 100)
}

export function parseNumber(value: string): number {
  const parsed = parseFloat(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}
