import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.js'

// Wrap routes like /login and /register so a logged-in user gets
// bounced to their dashboard instead of seeing the auth forms again.
export default function PublicOnlyRoute() {
  const { token, user } = useAppSelector((state) => state.auth)
  if (!token) return <Outlet />
  return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
}