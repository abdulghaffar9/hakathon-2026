export default function StatCard({ label, value, hint, icon }) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
        {icon && (
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
    )
  }