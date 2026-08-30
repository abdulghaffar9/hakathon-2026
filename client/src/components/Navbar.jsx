import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { logout } from '../features/auth/authSlice.js'

export default function Navbar() {
  const { user, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-primary-600 text-lg">
          Hackathon App
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-primary-600">
                  Admin
                </Link>
              )}
              <span className="text-gray-500">Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-3 py-1.5 rounded-md hover:bg-primary-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}