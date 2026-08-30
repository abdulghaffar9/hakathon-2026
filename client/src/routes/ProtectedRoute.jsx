import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.js'

// Wrap any route that requires a logged-in user.
// Pass adminOnly to also require role === 'admin' (non-admins get bounced
// to their own dashboard instead of the login page).
export default function ProtectedRoute({ adminOnly = false }) {
  const { token, user } = useAppSelector((state) => state.auth)

  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <Outlet />
}