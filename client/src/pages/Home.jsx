import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.js'

const cards = [
  ['Roads & Streets', 'Report potholes, damaged roads, blocked drains and unsafe crossings.', 'ri-traffic-light-line'],
  ['Garbage', 'Flag overflowing bins, illegal dumping and missed waste collection.', 'ri-recycle-line'],
  ['Water & Utilities', 'Report leaks, water shortages, streetlights and electricity issues.', 'ri-drop-line'],
]

export default function Home() {
  const { token, user } = useAppSelector((s) => s.auth)
  return (
    <div className="space-y-16 pb-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-white md:px-12 md:py-20">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
            A faster way to improve your neighborhood
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Report local problems. <span className="text-emerald-400">Track real progress.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            CivicConnect gives citizens a clear digital path from complaint to resolution, while
            helping local officers prioritize the issues that matter most.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {token && user?.role === 'citizen' ? (
              <Link
                to="/report"
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400"
              >
                <i className="ri-add-circle-line text-lg" />
                Report a problem
              </Link>
            ) : (
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400"
              >
                <i className="ri-user-add-line text-lg" />
                Get started
              </Link>
            )}
            <Link
              to="/complaints"
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-bold hover:bg-slate-900"
            >
              <i className="ri-list-check-2 text-lg" />
              Browse complaints
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-7">
          <p className="font-bold text-emerald-700">What can you report?</p>
          <h2 className="mt-1 text-3xl font-black text-slate-900">Everyday issues, one simple portal.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map(([title, desc, icon]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">
                <i className={icon} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-emerald-50 p-6">
          <div className="mb-2 text-2xl text-emerald-700"><i className="ri-time-line" /></div>
          <b className="text-2xl text-emerald-800">1 minute</b>
          <p className="mt-1 text-slate-600">Target reporting time for a new complaint.</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-6">
          <div className="mb-2 text-2xl text-blue-700"><i className="ri-eye-line" /></div>
          <b className="text-2xl text-blue-800">Transparent</b>
          <p className="mt-1 text-slate-600">See status, priority and officer remarks.</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-6">
          <div className="mb-2 text-2xl text-amber-700"><i className="ri-group-line" /></div>
          <b className="text-2xl text-amber-800">Community powered</b>
          <p className="mt-1 text-slate-600">Upvote existing issues instead of creating duplicates.</p>
        </div>
      </section>
    </div>
  )
}