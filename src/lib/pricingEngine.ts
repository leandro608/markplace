import { getCategoryById } from '../data/amazonCategories'
import { SELLER_PLANS } from '../data/logisticsOptions'
import type {
  CommissionRule,
  CostLine,
  MarginType,
  PricingInputs,
  PricingResult,
} from '../types'

function calculateCommission(price: number, rule: CommissionRule): number {
  if (rule.type === 'flat') {
    return Math.max(price * (rule.rate / 100), rule.minCommission)
  }

  let commission = 0
  let remaining = price
  let previousLimit = 0

  for (const tier of rule.tiers) {
    const tierAmount = Math.min(remaining, tier.upTo - previousLimit)
    if (tierAmount <= 0) break
    commission += tierAmount * (tier.rate / 100)
    remaining -= tierAmount
    previousLimit = tier.upTo
  }

  if (remaining > 0) {
    commission += remaining * (rule.excessRate / 100)
  }

  return Math.max(commission, rule.minCommission)
}

function getCommissionRule(inputs: PricingInputs): CommissionRule {
  if (inputs.useCustomCommission) {
    return { type: 'flat', rate: inputs.customCommissionRate, minCommission: 1 }
  }
  return getCategoryById(inputs.categoryId).commission
}

function getPlanCostPerUnit(inputs: PricingInputs): number {
  const plan = SELLER_PLANS.find((p) => p.id === inputs.sellerPlan)!
  if (inputs.sellerPlan === 'individual') {
    return plan.perItemFee
  }
  const isPromotionalPeriod =
    inputs.professionalFirstYearFree && inputs.monthsSinceRegistration <= 12
  if (isPromotionalPeriod) {
    return 0
  }
  const units = Math.max(inputs.monthlyUnits, 1)
  const monthlyFee = Math.max(inputs.monthlyPlanFee, 0)
  return monthlyFee / units
}

function getFixedCosts(inputs: PricingInputs): number {
  return (
    inputs.productCost +
    inputs.logisticsCost +
    inputs.fixedCostPerUnit +
    inputs.packagingCost +
    inputs.otherFixedCosts +
    getPlanCostPerUnit(inputs)
  )
}

function getVariableRateSum(inputs: PricingInputs): number {
  return (
    inputs.taxRate +
    inputs.campaignRate +
    inputs.adsRate +
    inputs.couponRate +
    inputs.affiliateRate +
    inputs.installmentRate +
    inputs.returnReserveRate +
    inputs.otherVariableRate
  ) / 100
}

function calculateCostsAtPrice(
  price: number,
  inputs: PricingInputs,
): { total: number; lines: CostLine[] } {
  const commissionRule = getCommissionRule(inputs)
  const commission = calculateCommission(price, commissionRule)
  const variableRate = getVariableRateSum(inputs)

  const tax = price * (inputs.taxRate / 100)
  const campaigns = price * (inputs.campaignRate / 100)
  const ads = price * (inputs.adsRate / 100)
  const coupons = price * (inputs.couponRate / 100)
  const affiliate = price * (inputs.affiliateRate / 100)
  const installment = price * (inputs.installmentRate / 100)
  const returnReserve = price * (inputs.returnReserveRate / 100)
  const otherVariable = price * (inputs.otherVariableRate / 100)

  const planCost = getPlanCostPerUnit(inputs)

  const lines: CostLine[] = [
    {
      id: 'product',
      label: 'Custo do produto',
      value: inputs.productCost,
      group: 'fixed',
    },
    {
      id: 'logistics',
      label: 'Logística / frete',
      value: inputs.logisticsCost,
      group: 'fixed',
    },
    {
      id: 'packaging',
      label: 'Embalagem',
      value: inputs.packagingCost,
      group: 'fixed',
    },
    {
      id: 'fixed-unit',
      label: 'Custo fixo por unidade',
      value: inputs.fixedCostPerUnit,
      group: 'fixed',
    },
    {
      id: 'other-fixed',
      label: 'Outros custos fixos',
      value: inputs.otherFixedCosts,
      group: 'fixed',
    },
    {
      id: 'plan',
      label:
        inputs.sellerPlan === 'individual'
          ? 'Taxa plano Individual (R$ 2/un)'
          : inputs.professionalFirstYearFree && inputs.monthsSinceRegistration <= 12
            ? 'Plano Profissional (promo 1º ano grátis)'
            : 'Mensalidade plano Profissional rateada',
      value: planCost,
      group: 'fixed',
    },
    {
      id: 'commission',
      label: 'Comissão Amazon',
      value: commission,
      percentOfPrice: price > 0 ? (commission / price) * 100 : 0,
      group: 'variable',
    },
    {
      id: 'tax',
      label: 'Imposto sobre venda',
      value: tax,
      percentOfPrice: inputs.taxRate,
      group: 'variable',
    },
    {
      id: 'campaigns',
      label: 'Campanhas promocionais',
      value: campaigns,
      percentOfPrice: inputs.campaignRate,
      group: 'variable',
    },
    {
      id: 'ads',
      label: 'Investimento em ads',
      value: ads,
      percentOfPrice: inputs.adsRate,
      group: 'variable',
    },
    {
      id: 'coupons',
      label: 'Cupons de desconto',
      value: coupons,
      percentOfPrice: inputs.couponRate,
      group: 'variable',
    },
    {
      id: 'affiliate',
      label: 'Comissão de afiliados',
      value: affiliate,
      percentOfPrice: inputs.affiliateRate,
      group: 'variable',
    },
    {
      id: 'installment',
      label: 'Taxa de parcelamento',
      value: installment,
      percentOfPrice: inputs.installmentRate,
      group: 'variable',
    },
    {
      id: 'returns',
      label: 'Reserva para devoluções',
      value: returnReserve,
      percentOfPrice: inputs.returnReserveRate,
      group: 'variable',
    },
    {
      id: 'other-variable',
      label: 'Outros custos variáveis',
      value: otherVariable,
      percentOfPrice: inputs.otherVariableRate,
      group: 'variable',
    },
  ]

  const variableFromRates = price * variableRate
  const total = getFixedCosts(inputs) + commission + variableFromRates

  return { total, lines: lines.filter((l) => l.value > 0 || l.group === 'fixed') }
}

