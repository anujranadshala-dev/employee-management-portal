import Leave from '../models/leave.model.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/leave - Get all leave requests
export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await Leave.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/leave - Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const newLeaveRequest = new Leave({
      ...req.body,
      id: `LR-${uuidv4().split('-')[0]}`, // Generate a unique ID
      status: 'Pending', // Ensure default status is set
    });
    await newLeaveRequest.save();
    res.status(201).json(newLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/leave/:id - Update leave request status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedLeave = await Leave.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedLeave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    res.status(200).json(updatedLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};