import { Router } from 'express'
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.use(protect) // every route below requires a valid JWT

router.get('/', getItems)
router.post('/', createItem)
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)

export default router
