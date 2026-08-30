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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
      <Link to="/" className="flex items-center gap-3">
  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  </span>
  <span>
    <b className="block text-slate-900">CivicConnect</b>
    <small className="text-slate-500">Citizen Complaint Portal</small>
  </span>
</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/complaints" className="text-slate-600 hover:text-emerald-700">Public Complaints</Link>
          {token && ['citizen', 'user'].includes(user?.role) && <Link to="/dashboard" className="text-slate-600 hover:text-emerald-700">My Complaints</Link>}
          {token && user?.role === 'officer' && <Link to="/officer" className="text-slate-600 hover:text-emerald-700">Officer Dashboard</Link>}
          {token && user?.role === 'admin' && <Link to="/admin" className="text-slate-600 hover:text-emerald-700">Admin</Link>}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {token ? <>
            <Link
  to="/profile"
  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
>
  {user?.profilePicture ? (
    <img
      src={`${
        import.meta.env.VITE_API_BASE_URL?.replace('/api', '') ||
        'http://localhost:5000'
      }${user.profilePicture}`}
      alt={user.name}
      className="h-9 w-9 rounded-full object-cover"
    />
  ) : (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-700">
      {user?.name?.charAt(0)?.toUpperCase()}
    </span>
  )}

  <span className="hidden text-slate-600 sm:inline">
    {user?.name?.split(' ')[0]}
  </span>
</Link>
            <button onClick={handleLogout} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">Log out</button>
          </> : <>
            <Link to="/login" className="rounded-lg px-3 py-2 font-semibold text-slate-700">Log in</Link>
            <Link to="/register" className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">Report an issue</Link>
          </>}
        </div>
      </div>
    </header>
  )
}
