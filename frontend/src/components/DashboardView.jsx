import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardStats, selectDashboardStats, selectDashboardStatus } from '../store/slices/dashboardSlice';
import { Users, Briefcase, UserPlus, CalendarOff, Megaphone, Building2, RefreshCw, DollarSign, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</div>
    </div>
  </div>
);

const CHART_COLORS = ['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];

export default function DashboardView() {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const status = useSelector(selectDashboardStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardStats());
    }
  }
  , [status, dispatch]);

  if (status === 'loading' || status === 'idle') {
    return <div className="flex items-center justify-center h-full"><RefreshCw className="h-6 w-6 text-slate-400 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6" id="dashboard-root">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Users className="h-6 w-6 text-indigo-800" />}
          title="Total Active Employees"
          value={stats.totalEmployees}
          color="bg-indigo-200"
        />
        <StatCard
          icon={<CalendarOff className="h-6 w-6 text-amber-800" />}
          title="Employees On Leave"
          value={stats.onLeave}
          color="bg-amber-200"
        />
        <StatCard
          icon={<UserPlus className="h-6 w-6 text-emerald-800" />}
          title="New Hires (Last 30 Days)"
          value={stats.recentHires?.length || 0}
          color="bg-emerald-200"
        />
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Upcoming Leave */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
            <CalendarOff className="h-4 w-4 text-slate-500" />
            Upcoming Absences ({stats.upcomingLeave?.length || 0})
          </h3>
          <div className="space-y-3">
            {stats.upcomingLeave?.length > 0 ? stats.upcomingLeave.map(leave => (
              <div key={leave.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {leave.employee?.firstName?.[0]}{leave.employee?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{leave.employee?.firstName} {leave.employee?.lastName}</p>
                    <p className="text-xs text-slate-500">{leave.leaveType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-600 font-mono">
                    {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    until {new Date(leave.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">No upcoming team absences.</p>
            )}
          </div>
        </div>

        {/* Recent Hires */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
            <UserPlus className="h-4 w-4 text-slate-500" />
            Recent Hires ({stats.recentHires?.length || 0})
          </h3>
          <div className="space-y-3">
            {stats.recentHires?.length > 0 ? stats.recentHires.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-slate-500">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-600">Joined</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {new Date(emp.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">No new hires in the last 30 days.</p>
            )}
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
            <Megaphone className="h-4 w-4 text-slate-500" />
            Latest Announcements ({stats.latestAnnouncements?.length || 0})
          </h3>
          <div className="space-y-3">
            {stats.latestAnnouncements?.length > 0 ? stats.latestAnnouncements.map(ann => (
              <div key={ann.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{ann.title}</p>
                    <p className="text-xs text-slate-500">by {ann.author}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-mono text-right">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </p>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent announcements.</p>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
            <Award className="h-4 w-4 text-slate-500" />
            Top Performers ({stats.topPerformers?.length || 0})
          </h3>
          <div className="space-y-3">
            {stats.topPerformers?.length > 0 ? stats.topPerformers.map(emp => (
              <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-slate-500">{emp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Award className="h-4 w-4" />
                  <span className="font-bold text-sm">5</span>
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">No employees with a top performance rating.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Headcount Chart */}
        <div className="lg:col-span-1 space-y-6">
          {/* Department Headcount */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-slate-500" />
              Department Headcount
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.departmentCounts} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                  <Bar dataKey="count" name="Employees">
                    {stats.departmentCounts?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Salary Expense Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-slate-500" />
            Department Salary Expense (Annual)
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats.departmentSalaries} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(value)
                  }
                />
                <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }} />
                <Bar dataKey="salary" name="Total Salary">
                  {stats.departmentSalaries?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}