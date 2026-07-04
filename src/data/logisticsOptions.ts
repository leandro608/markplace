import type { LogisticsType } from '../types'

export interface LogisticsOption {
  id: LogisticsType
  name: string
  description: string
  defaultCost: number
}

export const LOGISTICS_OPTIONS: LogisticsOption[] = [
  {
    id: 'fba',
    name: 'FBA — Logística da Amazon',
    description: 'Amazon armazena, embala e envia. Informe o custo estimado por unidade.',
    defaultCost: 12,
  },
  {
    id: 'dba',
    name: 'DBA — Delivery by Amazon',
    description: 'Você envia ao centro de distribuição; Amazon faz a entrega final.',
    defaultCost: 8,
  },
  {
    id: 'fbm',
    name: 'FBM — Envio pelo vendedor',
    description: 'Você cuida de todo o envio ao cliente final.',
    defaultCost: 15,
  },
  {
    id: 'custom',
    name: 'Personalizado',
    description: 'Informe manualmente o custo logístico por unidade.',
    defaultCost: 0,
  },
]

export const SELLER_PLANS = [
  {
    id: 'individual' as const,
    name: 'Plano Individual',
    description: 'R$ 2,00 por item vendido (sem mensalidade)',
    perItemFee: 2,
    monthlyFee: 0,
  },
  {
    id: 'professional' as const,
    name: 'Plano Profissional',
    description: 'Mensalidade de R$ 19,00 (rateada por unidade vendida)',
    perItemFee: 0,
    monthlyFee: 19,
  },
]
