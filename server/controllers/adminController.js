import User from '../models/User.js'
import Item from '../models/Item.js'

// GET /api/admin/users
export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/users/:id/role  body: { role: 'admin' | 'user' }
export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" })
    }

    if (req.params.id === String(req.user._id) && role !== 'admin') {
      return res.status(400).json({ message: "You can't demote your own account" })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ message: "You can't delete your own account" })
    }

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Clean up anything that user owned
    await Item.deleteMany({ owner: user._id })

    res.json({ message: 'User deleted', id: req.params.id })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/items — every item, across all users
export async function getAllItems(req, res, next) {
  try {
    const items = await Item.find().populate('owner', 'name email').sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}