// Use after `protect` — assumes req.user is already set.
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export function requireOfficer(req, res, next) {
  if (req.user?.role !== 'officer') {
    return res.status(403).json({ message: 'Officer access required' })
  }
  next()
}
