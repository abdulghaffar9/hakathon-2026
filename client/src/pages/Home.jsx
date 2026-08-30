import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks.js'

export default function Home() {
  const { token } = useAppSelector((state) => state.auth)

  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Hackathon Boilerplate</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        React + Redux Toolkit on the frontend, Express + MongoDB/Mongoose on the
        backend, wired together with JWT auth. Register an account to try the
        protected dashboard and CRUD example.
      </p>
      {!token && (
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/register"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Get started
          </Link>
          <Link to="/login" className="text-primary-600 hover:underline">
            I already have an account
          </Link>
        </div>
      )}
    </div>
  )
}
