import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, selectDashboardStats, selectDashboardStatus, selectDashboardError } from '../store/slices/dashboardSlice';
import { Users, CalendarRange, Megaphone, Briefcase } from 'lucide-react'; // Assuming these icons are available

const DashboardView = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const status = useSelector(selectDashboardStatus);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    // Fetch dashboard stats when the component mounts if they haven't been fetched yet
    if (status === 'idle') {
      dispatch(fetchDashboardStats());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div className="text-center py-8">Loading dashboard statistics...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center py-8 text-red-500">Error loading dashboard: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Company Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Employees</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalEmployees}</p>
          </div>
          <Users className="h-10 w-10 text-indigo-500 opacity-20" />
        </div>

        {/* Employees on Leave Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Employees on Leave</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.employeesOnLeave}</p>
          </div>
          <CalendarRange className="h-10 w-10 text-orange-500 opacity-20" />
        </div>

        {/* Pending Leave Requests Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Leave Requests</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingLeaveRequests}</p>
          </div>
          <Briefcase className="h-10 w-10 text-red-500 opacity-20" />
        </div>

        {/* Total Announcements Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Announcements</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAnnouncements}</p>
          </div>
          <Megaphone className="h-10 w-10 text-green-500 opacity-20" />
        </div>
      </div>
      {/* You can add more dashboard components here */}
    </div>
  );
};

export default DashboardView;