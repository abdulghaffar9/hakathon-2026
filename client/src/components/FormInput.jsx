export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = true,
  icon,
  ...rest
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <i
            className={`${icon} pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400`}
          />
        )}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${
            icon ? 'pl-10 pr-3' : 'px-3'
          }`}
          {...rest}
        />
      </div>
    </div>
  )
}