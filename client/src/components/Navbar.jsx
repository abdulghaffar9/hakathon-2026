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

  const navLinkClass =
    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5">

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
            <i className="ri-map-pin-line text-xl leading-none" />
          </span>
          <span className="hidden sm:block">
            <b className="block leading-tight text-slate-900">CivicConnect</b>
            <small className="text-xs leading-tight text-slate-500">Citizen Complaint Portal</small>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <Link to="/complaints" className={navLinkClass}>
            <i className="ri-file-list-3-line text-base leading-none" />
            <span>Public Complaints</span>
          </Link>

          {token && ['citizen', 'user'].includes(user?.role) && (
            <Link to="/dashboard" className={navLinkClass}>
              <i className="ri-dashboard-line text-base leading-none" />
              <span>My Complaints</span>
            </Link>
          )}

          {token && user?.role === 'officer' && (
            <Link to="/officer" className={navLinkClass}>
              <i className="ri-government-line text-base leading-none" />
              <span>Officer Dashboard</span>
            </Link>
          )}

          {token && user?.role === 'admin' && (
            <Link to="/admin" className={navLinkClass}>
              <i className="ri-admin-line text-base leading-none" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2 text-sm">
          {token ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 transition hover:bg-slate-100"
              >
                {user?.profilePicture ? (
                  <img
                    src={`${
                      import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
                    }${user.profilePicture}`}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <i className="ri-user-line text-base leading-none" />
                  </span>
                )}
                <span className="hidden text-slate-700 sm:inline">{user?.name?.split(' ')[0]}</span>
              </Link>

              <span className="hidden h-6 w-px bg-slate-200 sm:block" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <i className="ri-logout-box-r-line text-base leading-none" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <i className="ri-login-box-line text-base leading-none" />
                <span>Log in</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                <i className="ri-add-circle-line text-base leading-none" />
                <span>Report an issue</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}