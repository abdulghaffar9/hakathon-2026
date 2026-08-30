import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { updateUser } from '../features/auth/authSlice.js'
import api from '../utils/axiosInstance.js'

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const inputRef = useRef(null)

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.startsWith('http')) {
      return image
    }

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api'

    return `${baseUrl.replace('/api', '')}${image}`
  }

  const handleSelect = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB.')
      return
    }

    setError('')
    setMessage('')

    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('profilePicture', file)

    try {
      setLoading(true)

      const { data } = await api.patch(
        '/profile/picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      dispatch(updateUser(data.user))

      setMessage('Profile picture updated successfully.')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to upload profile picture.',
      )

      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    try {
      setLoading(true)
      setError('')
      setMessage('')

      const { data } = await api.delete('/profile/picture')

      dispatch(updateUser(data.user))

      setPreview(null)

      setMessage('Profile picture removed.')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to remove profile picture.',
      )
    } finally {
      setLoading(false)
    }
  }

  const currentImage =
    preview || getImageUrl(user?.profilePicture)

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-emerald-600">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Your Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your profile picture and account information.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-5">
            {currentImage ? (
              <img
                src={currentImage}
                alt={user?.name}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-emerald-50"
              />
            ) : (
              <div className="grid h-32 w-32 place-items-center rounded-full bg-emerald-100 text-4xl font-bold text-emerald-700 ring-4 ring-emerald-50">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            {user?.name}
          </h2>

          <p className="mt-1 text-sm capitalize text-slate-500">
            {user?.role}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Change Picture'}
            </button>

            {user?.profilePicture && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleSelect}
            className="hidden"
          />

          <p className="mt-4 text-xs text-slate-400">
            JPG, PNG or WEBP · Maximum 2MB
          </p>

          {message && (
            <p className="mt-4 text-sm font-medium text-emerald-600">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Name
            </span>

            <p className="mt-1 font-medium text-slate-800">
              {user?.name}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </span>

            <p className="mt-1 font-medium text-slate-800">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}