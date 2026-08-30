// Use after `protect` — assumes req.user is already set.
export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  }