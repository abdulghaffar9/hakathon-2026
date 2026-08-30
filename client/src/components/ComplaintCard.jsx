import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { upvoteComplaint } from '../features/complaintsSlice.js'

const colors = {
  Pending: 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
}

const priorities = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
}

export default function ComplaintCard({ complaint }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)

  const voted = complaint.upvotedBy?.some(
    (id) => String(id) === String(user?._id)
  )

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {complaint.category}
          </span>

          <Link
            to={`/complaints/${complaint._id}`}
            className="mt-1 block text-lg font-bold text-slate-900 hover:text-emerald-700"
          >
            {complaint.title}
          </Link>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            colors[complaint.status]
          }`}
        >
          {complaint.status}
        </span>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-sm leading-6 text-slate-600">
        {complaint.description}
      </p>

      {/* Meta information */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">

        {/* Area */}
        <span className="flex items-center gap-1">
          <i className="ri-map-pin-line text-base text-slate-400"></i>
          {complaint.area}
        </span>

        {/* Date */}
        <span className="flex items-center gap-1">
          <i className="ri-calendar-line text-base text-slate-400"></i>
          {new Date(complaint.createdAt).toLocaleDateString()}
        </span>

        {/* Priority */}
        <span
          className={`rounded-full px-2 py-0.5 font-bold ${
            priorities[complaint.priority]
          }`}
        >
          {complaint.priority}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

        {/* Upvote count */}
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
          <i className="ri-thumb-up-line text-base"></i>
          {complaint.upvotes} upvote
          {complaint.upvotes === 1 ? '' : 's'}
        </span>

        {/* Upvote button */}
        {user?.role === 'citizen' && (
          <button
            disabled={voted || complaint.status === 'Resolved'}
            onClick={() => dispatch(upvoteComplaint(complaint._id))}
            className="flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i
              className={
                voted
                  ? 'ri-thumb-up-fill'
                  : 'ri-thumb-up-line'
              }
            ></i>

            {voted ? 'Upvoted' : 'Upvote'}
          </button>
        )}

      </div>
    </article>
  )
}