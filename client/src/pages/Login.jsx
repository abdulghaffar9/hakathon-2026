import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { loginUser } from '../features/auth/authSlice.js'
import FormInput from '../components/FormInput.jsx'
import Loader from '../components/Loader.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useAppSelector((state) => state.auth)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Log in</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} />
        <FormInput
          label="Password"
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:opacity-60"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      {isLoading && <Loader />}
    </div>
  )
}
