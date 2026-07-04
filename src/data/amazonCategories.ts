import type { AmazonCategory } from '../types'

export const AMAZON_CATEGORIES: AmazonCategory[] = [
  {
    id: 'comidas-bebidas',
    name: 'Comidas e bebidas',
    commission: { type: 'flat', rate: 10, minCommission: 1 },
  },
  {
    id: 'eletrodomesticos',
    name: 'Eletrodomésticos de linha branca',
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
    commission: { type: 'flat', rate: 12, minCommission: 1 },
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
    commission: { type: 'flat', rate: 12, minCommission: 1 },
  },
  {
    id: 'pets',
    name: 'Produtos para pets',
    commission: { type: 'flat', rate: 12, minCommission: 1 },
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