function getTargetProfit(
  price: number,
  marginType: MarginType,
  marginPercent: number,
  marginFixed: number,
): number {
  if (marginType === 'fixed') return marginFixed
  return price * (marginPercent / 100)
}

function solveSellingPrice(inputs: PricingInputs): number {
  const fixed = getFixedCosts(inputs)
  const commissionRule = getCommissionRule(inputs)

  let low = Math.max(fixed, 0.01)
  let high = Math.max(fixed * 3, 50)

  while (calculateCostsAtPrice(high, inputs).total + getTargetProfit(high, inputs.targetMarginType, inputs.targetMarginPercent, inputs.targetMarginFixed) > high * 0.99) {
    high *= 2
    if (high > 1_000_000) break
  }

  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2
    const costs = calculateCostsAtPrice(mid, inputs).total
    const target = getTargetProfit(mid, inputs.targetMarginType, inputs.targetMarginPercent, inputs.targetMarginFixed)
    const profit = mid - costs

    if (profit < target) {
      low = mid
    } else {
      high = mid
    }
  }

  const price = (low + high) / 2

  const commission = calculateCommission(price, commissionRule)
  if (commission === commissionRule.minCommission && price * (commissionRule.type === 'flat' ? commissionRule.rate / 100 : 0) < commissionRule.minCommission) {
    return Math.max(price, fixed + commissionRule.minCommission + 0.01)
  }

  return Math.round(price * 100) / 100
}

function buildWarnings(inputs: PricingInputs, price: number): string[] {
  const warnings: string[] = []
  const variableTotal = getVariableRateSum(inputs) * 100
  const marginTarget = inputs.targetMarginType === 'percent' ? inputs.targetMarginPercent : 0

  if (variableTotal + marginTarget >= 100) {
    warnings.push(
      'A soma dos percentuais variáveis e da margem desejada é igual ou superior a 100%. Ajuste os valores para obter um preço viável.',
    )
  }

  if (price < 10) {
    warnings.push(
      'Preço muito baixo: a comissão mínima da Amazon pode representar uma fatia grande do preço.',
    )
  }

  if (inputs.sellerPlan === 'professional' && inputs.monthlyUnits < 10) {
    warnings.push(
      'Com poucas unidades/mês, a mensalidade do plano Profissional eleva bastante o custo por unidade.',
    )
  }

  if (
    inputs.sellerPlan === 'professional' &&
    inputs.professionalFirstYearFree &&
    inputs.monthsSinceRegistration > 12
  ) {
    warnings.push(
      'Você marcou a promoção do plano Profissional, mas informou mais de 12 meses de conta. Revise para evitar distorção no preço.',
    )
  }

  return warnings
}

export function calculatePricing(inputs: PricingInputs): PricingResult {
  const warnings = buildWarnings(inputs, 0)

  const variableTotal = getVariableRateSum(inputs) * 100
  const marginTarget =
    inputs.targetMarginType === 'percent' ? inputs.targetMarginPercent : 0

  if (variableTotal + marginTarget >= 99.9) {
    return {
      sellingPrice: 0,
      totalCosts: 0,
      contributionMargin: 0,
      contributionMarginPercent: 0,
      targetMet: false,
      costLines: [],
      warnings: [
        'Impossível calcular: custos percentuais + margem desejada ≥ 100%. Reduza os percentuais ou a margem.',
        ...warnings,
      ],
    }
  }

  const sellingPrice = solveSellingPrice(inputs)
  const { total: totalCosts, lines: costLines } = calculateCostsAtPrice(sellingPrice, inputs)
  const contributionMargin = sellingPrice - totalCosts
  const contributionMarginPercent =
    sellingPrice > 0 ? (contributionMargin / sellingPrice) * 100 : 0

  const targetProfit = getTargetProfit(
    sellingPrice,
    inputs.targetMarginType,
    inputs.targetMarginPercent,
    inputs.targetMarginFixed,
  )

  costLines.push({
    id: 'margin',
    label: 'Margem de contribuição (lucro)',
    value: contributionMargin,
    percentOfPrice: contributionMarginPercent,
    group: 'margin',
  })

  return {
    sellingPrice,
    totalCosts,
    contributionMargin,
    contributionMarginPercent,
    targetMet: Math.abs(contributionMargin - targetProfit) < 0.05,
    costLines,
    warnings: buildWarnings(inputs, sellingPrice),
  }
}

export const DEFAULT_INPUTS: PricingInputs = {
  productCost: 25,
  logisticsCost: 12,
  logisticsType: 'fba',
  fixedCostPerUnit: 0,
  packagingCost: 2,
  otherFixedCosts: 0,

  categoryId: 'casa',
  customCommissionRate: 15,
  useCustomCommission: false,

  sellerPlan: 'individual',
  monthlyUnits: 100,
  monthlyPlanFee: 19,
  professionalFirstYearFree: true,
  monthsSinceRegistration: 1,

  taxRate: 6,
  campaignRate: 5,
  adsRate: 8,
  couponRate: 3,
  affiliateRate: 0,
  installmentRate: 0,
  returnReserveRate: 2,
  otherVariableRate: 0,

  targetMarginType: 'percent',
  targetMarginPercent: 15,
  targetMarginFixed: 10,
}
