import type { PricingResult } from '../types'
import { formatCurrency, formatPercent } from '../lib/formatters'
import { CostBreakdown } from './CostBreakdown'

interface ResultsPanelProps {
  result: PricingResult
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const {
    sellingPrice,
    totalCosts,
    contributionMargin,
    contributionMarginPercent,
    costLines,
    warnings,
  } = result

  const hasError = sellingPrice <= 0

  return (
    <div className="sticky top-4 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-5 text-white">
          <p className="text-sm font-medium text-slate-300">Preço de venda sugerido</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-amber-400">
            {hasError ? '—' : formatCurrency(sellingPrice)}
          </p>
          {!hasError && (
            <p className="mt-2 text-sm text-slate-400">
              Preço mínimo para cobrir todos os custos e atingir sua margem desejada
            </p>
          )}
        </div>

        {!hasError && (
          <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total de custos
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {formatCurrency(totalCosts)}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Margem de contribuição
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  contributionMargin >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(contributionMargin)}
              </p>
              <p className="text-xs text-slate-500">{formatPercent(contributionMarginPercent)}</p>
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="border-b border-amber-100 bg-amber-50 px-5 py-3">
            <ul className="space-y-1">
              {warnings.map((w, i) => (
                <li key={i} className="flex gap-2 text-xs text-amber-800">
                  <span className="shrink-0">⚠</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!hasError && (
          <div className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Composição do preço por venda
            </h3>
            <CostBreakdown lines={costLines} sellingPrice={sellingPrice} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-medium text-slate-600">Como funciona</p>
        <p className="mt-1 leading-relaxed">
          Esta é uma calculadora <strong>inversa</strong>: você informa todos os custos e a margem
          desejada, e ela calcula o preço de venda necessário. A margem de contribuição é o que
          sobra após deduzir todos os custos — é o lucro real por unidade vendida.
        </p>
      </div>
    </div>
  )
}
