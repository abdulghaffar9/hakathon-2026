import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { upvoteComplaint } from '../features/complaintsSlice.js'

const colors = { Pending: 'bg-amber-50 text-amber-700', 'In Progress': 'bg-blue-50 text-blue-700', Resolved: 'bg-emerald-50 text-emerald-700' }
const priorities = { Low: 'bg-slate-100 text-slate-600', Medium: 'bg-amber-100 text-amber-700', High: 'bg-orange-100 text-orange-700', Critical: 'bg-red-100 text-red-700' }
export default function ComplaintCard({ complaint }) {
  const dispatch = useAppDispatch(); const { user } = useAppSelector((s) => s.auth)
  const voted = complaint.upvotedBy?.some((id) => String(id) === String(user?._id))
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="mb-3 flex items-start justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-wider text-emerald-700">{complaint.category}</span><Link to={`/complaints/${complaint._id}`} className="mt-1 block text-lg font-bold text-slate-900 hover:text-emerald-700">{complaint.title}</Link></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[complaint.status]}`}>{complaint.status}</span></div>
    <p className="line-clamp-2 text-sm leading-6 text-slate-600">{complaint.description}</p>
    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500"><span>⌖ {complaint.area}</span><span>•</span><span>{new Date(complaint.createdAt).toLocaleDateString()}</span><span className={`rounded-full px-2 py-0.5 font-bold ${priorities[complaint.priority]}`}>{complaint.priority}</span></div>
    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-sm font-semibold text-slate-600">{complaint.upvotes} upvote{complaint.upvotes === 1 ? '' : 's'}</span>{user?.role === 'citizen' && <button disabled={voted || complaint.status === 'Resolved'} onClick={() => dispatch(upvoteComplaint(complaint._id))} className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">{voted ? '✓ Upvoted' : '↑ Upvote'}</button>}</div>
  </article>
}
