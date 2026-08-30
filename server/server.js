import path from 'path'
import { fileURLToPath } from 'url'
import profileRoutes from './routes/profileRoutes.js'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import itemRoutes from './routes/itemRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import complaintRoutes from './routes/complaintRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

await connectDB()

const app = express()

// Allow requests from your Railway frontend & local development environment
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'https://insightful-truth-production-9b04.up.railway.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean),
  credentials: true
}))

app.use(express.json({ limit: '1mb' }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/profile', profileRoutes)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/complaints', complaintRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))