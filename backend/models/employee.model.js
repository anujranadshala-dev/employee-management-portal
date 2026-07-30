import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  id: { type: String, unique: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  joinDate: { type: Date },
  salary: { type: Number },
  performanceScore: { type: Number, min: 1, max: 5 },
  skills: [{ type: String }],
  bio: { type: String },
  notes: { type: String },
  startDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'Remote', 'On Leave', 'Suspended', 'Terminated'],
    default: 'Active',
  },
  isAdmin: { type: Boolean, default: false }, // HR Admin
  isDepartmentManager: { type: Boolean, default: false }, // Department Manager
  refreshToken: { type: String },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Combined pre-save middleware for ID generation and password hashing
employeeSchema.pre('save', async function () {
  // 1. Generate a unique ID for new documents
  if (this.isNew && !this.id) {
    this.id = `EMP-${uuidv4().split('-')[0]}`;
  }

  // 2. Hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Method to compare entered password with the hashed password in the database
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Employee', employeeSchema);