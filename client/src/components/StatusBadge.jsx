const styles = { Pending: 'bg-amber-50 text-amber-700', 'In Progress': 'bg-blue-50 text-blue-700', Resolved: 'bg-emerald-50 text-emerald-700' }
const priorities = { Low: 'bg-slate-100 text-slate-600', Medium: 'bg-amber-100 text-amber-700', High: 'bg-orange-100 text-orange-700', Critical: 'bg-red-100 text-red-700' }
export function StatusBadge({ value }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[value] || 'bg-slate-100 text-slate-600'}`}>{value}</span> }
export function PriorityBadge({ value }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorities[value] || 'bg-slate-100 text-slate-600'}`}>{value}</span> }
