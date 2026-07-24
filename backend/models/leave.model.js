import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  id: { type: String, required: true, unique: true }, // Added for consistency with frontend
  employeeName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
}, {
  timestamps: true,
  // Explicitly set the collection name to avoid ambiguity.
  // Mongoose would otherwise default to "leaves".
  collection: 'leaveRequests'
});

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;