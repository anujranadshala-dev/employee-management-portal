import Employee from '../models/employee.model.js';
import Leave from '../models/leave.model.js';
import Announcement from '../models/announcement.model.js';

/**
 * @desc    Get all statistics for the main dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // Run all database queries in parallel for better performance
    const [
      totalEmployees,
      onLeave,
      upcomingLeave,
      recentHires,
      latestAnnouncements,
      departmentCounts,
      pendingApprovals,
    ] = await Promise.all([
      Employee.countDocuments({ status: 'Active' }),
      Employee.countDocuments({ status: 'On Leave' }),
      Leave.find({
        status: 'Approved',
        endDate: { $gte: today }, // Show leave that is currently active or upcoming
      })
      .populate('employee', 'firstName lastName')
      .sort({ startDate: 'asc' })
      .limit(5),
      Employee.find({ startDate: { $gte: last30Days } })
      .sort({ startDate: 'desc' })
      .limit(5),
      Announcement.find({}).sort({ createdAt: 'desc' }).limit(3),
      Employee.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { name: '$_id', count: 1, _id: 0 } },
      ]),
      // New stat: Count pending leave requests for managers/admins
      (req.user.isDepartmentManager || req.user.isAdmin)
        ? Leave.countDocuments({ status: 'Pending' })
        : Promise.resolve(0),
    ]);


    res.status(200).json({
      totalEmployees,
      onLeave,
      upcomingLeave,
      recentHires,
      latestAnnouncements,
      departmentCounts,
      pendingApprovals,
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};