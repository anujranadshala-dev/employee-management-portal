import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Terminated'],
    default: 'Active',
  },
  isAdmin: { type: Boolean, default: false }, // HR Admin
  isDepartmentManager: { type: Boolean, default: false }, // Department Manager
  // Fields from the comprehensive form modal
  salary: { type: Number },
  performanceScore: { type: Number, min: 1, max: 5 },
  joinDate: { type: Date },
  skills: { type: [String] },
  bio: { type: String },
  notes: { type: String }, // For confidential HR notes
  avatarUrl: { type: String },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;