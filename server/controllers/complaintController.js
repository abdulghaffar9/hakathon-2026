import mongoose from 'mongoose'
import Complaint from '../models/Complaint.js'

const activeStatuses = ['Pending', 'In Progress']
const categories = ['Road', 'Garbage', 'Water', 'Electricity', 'Other']
const statuses = ['Pending', 'In Progress', 'Resolved']

function priorityFor(complaint) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(complaint.createdAt).getTime()) / 86400000))
  const score = complaint.upvotes * days
  const priority = score > 30 ? 'Critical' : score >= 16 ? 'High' : score >= 5 ? 'Medium' : 'Low'
  return { score, priority, days }
}

function serialize(complaint) {
  const item = complaint.toObject ? complaint.toObject() : complaint
  return { ...item, ...priorityFor(item), upvoteCount: item.upvotes || 0 }
}

function validateCommon(body) {
  if (!body.title?.trim() || !body.category || !body.description?.trim() || !body.area?.trim()) {
    return 'Title, category, description and area are required'
  }
  if (!categories.includes(body.category)) return 'Invalid complaint category'
  return null
}

export async function getComplaints(req, res, next) {
  try {
    const { category, status, area, search, priority, sort = 'newest' } = req.query
    const query = {}
    if (category && categories.includes(category)) query.category = category
    if (status && statuses.includes(status)) query.status = status
    if (area) query.area = { $regex: area.trim(), $options: 'i' }
    if (search) query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { area: { $regex: search.trim(), $options: 'i' } },
    ]

    const complaints = await Complaint.find(query).populate('createdBy', 'name').sort({ createdAt: -1 })
    let result = complaints.map(serialize)
    if (priority) result = result.filter((c) => c.priority === priority)
    if (sort === 'upvotes') result.sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === 'priority') result.sort((a, b) => b.score - a.score)
    res.json(result)
  } catch (err) { next(err) }
}

export async function getMyComplaints(req, res, next) {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
    res.json(complaints.map(serialize))
  } catch (err) { next(err) }
}

export async function getComplaintById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid complaint ID' })
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email')
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' })
    res.json(serialize(complaint))
  } catch (err) { next(err) }
}

export async function createComplaint(req, res, next) {
  try {
    const validationError = validateCommon(req.body)
    if (validationError) return res.status(400).json({ message: validationError })

    const { title, category, description, area } = req.body
    const duplicate = await Complaint.find({ category, area: area.trim(), status: { $in: activeStatuses } }).sort({ createdAt: -1 }).limit(5)
    if (duplicate.length) {
      return res.status(409).json({
        message: 'A similar complaint already exists in this area. Would you like to upvote it instead?',
        duplicates: duplicate.map(serialize),
      })
    }

    const complaint = await Complaint.create({ title: title.trim(), category, description: description.trim(), area: area.trim(), createdBy: req.user._id })
    res.status(201).json(serialize(complaint))
  } catch (err) { next(err) }
}

export async function checkDuplicate(req, res, next) {
  try {
    const { category, area } = req.query
    if (!categories.includes(category) || !area?.trim()) return res.json({ duplicates: [] })
    const complaints = await Complaint.find({ category, area: area.trim(), status: { $in: activeStatuses } }).sort({ createdAt: -1 }).limit(5)
    res.json({ duplicates: complaints.map(serialize) })
  } catch (err) { next(err) }
}

export async function upvoteComplaint(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid complaint ID' })
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' })
    if (complaint.status === 'Resolved') return res.status(400).json({ message: 'Resolved complaints cannot be upvoted' })
    if (complaint.upvotedBy.some((id) => String(id) === String(req.user._id))) {
      return res.status(400).json({ message: 'You have already upvoted this complaint' })
    }
    complaint.upvotedBy.push(req.user._id)
    complaint.upvotes = complaint.upvotedBy.length
    await complaint.save()
    res.json(serialize(complaint))
  } catch (err) { next(err) }
}

export async function updateComplaintStatus(req, res, next) {
  try {
    const { status, remark = '' } = req.body
    if (!statuses.includes(status)) return res.status(400).json({ message: 'Invalid status' })
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' })
    complaint.status = status
    complaint.remark = String(remark).trim().slice(0, 500)
    if (status === 'Resolved') complaint.feedbackPending = true
    await complaint.save()
    res.json(serialize(complaint))
  } catch (err) { next(err) }
}

export async function submitFeedback(req, res, next) {
  try {
    const { rating, comment = '' } = req.body
    const numericRating = Number(rating)
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    const complaint = await Complaint.findOne({ _id: req.params.id, createdBy: req.user._id })
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' })
    if (complaint.status !== 'Resolved') return res.status(400).json({ message: 'Feedback is available after resolution' })
    if (!complaint.feedbackPending) return res.status(400).json({ message: 'Feedback has already been submitted' })

    complaint.feedback = { rating: numericRating, comment: String(comment).trim().slice(0, 500), submittedAt: new Date() }
    complaint.feedbackPending = false
    await complaint.save()
    res.json(serialize(complaint))
  } catch (err) { next(err) }
}

export async function getSatisfaction(req, res, next) {
  try {
    const resolved = await Complaint.find({ status: 'Resolved' })
    const withFeedback = resolved.filter((c) => c.feedback?.rating)
    const averageRating = withFeedback.length ? Number((withFeedback.reduce((sum, c) => sum + c.feedback.rating, 0) / withFeedback.length).toFixed(1)) : 0
    res.json({ resolvedComplaints: resolved.length, feedbackCount: withFeedback.length, averageRating })
  } catch (err) { next(err) }
}
