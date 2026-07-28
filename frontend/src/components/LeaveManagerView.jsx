/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CalendarRange, Plus, Check, X, Clock, Send, Users, CalendarDays, UserCheck, ClipboardList } from 'lucide-react';
import { submitLeaveRequest, updateLeaveStatus, selectMyLeaveRequests, selectPendingTeamRequests, selectTeammatesOnLeave } from '../store/slices/leaveSlice';
import { selectAuth } from '../store/slices/authSlice';

export default function LeaveManagerView() {
  const { user: session } = useSelector(selectAuth);
  const dispatch = useDispatch();

  const myRequests = useSelector(selectMyLeaveRequests);
  const pendingTeamRequests = useSelector(selectPendingTeamRequests);
  const teammatesOnLeave = useSelector(selectTeammatesOnLeave);

  const [leaveType, setLeaveType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState('history');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select start and end dates.');
      return;
    }
    dispatch(submitLeaveRequest({ leaveType, startDate, endDate, reason }));
    setStartDate('');
    setEndDate('');
    setReason('');
    setActiveTab('history'); // Switch back to history view after submission
  };

  const handleUpdateStatus = (id, status) => {
    dispatch(updateLeaveStatus({ id, status }));
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

      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          My Leave History
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'team'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Teammates on Leave
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'apply'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Plus className="h-4 w-4" />
          Apply for Leave
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        {activeTab === 'history' && (
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-slate-500" />
              My Leave History
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[60vh]">
              {myRequests.map(req => (
                <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800">{req.leaveType}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
              <UserCheck className="h-4 w-4 text-slate-500" />
              Teammates on Leave (Approved)
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[60vh]">
              {teammatesOnLeave.length > 0 ? teammatesOnLeave.map(req => (
                <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800">{req.employeeName}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-semibold text-xs text-slate-600">{req.leaveType}</div>
                </div>
              )) : (
                <p className="text-center py-8 text-slate-400 text-xs">No teammates have approved upcoming leave.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div>
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
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
        )}
      </div>

      {/* Actionable Team Requests (for Managers/Admins) */}
      {(session.isAdmin || session.isDepartmentManager) && pendingTeamRequests.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-slate-500" />
              Team Leave Requests for Approval
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[60vh]">
              {pendingTeamRequests.map(req => (
                <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800">{req.leaveType}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      <span className="font-semibold">{req?.employeeName} &middot; </span>
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full" title="Approve">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full" title="Reject">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}