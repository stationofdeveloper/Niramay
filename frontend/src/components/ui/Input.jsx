import { cn } from '../../lib/utils'

export default function Input({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  icon: Icon,
  prefix,
  suffix,
  maxLength,
  className = '',
  inputClassName = '',
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>

      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-forest-700"
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center">

        {/* Left icon */}
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none">
            <Icon className="w-4 h-4 text-forest-400" />
          </div>
        )}

        {/* Prefix text (e.g. "+91") */}
        {prefix && (
          <span className="absolute left-10 text-gray-400 text-sm pointer-events-none select-none">
            {prefix}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            'form-input',
            Icon && 'pl-10',
            Icon && prefix && 'pl-16',
            suffix && 'pr-10',
            error && 'border-red-400 focus:ring-red-400',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
            inputClassName
          )}
        />

        {/* Suffix text or icon */}
        {suffix && (
          <div className="absolute right-3.5 pointer-events-none text-gray-400 text-sm">
            {suffix}
          </div>
        )}
      </div>

      {/* Hint text */}
      {hint && !error && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}

      {/* Error text */}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

// ─── Textarea variant ─────────────────────────────────────────
export function Textarea({
  label,
  name,
  placeholder = '',
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  rows = 3,
  maxLength,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-forest-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          'form-input resize-none',
          error && 'border-red-400 focus:ring-red-400',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
          className
        )}
      />
      {hint  && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  )
}

// ─── Select variant ───────────────────────────────────────────
export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-forest-700">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          'form-input bg-white cursor-pointer',
          error && 'border-red-400',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">⚠ {error}</p>}
    </div>
  )
}