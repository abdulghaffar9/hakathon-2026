import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-gray-600 mb-6">That page doesn't exist.</p>
      <Link to="/" className="text-primary-600 hover:underline">
        Back to home
      </Link>
    </div>
  )
}
