import { useMemo, useState } from 'react'
import {
  AMAZON_CATEGORIES,
  getCategoryCommissionDescription,
} from './data/amazonCategories'
import {
  LOGISTICS_OPTIONS,
  PROFESSIONAL_PLAN_MONTHLY_FEE_2026,
  SELLER_PLANS,
} from './data/logisticsOptions'
import { calculatePricing, DEFAULT_INPUTS } from './lib/pricingEngine'
import type { LogisticsType, MarginType, PricingInputs, SellerPlan } from './types'
import { CurrencyInput } from './components/CurrencyInput'
import { PercentInput } from './components/PercentInput'
import { PLATFORM_COSTS_REFERENCE } from './data/platformReferences'
import { ReferenceSourcesCard } from './components/ReferenceSourcesCard'
import { ResultsPanel } from './components/ResultsPanel'
import { SectionCard } from './components/SectionCard'
import { SelectField } from './components/SelectField'

function updateField<K extends keyof PricingInputs>(
  setInputs: React.Dispatch<React.SetStateAction<PricingInputs>>,
  key: K,
  value: PricingInputs[K],
) {
  setInputs((prev) => ({ ...prev, [key]: value }))
}

export default function App() {
  const [inputs, setInputs] = useState<PricingInputs>(DEFAULT_INPUTS)

  const result = useMemo(() => calculatePricing(inputs), [inputs])

  const handleLogisticsChange = (type: LogisticsType) => {
    const option = LOGISTICS_OPTIONS.find((o) => o.id === type)
    setInputs((prev) => ({
      ...prev,
      logisticsType: type,
      logisticsCost: type === 'custom' ? prev.logisticsCost : (option?.defaultCost ?? 0),
    }))
  }

  const variableTotal =
    inputs.taxRate +
    inputs.campaignRate +
    inputs.adsRate +
    inputs.couponRate +
    inputs.affiliateRate +
    inputs.installmentRate +
    inputs.returnReserveRate +
    inputs.otherVariableRate

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-lg font-bold text-slate-900">
              a
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Calculadora de Precificação Amazon BR
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Precificação inversa com todos os custos e margem de contribuição
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_380px] lg:px-6">
        <div className="space-y-5">
          <SectionCard
            title="Custos fixos por unidade"
            description="Valores em reais que você paga independentemente do preço de venda"
            icon={<span>📦</span>}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <CurrencyInput
                label="Custo do produto"
                hint="Custo de aquisição ou produção"
                value={inputs.productCost}
                onChange={(v) => updateField(setInputs, 'productCost', v)}
              />
              <CurrencyInput
                label="Embalagem"
                hint="Caixa, proteção, etiqueta"
                value={inputs.packagingCost}
                onChange={(v) => updateField(setInputs, 'packagingCost', v)}
              />
              <CurrencyInput
                label="Custo fixo por unidade"
                hint="Operacional, picking, etc."
                value={inputs.fixedCostPerUnit}
                onChange={(v) => updateField(setInputs, 'fixedCostPerUnit', v)}
              />
              <CurrencyInput
                label="Outros custos fixos"
                value={inputs.otherFixedCosts}
                onChange={(v) => updateField(setInputs, 'otherFixedCosts', v)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Logística e frete"
            description="Custo de envio por unidade conforme modalidade"
            icon={<span>🚚</span>}
          >
            <SelectField
              label="Modalidade de envio"
              value={inputs.logisticsType}
              options={LOGISTICS_OPTIONS}
              onChange={handleLogisticsChange}
            />
            <CurrencyInput
              label="Custo logístico por unidade"
              hint="Taxa FBA, frete DBA/FBM ou valor personalizado"
              value={inputs.logisticsCost}
              onChange={(v) => updateField(setInputs, 'logisticsCost', v)}
            />
          </SectionCard>

          <SectionCard
            title="Comissão Amazon e plano"
            description="Taxas da plataforma por categoria e plano de vendedor"
            icon={<span>🏷️</span>}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Categoria do produto"
                value={inputs.categoryId}
                options={AMAZON_CATEGORIES.map((c) => ({
                  id: c.id,
                  name: c.name,
                  description: `${getCategoryCommissionDescription(c)}${
                    c.notes ? ` — ${c.notes}` : ''
                  }`,
                }))}
                onChange={(v) => updateField(setInputs, 'categoryId', v)}
              />
              <SelectField
                label="Plano de vendedor"
                value={inputs.sellerPlan}
                options={SELLER_PLANS.map((p) => ({
                  id: p.id,
                  name: p.name,
                  description: p.description,
                }))}
                onChange={(v) => updateField(setInputs, 'sellerPlan', v as SellerPlan)}
              />
            </div>

            {inputs.sellerPlan === 'professional' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Promoção 1º ano grátis (julho/2026)
                  </span>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={inputs.professionalFirstYearFree}
                      onChange={(e) =>
                        updateField(setInputs, 'professionalFirstYearFree', e.target.checked)
                      }
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    Aplicar mensalidade zerada nos primeiros 12 meses
                  </label>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Meses desde o cadastro
                  </span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={inputs.monthsSinceRegistration || ''}
                    onChange={(e) =>
                      updateField(
                        setInputs,
                        'monthsSinceRegistration',
                        Math.max(parseInt(e.target.value) || 1, 1),
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Unidades vendidas por mês
                  </span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={inputs.monthlyUnits || ''}
                    onChange={(e) =>
                      updateField(setInputs, 'monthlyUnits', Math.max(parseInt(e.target.value) || 1, 1))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                  />
                </label>

                {!inputs.professionalFirstYearFree || inputs.monthsSinceRegistration > 12 ? (
                  <CurrencyInput
                    label="Mensalidade do plano Profissional"
                    hint="Valor atual após período promocional"
                    value={inputs.monthlyPlanFee}
                    onChange={(v) => updateField(setInputs, 'monthlyPlanFee', v)}
                  />
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    Mensalidade aplicada como <strong>R$ 0,00</strong> por estar no 1º ano.
                  </div>
                )}
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={inputs.useCustomCommission}
                onChange={(e) => updateField(setInputs, 'useCustomCommission', e.target.checked)}
                className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              Usar comissão personalizada (em vez da categoria)
            </label>

            {inputs.useCustomCommission && (
              <PercentInput
                label="Comissão personalizada"
                value={inputs.customCommissionRate}
                onChange={(v) => updateField(setInputs, 'customCommissionRate', v)}
              />
            )}
          </SectionCard>

          <SectionCard
            title="Custos variáveis (% sobre preço)"
            description="Percentuais aplicados sobre o preço de venda final"
            icon={<span>📊</span>}
          >
            <div className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
              Total de percentuais variáveis:{' '}
              <strong className={variableTotal >= 50 ? 'text-amber-700' : 'text-slate-800'}>
                {variableTotal.toFixed(1)}%
              </strong>
              {inputs.targetMarginType === 'percent' && (
                <>
                  {' '}
                  + margem desejada ({inputs.targetMarginPercent}%) ={' '}
                  <strong>{(variableTotal + inputs.targetMarginPercent).toFixed(1)}%</strong>
                </>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PercentInput
                label="Imposto sobre venda"
                hint="Simples Nacional, ICMS, etc."
                value={inputs.taxRate}
                onChange={(v) => updateField(setInputs, 'taxRate', v)}
              />
              <PercentInput
                label="Campanhas promocionais"
                hint="Lightning Deals, ofertas relâmpago"
                value={inputs.campaignRate}
                onChange={(v) => updateField(setInputs, 'campaignRate', v)}
              />
              <PercentInput
                label="Investimento em ads"
                hint="Sponsored Products, Brands, Display"
                value={inputs.adsRate}
                onChange={(v) => updateField(setInputs, 'adsRate', v)}
              />
              <PercentInput
                label="Cupons de desconto"
                hint="Desconto médio esperado por venda"
                value={inputs.couponRate}
                onChange={(v) => updateField(setInputs, 'couponRate', v)}
              />
              <PercentInput
                label="Comissão de afiliados"
                hint="Programa de afiliados Amazon"
                value={inputs.affiliateRate}
                onChange={(v) => updateField(setInputs, 'affiliateRate', v)}
              />
              <PercentInput
                label="Taxa de parcelamento"
                hint="Custo do parcelamento sem juros"
                value={inputs.installmentRate}
                onChange={(v) => updateField(setInputs, 'installmentRate', v)}
              />
              <PercentInput
                label="Reserva para devoluções"
                hint="Provisão para trocas e devoluções"
                value={inputs.returnReserveRate}
                onChange={(v) => updateField(setInputs, 'returnReserveRate', v)}
              />
              <PercentInput
                label="Outros custos variáveis"
                value={inputs.otherVariableRate}
                onChange={(v) => updateField(setInputs, 'otherVariableRate', v)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Margem de lucro desejada"
            description="Quanto você quer lucrar em cada venda realizada"
            icon={<span>🎯</span>}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => updateField(setInputs, 'targetMarginType', 'percent' as MarginType)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  inputs.targetMarginType === 'percent'
                    ? 'border-amber-400 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                Percentual sobre preço
              </button>
              <button
                type="button"
                onClick={() => updateField(setInputs, 'targetMarginType', 'fixed' as MarginType)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  inputs.targetMarginType === 'fixed'
                    ? 'border-amber-400 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                Valor fixo em R$
              </button>
            </div>

            {inputs.targetMarginType === 'percent' ? (
              <PercentInput
                label="Margem de contribuição desejada"
                hint="Percentual de lucro sobre o preço de venda"
                value={inputs.targetMarginPercent}
                onChange={(v) => updateField(setInputs, 'targetMarginPercent', v)}
              />
            ) : (
              <CurrencyInput
                label="Lucro desejado por unidade"
                hint="Valor em reais que deve sobrar após todos os custos"
                value={inputs.targetMarginFixed}
                onChange={(v) => updateField(setInputs, 'targetMarginFixed', v)}
              />
            )}
          </SectionCard>
        </div>

        <aside className="space-y-4">
          <ResultsPanel result={result} />
          <ReferenceSourcesCard />
        </aside>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Custos de plataforma com referência pública da Amazon Brasil (
        {PLATFORM_COSTS_REFERENCE.versionLabel}; revisado em{' '}
        {PLATFORM_COSTS_REFERENCE.lastReviewedAt}): plano individual R$ 2/item, plano profissional
        R$ {PROFESSIONAL_PLAN_MONTHLY_FEE_2026}/mês
        (após 12 meses) e comissão por categoria com mínimo de R$ 1 ou R$ 2 por item. Confirme
        sempre no Seller Central antes de precificar.
      </footer>
    </div>
  )
}
