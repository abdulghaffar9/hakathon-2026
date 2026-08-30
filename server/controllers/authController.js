import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function normalizeRole(role) {
  return role === 'admin' ? 'officer' : role === 'user' ? 'citizen' : role
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: normalizeRole(user.role) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) return res.status(400).json({ message: 'That email is already registered' })

    // Public signup is intentionally citizen-only. Officer accounts are seeded manually.
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password, role: 'citizen' })
    const token = signToken(user)
    res.status(201).json({ user: { ...user.toJSON(), role: normalizeRole(user.role) }, token })
  } catch (err) {
    next(err)
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({ user: { ...user.toJSON(), role: normalizeRole(user.role) }, token: signToken(user) })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res) {
  res.json({ user: req.user })
}
