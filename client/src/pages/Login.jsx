import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { loginUser } from '../features/auth/authSlice.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const { isLoading } = useAppSelector((s) => s.auth)

  const submit = async (e) => {
    e.preventDefault()
    const r = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(r)) {
      toast.success('Welcome back')
      nav(r.payload.user.role === 'officer' ? '/officer' : '/dashboard')
    } else toast.error(r.payload || 'Login failed')
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">
          <i className="ri-lock-2-line" />
        </div>
        <p className="font-bold text-emerald-700">Welcome back</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Log in to your account</h1>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </label>
          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          New citizen? <Link className="font-bold text-emerald-700" to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}