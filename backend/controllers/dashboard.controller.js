import Employee from '../models/employee.model.js';
import Announcement from '../models/announcement.model.js';
import LeaveRequest from '../models/leave.model.js';

// @desc    Get aggregated dashboard statistics
// @route   GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const employeesOnLeave = await Employee.countDocuments({ status: 'On Leave' });
    const pendingLeaveRequests = await LeaveRequest.countDocuments({ status: 'Pending' });
    const totalAnnouncements = await Announcement.countDocuments();

    const stats = {
      totalEmployees,
      employeesOnLeave,
      pendingLeaveRequests,
      totalAnnouncements,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching dashboard statistics',
      error: error.message,
    });
  }
};