export default function StatCard({ label, value, hint, icon }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="text-2xl font-semibold text-gray-800">
          {value}
        </p>

        {hint && (
          <p className="mt-1 text-xs text-gray-400">
            {hint}
          </p>
        )}
      </div>

      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          {typeof icon === 'string' ? (
            <i className={`${icon} text-xl`} />
          ) : (
            icon
          )}
        </div>
      )}
    </div>
  )
}