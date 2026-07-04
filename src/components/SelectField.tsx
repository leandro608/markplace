interface SelectFieldProps<T extends string> {
  label: string
  hint?: string
  value: T
  options: { id: T; name: string; description?: string }[]
  onChange: (value: T) => void
}

export function SelectField<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {options.find((o) => o.id === value)?.description && (
        <span className="mt-1 block text-xs text-slate-500">
          {options.find((o) => o.id === value)?.description}
        </span>
      )}
    </label>
  )
}
