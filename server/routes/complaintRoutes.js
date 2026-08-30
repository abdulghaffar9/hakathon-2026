import { Router } from 'express'
import {
  getComplaints, getMyComplaints, getComplaintById, createComplaint,
  upvoteComplaint, checkDuplicate, updateComplaintStatus, submitFeedback, getSatisfaction,
} from '../controllers/complaintController.js'
import { protect } from '../middleware/authMiddleware.js'
import { requireOfficer } from '../middleware/adminMiddleware.js'

const router = Router()

router.get('/', getComplaints)
router.get('/check-duplicate', checkDuplicate)
router.get('/my', protect, getMyComplaints)
router.get('/officer/satisfaction', protect, requireOfficer, getSatisfaction)
router.get('/:id', getComplaintById)
router.post('/', protect, createComplaint)
router.post('/:id/upvote', protect, upvoteComplaint)
router.patch('/:id/status', protect, requireOfficer, updateComplaintStatus)
router.post('/:id/feedback', protect, submitFeedback)

export default router
