import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.js'

export default function ProtectedRoute({ adminOnly = false, officerOnly = false, citizenOnly = false }) {
  const { token, user } = useAppSelector((s) => s.auth)

  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  if (officerOnly && user?.role !== 'officer') return <Navigate to="/dashboard" replace />
  if (citizenOnly && !['citizen', 'user'].includes(user?.role)) return <Navigate to={user?.role === 'admin' ? '/admin' : '/officer'} replace />
  return <Outlet />
}
