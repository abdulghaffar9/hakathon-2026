export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found: ${req.originalUrl}`))
}

export function errorHandler(err, req, res, next) {
  // Mongoose bad ObjectId
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  }

  if (err.code === 11000) {
    statusCode = 400
    message = 'That email is already registered'
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
