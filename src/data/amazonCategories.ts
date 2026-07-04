import type { AmazonCategory } from '../types'

export const AMAZON_COSTS_LAST_UPDATE = 'Julho/2026'

export const AMAZON_CATEGORIES: AmazonCategory[] = [
  {
    id: 'comidas-bebidas',
    name: 'Comidas e bebidas',
    commission: { type: 'flat', rate: 10, minCommission: 1 },
  },
  {
    id: 'pneus-rodas',
    name: 'Pneus e rodas',
    commission: { type: 'flat', rate: 10, minCommission: 1 },
  },
  {
    id: 'eletrodomesticos',
    name: 'Eletrodomésticos de linha branca',
    commission: { type: 'flat', rate: 11, minCommission: 1 },
  },
  {
    id: 'bebidas-alcoolicas',
    name: 'Bebidas alcoólicas',
    commission: { type: 'flat', rate: 11, minCommission: 1 },
  },
  {
    id: 'tv-audio',
    name: 'TV, áudio e cinema em casa',
    commission: { type: 'flat', rate: 10, minCommission: 1 },
  },
  {
    id: 'celulares',
    name: 'Celulares',
    commission: { type: 'flat', rate: 11, minCommission: 1 },
  },
  {
    id: 'pc',
    name: 'PC',
    commission: { type: 'flat', rate: 12, minCommission: 1 },
  },
  {
    id: 'casa',
    name: 'Casa',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
    notes: 'Em várias subcategorias de casa/cozinha a comissão mínima é R$ 2,00.',
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'jardim-piscina',
    name: 'Jardim e piscina',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'bebes',
    name: 'Produtos para bebês',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'beleza',
    name: 'Beleza',
    commission: { type: 'flat', rate: 13, minCommission: 1 },
  },
  {
    id: 'roupas',
    name: 'Roupas e acessórios',
    commission: { type: 'flat', rate: 14, minCommission: 1 },
  },
  {
    id: 'livros',
    name: 'Livros',
    commission: { type: 'flat', rate: 15, minCommission: 1 },
  },
  {
    id: 'saude',
    name: 'Saúde e cuidados pessoais',
    commission: { type: 'flat', rate: 12, minCommission: 1 },
  },
  {
    id: 'brinquedos',
    name: 'Brinquedos e jogos',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'pets',
    name: 'Produtos para pets',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'eletroportateis-cuidado-pessoal',
    name: 'Eletroportáteis de cuidado pessoal',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'industria',
    name: 'Indústria e ciência',
    commission: { type: 'flat', rate: 12, minCommission: 2 },
  },
  {
    id: 'acessorios-eletronicos',
    name: 'Acessórios eletrônicos',
    commission: {
      type: 'tiered',
      tiers: [{ upTo: 100, rate: 15 }],
      excessRate: 10,
      minCommission: 1,
    },
  },
  {
    id: 'moveis',
    name: 'Móveis',
    commission: {
      type: 'tiered',
      tiers: [{ upTo: 200, rate: 15 }],
      excessRate: 10,
      minCommission: 1,
    },
  },
  {
    id: 'demais',
    name: 'Demais categorias',
    commission: { type: 'flat', rate: 15, minCommission: 1 },
  },
]

export function getCategoryById(id: string): AmazonCategory {
  return AMAZON_CATEGORIES.find((c) => c.id === id) ?? AMAZON_CATEGORIES.at(-1)!
}

export function getCategoryCommissionDescription(category: AmazonCategory): string {
  const { commission } = category
  if (commission.type === 'flat') {
    return `${commission.rate}% (mínimo ${commission.minCommission.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })} por item)`
  }

  const firstTier = commission.tiers[0]
  return `${firstTier.rate}% até R$ ${firstTier.upTo.toFixed(
    2,
  )} e ${commission.excessRate}% no excedente (mínimo ${commission.minCommission.toLocaleString(
    'pt-BR',
    { style: 'currency', currency: 'BRL' },
  )})`
}
