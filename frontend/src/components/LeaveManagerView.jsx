/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CalendarRange, Plus, Check, X, Clock, Send, Users } from 'lucide-react';
import { selectLeaveData } from '../store/slices/leaveSlice';
import { selectAllEmployees } from '../store/slices/employeeSlice';

export default function LeaveManagerView({ userRole, employeeId, department, onSubmitLeave, onUpdateLeaveStatus }) {
  const leaveRequests = useSelector(selectLeaveData);
  const allEmployees = useSelector(selectAllEmployees);
  const [leaveType, setLeaveType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const myRequests = useMemo(() => {
    return leaveRequests.filter(req => req.employeeId === employeeId);
  }, [leaveRequests, employeeId]);

  const teamRequests = useMemo(() => {
    return leaveRequests.filter(req => req.employeeId !== employeeId);
  }, [leaveRequests]);

  const upcomingTeamLeave = useMemo(() => {
    const employeesInDept = allEmployees
      .filter(emp => emp.department === department && emp.id !== employeeId)
      .map(emp => emp.id);

    return leaveRequests.filter(req =>
      req.status === 'Approved' && employeesInDept.includes(req.employeeId)
    );
  }, [leaveRequests, allEmployees, department, employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select start and end dates.');
      return;
    }
    await onSubmitLeave({ leaveType, startDate, endDate, reason });
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Approved: 'bg-emerald-100 text-emerald-800',
      Rejected: 'bg-rose-100 text-rose-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6" id="leave-manager-root">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-indigo-500" />
          Leave & Absence Manager
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Submit new leave requests or manage pending team requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Request Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plus className="h-4 w-4 text-slate-500" />
            New Leave Request
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option>Vacation</option>
                <option>Sick Leave</option>
                <option>Personal</option>
                <option>Unpaid</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 uppercase tracking-wider">Reason (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Briefly explain the reason for your absence..."
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50" >
              <Send className="h-3.5 w-3.5" />
              Submit Request
            </button>
          </form>
        </div>

        {/* My Leave History */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            My Leave History
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {myRequests.map(req => (
              <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800">{req.leaveType}</div>
                  <div className="text-xs text-slate-500">
                    {userRole !== 'Employee' && <span className="font-semibold">{req.employeeName} &middot; </span>}
                    {req.startDate} to {req.endDate}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={req.status} />
                  {userRole !== 'Employee' && req.status === 'Pending' && req.employeeId !== employeeId && (
                    <div className="flex gap-2">
                      <button onClick={() => onUpdateLeaveStatus(req.id, 'Approved')} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')} className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Team Leave */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            Upcoming Team Leave
          </h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {upcomingTeamLeave.length > 0 ? upcomingTeamLeave.map(req => (
              <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-800">{req.employeeName}</div>
                  <div className="text-xs text-slate-500">
                    {req.startDate} to {req.endDate}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={req.status} />
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No approved upcoming leave for your teammates.
              </div>
            )}
          </div>
        </div>

        {/* Team Requests (for Managers/Admins) */}
        {userRole !== 'Employee' && (
          <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Team Leave Requests
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {teamRequests.map(req => (
                <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800">{req.leaveType}</div>
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold">{req.employeeName} &middot; </span>
                      {req.startDate} to {req.endDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                    {req.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => onUpdateLeaveStatus(req.id, 'Approved')} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')} className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}