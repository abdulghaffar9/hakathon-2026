import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import {
  fetchAllUsers,
  fetchAllItems,
  setUserRole,
  deleteUserById,
} from '../features/admin/adminSlice.js'
import Loader from '../components/Loader.jsx'
import StatCard from '../components/StatCard.jsx'

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const { users, allItems, isLoading } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAllUsers()).then((result) => {
      if (fetchAllUsers.rejected.match(result)) {
        toast.error(result.payload || 'Failed to load users')
      }
    })
    dispatch(fetchAllItems()).then((result) => {
      if (fetchAllItems.rejected.match(result)) {
        toast.error(result.payload || 'Failed to load items')
      }
    })
  }, [dispatch])

  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const admins = users.filter((u) => u.role === 'admin').length
    const newThisWeek = users.filter((u) => new Date(u.createdAt).getTime() > oneWeekAgo).length
    return { totalUsers: users.length, admins, newThisWeek, totalItems: allItems.length }
  }, [users, allItems])

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin'
    const result = await dispatch(setUserRole({ id: targetUser._id, role: newRole }))
    if (setUserRole.fulfilled.match(result)) {
      toast.success(`${targetUser.email} is now ${newRole}`)
    } else {
      toast.error(result.payload || 'Failed to update role')
    }
  }

  const handleDelete = async (targetUser) => {
    const result = await dispatch(deleteUserById(targetUser._id))
    if (deleteUserById.fulfilled.match(result)) {
      toast.success(`${targetUser.email} deleted`)
    } else {
      toast.error(result.payload || 'Failed to delete user')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Manage users and see every item across all accounts.
      </p>

      {isLoading ? (
        <Loader label="Loading admin data..." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total users"
              value={stats.totalUsers}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                  <path d="M16 8.5a3 3 0 1 1 0 6" strokeLinecap="round" />
                  <path d="M20 20c0-2.6-1.7-4.8-4-5.6" strokeLinecap="round" />
                </svg>
              }
            />
            <StatCard
              label="Admins"
              value={stats.admins}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
                </svg>
              }
            />
            <StatCard
              label="New this week"
              value={stats.newThisWeek}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              }
            />
            <StatCard
              label="Total items"
              value={stats.totalItems}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              }
            />
          </div>

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Users ({users.length})
            </h2>
            <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr
                      key={u._id}
                      className={`border-t border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-primary-50/40 transition-colors`}
                    >
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right space-x-3">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={u._id === currentUser?._id}
                          className="text-primary-600 hover:underline disabled:text-gray-300 disabled:no-underline"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={u._id === currentUser?._id}
                          className="text-red-600 hover:underline disabled:text-gray-300 disabled:no-underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              All items ({allItems.length})
            </h2>
            {allItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No items yet across any account.</p>
            ) : (
              <ul className="space-y-2">
                {allItems.map((item) => (
                  <li
                    key={item._id}
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-shadow"
                  >
                    <p className="font-medium text-gray-800">{item.title}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Owner: {item.owner?.name} ({item.owner?.email})
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}