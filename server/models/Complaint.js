import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: ['Road', 'Garbage', 'Water', 'Electricity', 'Other'], required: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    area: { type: String, required: true, trim: true, maxlength: 120 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    remark: { type: String, trim: true, default: '' },
    upvotes: { type: Number, default: 0, min: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    feedbackPending: { type: Boolean, default: false },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true, maxlength: 500 },
      submittedAt: Date,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Complaint', complaintSchema)
