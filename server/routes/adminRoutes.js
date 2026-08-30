import { Router } from 'express'
import { getAllUsers, updateUserRole, deleteUser, getAllItems } from '../controllers/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'

const router = Router()

router.use(protect, requireAdmin) // every route below requires an admin

router.get('/users', getAllUsers)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/items', getAllItems)

export default router