export type SellerPlan = 'individual' | 'professional'

export type LogisticsType = 'fba' | 'dba' | 'fbm' | 'custom'

export type MarginType = 'percent' | 'fixed'

export type CommissionRule =
  | { type: 'flat'; rate: number; minCommission: number }
  | {
      type: 'tiered'
      tiers: { upTo: number; rate: number }[]
      excessRate: number
      minCommission: number
    }

export interface AmazonCategory {
  id: string
  name: string
  commission: CommissionRule
}

export interface PricingInputs {
  productCost: number
  logisticsCost: number
  logisticsType: LogisticsType
  fixedCostPerUnit: number
  packagingCost: number
  otherFixedCosts: number

  categoryId: string
  customCommissionRate: number
  useCustomCommission: boolean

  sellerPlan: SellerPlan
  monthlyUnits: number
  monthlyPlanFee: number

  taxRate: number
  campaignRate: number
  adsRate: number
  couponRate: number
  affiliateRate: number
  installmentRate: number
  returnReserveRate: number
  otherVariableRate: number

  targetMarginType: MarginType
  targetMarginPercent: number
  targetMarginFixed: number
}

export interface CostLine {
  id: string
  label: string
  value: number
  percentOfPrice?: number
  group: 'fixed' | 'variable' | 'margin'
}

export interface PricingResult {
  sellingPrice: number
  totalCosts: number
  contributionMargin: number
  contributionMarginPercent: number
  targetMet: boolean
  costLines: CostLine[]
  warnings: string[]
}
