import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { fetchItems, createItem, updateItem, deleteItem } from '../features/items/itemsSlice.js'
import Loader from '../components/Loader.jsx'
import StatCard from '../components/StatCard.jsx'

export default function UserDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { items, isLoading } = useAppSelector((state) => state.items)

  const [form, setForm] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    dispatch(fetchItems())
  }, [dispatch])

  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const addedThisWeek = items.filter((i) => new Date(i.createdAt).getTime() > oneWeekAgo).length
    const latest = items[0]?.title
    return { total: items.length, addedThisWeek, latest }
  }, [items])

  const resetForm = () => {
    setForm({ title: '', description: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return

    if (editingId) {
      const result = await dispatch(updateItem({ id: editingId, ...form }))
      if (updateItem.fulfilled.match(result)) {
        toast.success('Item updated')
        resetForm()
      } else {
        toast.error(result.payload || 'Update failed')
      }
    } else {
      const result = await dispatch(createItem(form))
      if (createItem.fulfilled.match(result)) {
        toast.success('Item added')
        resetForm()
      } else {
        toast.error(result.payload || 'Create failed')
      }
    }
  }

  const startEdit = (item) => {
    setEditingId(item._id)
    setForm({ title: item.title, description: item.description || '' })
  }

  const handleDelete = async (id) => {
    const result = await dispatch(deleteItem(id))
    if (deleteItem.fulfilled.match(result)) {
      toast.success('Item deleted')
      if (editingId === id) resetForm()
    } else {
      toast.error(result.payload || 'Delete failed')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Logged in as {user?.email}. This is the example CRUD feature — copy the
        pattern for your real hackathon resource (tasks, posts, products, etc.).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total items"
          value={stats.total}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          }
        />
        <StatCard
          label="Added this week"
          value={stats.addedThisWeek}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          label="Most recent"
          value={
            stats.latest ? (
              <span className="block truncate max-w-[10rem]" title={stats.latest}>
                {stats.latest}
              </span>
            ) : (
              '—'
            )
          }
          hint={stats.latest ? undefined : 'Nothing added yet'}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Your items
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm whitespace-nowrap"
          >
            {editingId ? 'Save' : 'Add item'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <Loader label="Loading items..." />
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">No items yet — add one above.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item._id}
              className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-shadow flex items-start justify-between gap-4"
            >
              <div>
                <p className="font-medium text-gray-800">{item.title}</p>
                {item.description && (
                  <p className="text-sm text-gray-500">{item.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(item)}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}