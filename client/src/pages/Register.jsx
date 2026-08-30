import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { registerUser } from '../features/auth/authSlice.js'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const { isLoading } = useAppSelector((s) => s.auth)

  const submit = async (e) => {
    e.preventDefault()
    const r = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(r)) {
      toast.success('Account created')
      nav('/dashboard')
    } else toast.error(r.payload || 'Registration failed')
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">
          <i className="ri-user-add-line" />
        </div>
        <p className="font-bold text-emerald-700">Join CivicConnect</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Create your citizen account</h1>
        <p className="mt-2 mb-7 text-sm text-slate-500">
          Officer accounts are created separately for the demonstration.
        </p>
        <form onSubmit={submit} className="space-y-4">
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Email', 'email'],
            ['password', 'Password', 'password'],
          ].map(([name, label, type]) => (
            <label key={name} className="block text-sm font-semibold text-slate-700">
              {label}
              <input
                required
                minLength={name === 'password' ? 6 : undefined}
                type={type}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          ))}
          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link className="font-bold text-emerald-700" to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}