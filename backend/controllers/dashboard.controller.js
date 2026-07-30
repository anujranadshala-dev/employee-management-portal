import Employee from '../models/employee.model.js';
import Leave from '../models/leave.model.js';
import Announcement from '../models/announcement.model.js';

/**
 * @desc    Get aggregated statistics for the dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Employee Stats ---
    const totalEmployees = await Employee.countDocuments({ status: { $ne: 'Terminated' } });
    const onLeave = await Leave.countDocuments({
      status: 'Approved',
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    // --- Recent Hires (last 30 days) ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentHires = await Employee.find({
      joinDate: { $gte: thirtyDaysAgo },
      status: { $ne: 'Terminated' }
    }).sort({ joinDate: -1 }).limit(5);

    // --- Department Headcount ---
    const departmentCounts = await Employee.aggregate([
      { $match: { status: { $ne: 'Terminated' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: '$count' } },
      { $sort: { name: 1 } }
    ]);

    // --- Department Salary Expense ---
    const departmentSalaries = await Employee.aggregate([
      { $match: { status: { $ne: 'Terminated' } } },
      {
        $group: {
          _id: '$department',
          salary: { $sum: '$salary' }
        }
      },
      { $project: { _id: 0, name: '$_id', salary: '$salary' } },
      { $sort: { name: 1 } }
    ]);

    // --- Upcoming Leave (next 7 days) ---
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const upcomingLeave = await Leave.find({
      startDate: { $lte: sevenDaysFromNow },
      endDate: { $gte: today },
      status: 'Approved'
    }).populate('employee', 'firstName lastName').sort({ startDate: 1 }).limit(5);

    // --- Latest Announcements ---
    const latestAnnouncements = await Announcement.find().sort({ createdAt: -1 }).limit(5);

    // --- Top Performers (Performance Score of 5) ---
    const topPerformers = await Employee.find({
      performanceScore: 5,
      status: { $ne: 'Terminated' }
    }).select('id firstName lastName role').limit(5);

    res.status(200).json({
      totalEmployees,
      onLeave,
      recentHires,
      departmentCounts,
      departmentSalaries, // Added this to the response
      upcomingLeave,
      latestAnnouncements,
      topPerformers,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics.' });
  }
};