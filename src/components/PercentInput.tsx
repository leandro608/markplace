interface PercentInputProps {
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
}

export function PercentInput({ label, hint, value, onChange }: PercentInputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          %
        </span>
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}
