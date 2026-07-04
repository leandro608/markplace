import type { CostLine } from '../types'
import { formatCurrency, formatPercent } from '../lib/formatters'

interface CostBreakdownProps {
  lines: CostLine[]
  sellingPrice: number
}

const GROUP_LABELS: Record<CostLine['group'], string> = {
  fixed: 'Custos fixos',
  variable: 'Custos variáveis (% sobre preço)',
  margin: 'Resultado',
}

export function CostBreakdown({ lines, sellingPrice }: CostBreakdownProps) {
  const groups: CostLine['group'][] = ['fixed', 'variable', 'margin']

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupLines = lines.filter((l) => l.group === group)
        if (groupLines.length === 0) return null

        const groupTotal = groupLines.reduce((sum, l) => sum + l.value, 0)

        return (
          <div key={group}>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {GROUP_LABELS[group]}
              </h4>
              {group !== 'margin' && (
                <span className="text-xs font-medium text-slate-600">
                  {formatCurrency(groupTotal)}
                </span>
              )}
            </div>
            <ul className="space-y-1.5">
              {groupLines.map((line) => (
                <li
                  key={line.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    line.group === 'margin'
                      ? 'bg-emerald-50 font-semibold text-emerald-800'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {line.label}
                    {line.percentOfPrice !== undefined && line.group === 'variable' && (
                      <span className="text-xs text-slate-400">
                        ({formatPercent(line.percentOfPrice)})
                      </span>
                    )}
                  </span>
                  <span>
                    {formatCurrency(line.value)}
                    {line.group === 'margin' && sellingPrice > 0 && (
                      <span className="ml-1 text-xs font-normal text-emerald-600">
                        ({formatPercent(line.percentOfPrice ?? 0)})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
