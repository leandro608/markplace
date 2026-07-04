import {
  getPlatformReviewStatus,
  PLATFORM_COSTS_REFERENCE,
  PLATFORM_REFERENCE_SOURCES,
  PLATFORM_REVIEW_CHECKLIST,
} from '../data/platformReferences'

export function ReferenceSourcesCard() {
  const reviewStatus = getPlatformReviewStatus(
    PLATFORM_COSTS_REFERENCE.lastReviewedAt,
    PLATFORM_COSTS_REFERENCE.staleAfterDays,
  )

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">Fonte das tarifas da plataforma</h3>
        <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700">
          Ref. {PLATFORM_COSTS_REFERENCE.versionLabel}
        </span>
      </div>

      <div className="mb-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <p>
          <strong>Última revisão:</strong> {PLATFORM_COSTS_REFERENCE.lastReviewedAt}
        </p>
        <p>
          <strong>Dias desde a revisão:</strong> {reviewStatus.daysSinceReview}
        </p>
        <p>
          <strong>Responsável:</strong> {PLATFORM_COSTS_REFERENCE.reviewOwner}
        </p>
        <p>
          <strong>Periodicidade:</strong> {PLATFORM_COSTS_REFERENCE.updateCadence}
        </p>
      </div>

      {reviewStatus.isStale ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <p className="font-semibold">Alerta: revisão de tarifas vencida</p>
          <p className="mt-0.5">
            Esta base está sem atualização há {reviewStatus.daysSinceReview} dias. Revise os custos
            oficiais da Amazon para evitar erro de precificação.
          </p>
        </div>
      ) : (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <p className="font-semibold">Status da revisão: em dia</p>
          <p className="mt-0.5">
            Próxima revisão recomendada em até {reviewStatus.nextReviewInDays} dia
            {reviewStatus.nextReviewInDays === 1 ? '' : 's'}.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Fontes oficiais
        </p>
        <ul className="space-y-2">
          {PLATFORM_REFERENCE_SOURCES.map((source) => (
            <li key={source.url} className="rounded-lg border border-slate-100 p-2.5 text-xs">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 hover:underline"
              >
                {source.label}
              </a>
              <p className="mt-0.5 text-slate-600">{source.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Checklist de atualização
        </p>
        <ul className="space-y-1.5 text-xs text-slate-600">
          {PLATFORM_REVIEW_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-0.5 text-slate-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
