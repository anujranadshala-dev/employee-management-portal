import Employee from '../models/employee.model.js';
import Leave from '../models/leave.model.js';
import Announcement from '../models/announcement.model.js';

/**
 * @desc    Get aggregated dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Aggregate employee data
    const totalEmployees = await Employee.countDocuments();
    const employeesOnLeave = await Employee.countDocuments({ status: 'On Leave' });

    // Aggregate leave data
    const pendingLeaveRequests = await Leave.countDocuments({ status: 'Pending' });

    // Aggregate announcement data
    const totalAnnouncements = await Announcement.countDocuments();

    res.status(200).json({
      totalEmployees,
      employeesOnLeave,
      pendingLeaveRequests,
      totalAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
  }
};