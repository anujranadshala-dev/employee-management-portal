/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Users, DollarSign, TrendingUp, Briefcase, Megaphone, UserCheck } from 'lucide-react';
import { selectAllEmployees } from '../store/slices/employeeSlice';
import { selectLeaveData } from '../store/slices/leaveSlice';
import { selectAnnouncements } from '../store/slices/announcementsSlice';
import { selectCompanyData, selectDashboardStats } from '../store/slices/uiSlice';

export default function DashboardView({ onNavigate }) {
  const employees = useSelector(selectAllEmployees);
  const leaveRequests = useSelector(selectLeaveData);
  const announcements = useSelector(selectAnnouncements);
  const company = useSelector(selectCompanyData);
  const stats = useSelector(selectDashboardStats);

  const statItems = [
    {
      icon: Users,
      label: 'Total Employees',
      value: stats.totalCount,
      color: 'blue',
      id: 'stat-total-employees'
    },
    {
      icon: UserCheck,
      label: 'Active Workforce',
      value: stats.activeCount,
      color: 'emerald',
      id: 'stat-active-workforce'
    },
    {
      icon: Briefcase,
      label: 'Employees on Leave',
      value: stats.onLeaveCount,
      color: 'amber',
      id: 'stat-on-leave'
    },
    {
      icon: DollarSign,
      label: 'Average Salary',
      value: `$${Math.round(stats.avgSalary).toLocaleString()}`,
      color: 'violet',
      id: 'stat-avg-salary'
    },
    {
      icon: TrendingUp,
      label: 'Avg. Performance',
      value: `${stats.avgPerformance}/5`,
      color: 'rose',
      id: 'stat-avg-performance'
    },
    {
      icon: Megaphone,
      label: 'Active Bulletins',
      value: stats.announcements,
      color: 'indigo',
      id: 'stat-active-bulletins'
    }
  ];

  return (
    <div className="space-y-6" id="dashboard-root">
      {/* Header section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart className="h-5 w-5 text-indigo-500" />
            Executive Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time metrics for company-wide payroll, headcount, and department budgets.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('employees')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors"
          >
            View Directory
          </button>
          <button
            onClick={() => onNavigate('leave')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
          >
            Manage Leave
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map(item => (
          <div key={item.label} id={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className={`p-2 rounded-lg bg-${item.color}-100 text-${item.color}-600`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{item.value}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Department Metrics Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Department Headcount & Budget</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-xs text-slate-500 uppercase font-semibold text-left">
                <th className="p-3">Department</th>
                <th className="p-3">Manager</th>
                <th className="p-3 text-center">Headcount</th>
                <th className="p-3 text-right">Avg Salary</th>
                <th className="p-3 text-right">Budget Allocation</th>
              </tr>
            </thead>
            <tbody>
              {stats.departmentMetrics.map(dept => (
                <tr key={dept.name} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">{dept.name}</td>
                  <td className="p-3 text-slate-600">{dept.manager}</td>
                  <td className="p-3 text-center font-mono font-semibold">{dept.headCount}</td>
                  <td className="p-3 text-right font-mono text-emerald-700">${Math.round(dept.avgSalary).toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-blue-700">${dept.budget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}