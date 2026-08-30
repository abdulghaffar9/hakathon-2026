import Item from '../models/Item.js'

// GET /api/items — only the logged-in user's own items
export async function getItems(req, res, next) {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
}

// POST /api/items
export async function createItem(req, res, next) {
  try {
    const { title, description } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })

    const item = await Item.create({ title, description, owner: req.user._id })
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

// PUT /api/items/:id
export async function updateItem(req, res, next) {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.user._id })
    if (!item) return res.status(404).json({ message: 'Item not found' })

    const { title, description } = req.body
    if (title !== undefined) item.title = title
    if (description !== undefined) item.description = description

    await item.save()
    res.json(item)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/items/:id
export async function deleteItem(req, res, next) {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Item deleted', id: req.params.id })
  } catch (err) {
    next(err)
  }
}
