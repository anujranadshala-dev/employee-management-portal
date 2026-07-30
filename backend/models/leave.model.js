import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Employee' },
  employeeName: { type: String },
  startDate: { type: Date, required: true },
  leaveType: { type: String, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  department: { type: String, required: true },
  actionBy: {
    id: { type: String },
    name: { type: String },
    department: { type: String },
    isAdmin: { type: Boolean },
    isDepartmentManager: { type: Boolean },
  },
}, { timestamps: true });

// Create a virtual property `employee` that will be populated.
leaveRequestSchema.virtual('employee', {
  ref: 'Employee',
  localField: 'employeeId',
  foreignField: '_id',
  justOne: true
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema, 'leaves');

export default LeaveRequest;