import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { registerUser } from '../features/auth/authSlice.js'
import FormInput from '../components/FormInput.jsx'
import Loader from '../components/Loader.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useAppSelector((state) => state.auth)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(registerUser(form))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created!')
      navigate('/dashboard')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Create an account</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Name" id="name" value={form.name} onChange={handleChange} />
        <FormInput label="Email" id="email" type="email" value={form.email} onChange={handleChange} />
        <FormInput
          label="Password"
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          minLength={6}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:opacity-60"
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      {isLoading && <Loader />}
    </div>
  )
}
