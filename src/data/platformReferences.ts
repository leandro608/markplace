export interface PlatformReferenceSource {
  label: string
  url: string
  description: string
  official: boolean
}

export const PLATFORM_COSTS_REFERENCE = {
  versionLabel: 'Julho/2026',
  lastReviewedAt: '2026-07-04',
  reviewOwner: 'Time de precificação',
  updateCadence: 'Revisão mensal ou sempre que a Amazon alterar as tarifas',
}

export const PLATFORM_REFERENCE_SOURCES: PlatformReferenceSource[] = [
  {
    label: 'Amazon — Preços e comissões',
    url: 'https://venda.amazon.com.br/precos',
    description:
      'Página oficial com planos de venda, comissões por categoria e observações de comissão mínima.',
    official: true,
  },
  {
    label: 'Amazon — Blog de tarifas',
    url: 'https://venda.amazon.com.br/sellerblog/investimentos-e-tarifas--quanto-custa-vender-na-amazon',
    description:
      'Conteúdo oficial complementar com explicação de planos, descontos aplicados e composição dos custos.',
    official: true,
  },
  {
    label: 'Amazon — Página inicial para vendedores',
    url: 'https://venda.amazon.com.br/home',
    description:
      'Informações públicas sobre campanha de adesão (ex.: 1º ano grátis do plano profissional).',
    official: true,
  },
]

export const PLATFORM_REVIEW_CHECKLIST: string[] = [
  'Validar se os valores de plano continuam: Individual (R$ 2,00/item) e Profissional (R$ 19,00/mês).',
  'Conferir comissões por categoria, inclusive regras progressivas (faixas de preço).',
  'Conferir comissão mínima por categoria (R$ 1,00 ou R$ 2,00) e atualizar o dataset.',
  'Revalidar regras de promoções temporárias (ex.: 1º ano grátis) e seu impacto na conta.',
  'Atualizar a data de revisão e registrar as fontes oficiais consultadas.',
]
