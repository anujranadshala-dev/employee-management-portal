import LeaveRequest from '../models/leave.model.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all leave requests
// @route   GET /api/leave
export const getAllLeaveRequests = async (req, res) => {
  try {
    // In a real app, you might filter by department for managers
    const requests = await LeaveRequest.find({}).sort({ startDate: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
};

// @desc    Create a new leave request
// @route   POST /api/leave
export const createLeaveRequest = async (req, res) => {
  try {
    const newRequest = new LeaveRequest({
      ...req.body,
      id: `LR-${uuidv4().split('-')[0]}`,
      employeeId: req.user.id, // Get employee ID from authenticated user
      employeeName: req.user.name,
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error creating leave request', error: error.message });
  }
};

// @desc    Update the status of a leave request
// @route   PATCH /api/leave/:id/status
export const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }
    const updatedRequest = await LeaveRequest.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    if (!updatedRequest) return res.status(404).json({ message: 'Leave request not found' });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error updating leave request status', error: error.message });
  }
};