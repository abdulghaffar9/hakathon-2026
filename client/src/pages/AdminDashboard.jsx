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

  const {
    users,
    allItems,
    isLoading,
  } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAllUsers()).then((result) => {
      if (fetchAllUsers.rejected.match(result)) {
        toast.error(result.payload || 'Failed to load users')
      }
    })

    dispatch(fetchAllItems()).then((result) => {
      if (fetchAllItems.rejected.match(result)) {
        toast.error(result.payload || 'Failed to load complaints')
      }
    })
  }, [dispatch])

  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const admins = users.filter(
      (u) => u.role === 'admin'
    ).length

    const officers = users.filter(
      (u) => u.role === 'officer'
    ).length

    const newThisWeek = users.filter(
      (u) =>
        new Date(u.createdAt).getTime() > oneWeekAgo
    ).length

    return {
      totalUsers: users.length,
      admins,
      officers,
      newThisWeek,
      totalItems: allItems.length,
    }
  }, [users, allItems])

  const handleRoleToggle = async (targetUser) => {
    const newRole =
      targetUser.role === 'admin'
        ? 'user'
        : 'admin'

    const result = await dispatch(
      setUserRole({
        id: targetUser._id,
        role: newRole,
      })
    )

    if (setUserRole.fulfilled.match(result)) {
      toast.success(
        `${targetUser.email} is now ${newRole}`
      )
    } else {
      toast.error(
        result.payload || 'Failed to update role'
      )
    }
  }

  const handleDelete = async (targetUser) => {
    const result = await dispatch(
      deleteUserById(targetUser._id)
    )

    if (deleteUserById.fulfilled.match(result)) {
      toast.success(
        `${targetUser.email} deleted`
      )
    } else {
      toast.error(
        result.payload || 'Failed to delete user'
      )
    }
  }

  return (
    <div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <i className="ri-admin-line text-2xl"></i>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage users and monitor CivicConnect activity.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader label="Loading admin data..." />
      ) : (
        <>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              hint="Registered users"
              icon="ri-group-line"
            />

            <StatCard
              label="Admins"
              value={stats.admins}
              hint="Administrator accounts"
              icon="ri-shield-user-line"
            />

            <StatCard
              label="Officers"
              value={stats.officers}
              hint="Government officers"
              icon="ri-government-line"
            />

            <StatCard
              label="New This Week"
              value={stats.newThisWeek}
              hint="Recently registered"
              icon="ri-user-add-line"
            />

          </div>

          {/* Users */}
          <section className="mb-8">

            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                <i className="ri-group-line text-lg"></i>
                Users ({users.length})
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-gray-50 text-left text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">
                        Name
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Email
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Role
                      </th>

                      <th className="px-4 py-3 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {users.map((u, idx) => (
                      <tr
                        key={u._id}
                        className={`border-t border-gray-100 transition-colors hover:bg-emerald-50/40 ${
                          idx % 2 === 1
                            ? 'bg-gray-50/50'
                            : ''
                        }`}
                      >

                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">

                            {u.profilePicture ? (
                              <img
                                src={`${
                                  import.meta.env
                                    .VITE_API_BASE_URL?.replace(
                                      '/api',
                                      ''
                                    ) ||
                                  'http://localhost:5000'
                                }${u.profilePicture}`}
                                alt={u.name}
                                className="h-9 w-9 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                                {u.name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>
                            )}

                            <span className="font-medium text-gray-800">
                              {u.name}
                            </span>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-gray-600">
                          {u.email}
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-700'
                                : u.role === 'officer'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >

                            <i
                              className={
                                u.role === 'admin'
                                  ? 'ri-shield-user-line'
                                  : u.role === 'officer'
                                  ? 'ri-government-line'
                                  : 'ri-user-line'
                              }
                            ></i>

                            {u.role}

                          </span>

                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">

                          <div className="flex justify-end gap-3">

                            <button
                              onClick={() =>
                                handleRoleToggle(u)
                              }
                              disabled={
                                u._id ===
                                currentUser?._id
                              }
                              className="inline-flex items-center gap-1.5 font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline"
                            >

                              <i
                                className={
                                  u.role === 'admin'
                                    ? 'ri-arrow-down-circle-line'
                                    : 'ri-arrow-up-circle-line'
                                }
                              ></i>

                              {u.role === 'admin'
                                ? 'Demote'
                                : 'Promote'}

                            </button>

                            <button
                              onClick={() =>
                                handleDelete(u)
                              }
                              disabled={
                                u._id ===
                                currentUser?._id
                              }
                              className="inline-flex items-center gap-1.5 font-medium text-red-600 transition hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline"
                            >
                              <i className="ri-delete-bin-line"></i>
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              </div>

            </div>
          </section>

          {/* All Complaints */}
          <section>

            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                <i className="ri-file-list-3-line text-lg"></i>
                All Complaints ({allItems.length})
              </h2>
            </div>

            {allItems.length === 0 ? (

              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
                <i className="ri-file-list-3-line mb-2 text-3xl text-gray-300"></i>

                <p className="text-sm text-gray-500">
                  No complaints yet.
                </p>
              </div>

            ) : (

              <ul className="space-y-3">

                {allItems.map((item) => (
                  <li
                    key={item._id}
                    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="flex items-center gap-2 font-medium text-gray-800">
                          <i className="ri-file-text-line text-emerald-600"></i>
                          {item.title}
                        </p>

                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                          <i className="ri-user-line"></i>
                          Owner:{' '}
                          {item.owner?.name ||
                            'Unknown'}{' '}
                          ({item.owner?.email ||
                            'No email'})
                        </p>

                      </div>

                    </div>

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