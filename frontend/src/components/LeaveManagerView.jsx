/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CalendarRange, Plus, Check, X, Clock, Send, UserCheck, ClipboardList, Loader2 } from 'lucide-react';
import { submitLeaveRequest, updateLeaveStatus, fetchLeaveRequests, selectMyLeaveRequests, selectPendingTeamRequests, selectTeammatesOnLeave } from '../store/slices/leaveSlice';
import { selectAuth } from '../store/slices/authSlice';

export default function LeaveManagerView() {
  const { user: session } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const myRequests = useSelector(selectMyLeaveRequests);
  const leaveStatus = useSelector(state => state.leave.status);
  const pendingTeamRequests = useSelector(selectPendingTeamRequests);
  const teammatesOnLeave = useSelector(selectTeammatesOnLeave);

  const [leaveType, setLeaveType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState('myHistory'); // Renamed for clarity

  useEffect(() => {
    // Fetch data only if it hasn't been fetched or has failed
    if (leaveStatus === 'idle' || leaveStatus === 'failed') {
      dispatch(fetchLeaveRequests());
    }
  }, [leaveStatus, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please select start and end dates.');
      return;
    }
    dispatch(submitLeaveRequest({ leaveType, startDate, endDate, reason }));
    setStartDate('');
    setEndDate('');
    setReason(''); // Clear reason after submission
    setActiveTab('myHistory'); // Switch back to history view after submission
  };

  const handleUpdateStatus = (id, status) => {
    // The user object is available as `session` in this component's scope.
    const actionBy = {
      id: session.id,
      name: session.name,
      department: session.department,
      isAdmin: session.isAdmin,
      isDepartmentManager: session.isDepartmentManager,
    };
    dispatch(updateLeaveStatus({ id, status, actionBy }));
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

  const isLoading = leaveStatus === 'loading' || leaveStatus === 'idle';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    );
  }
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
          onClick={() => setActiveTab('myHistory')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'myHistory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          My Requests
        </button>
        <button
          onClick={() => setActiveTab('teamRequests')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'teamRequests'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Team Requests
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
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]"> {/* Added min-h for consistent layout */}
        {activeTab === 'myHistory' && (
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
                    {req.reason && (
                      <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">{req.reason}</p>
                    )}
                    {req.status !== 'Pending' && req.actionBy && (
                      <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-200 font-semibold">
                        Action by: {req.actionBy.name} (
                        {req.actionBy.isAdmin ? 'Admin' : ''}
                        {req.actionBy.isAdmin && req.actionBy.isDepartmentManager ? ', ' : ''}
                        {!req.actionBy.isAdmin && req.actionBy.isDepartmentManager ? 'Department Manager' : ''}
                        {(!req.actionBy.isAdmin && !req.actionBy.isDepartmentManager) ? 'Employee' : ''}
                        , {req.actionBy.department})
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'teamRequests' && (
          <div>
            {(session.isAdmin || session.isDepartmentManager) && (
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
                  <ClipboardList className="h-4 w-4 text-slate-500" />
                  Pending Team Leave Requests
                </h3>
                <div className="space-y-3 overflow-y-auto max-h-[30vh]"> {/* Reduced max-h to accommodate other sections */}
                  {pendingTeamRequests.length > 0 ? pendingTeamRequests.map(req => (
                    <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-800">{req.leaveType}</div>
                        <div className="text-xs text-slate-500 font-medium">{req.employeeName} ({req.department})</div>
                        <div className="text-xs text-slate-500 font-mono">
                          <span className="font-semibold">{req?.employeeName} &middot; </span>
                          {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                        </div>
                        {req.reason && (
                          <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">{req.reason}</p>
                        )}
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
                  )) : (
                    <p className="text-center py-8 text-slate-400 text-xs">No pending leave requests from your team.</p>
                  )}
                </div>
              </div>
            )}

            {/* Teammates on Leave (Approved) - still useful to see who is out */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2 mb-4">
                <UserCheck className="h-4 w-4 text-slate-500" />
                Teammates Currently on Leave
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[30vh]">
                {teammatesOnLeave.length > 0 ? teammatesOnLeave.map(req => (
                  <div key={req.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-800">{req.employeeName}</div>
                      <div className="text-xs text-slate-500 font-medium">{req.department}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </div>
                      {req.reason && (
                        <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">{req.reason}</p>
                      )}
                    </div>
                    <div className="font-semibold text-xs text-slate-600">{req.leaveType}</div>
                  </div>
                )) : (
                  <p className="text-center py-8 text-slate-400 text-xs">No teammates have approved upcoming leave.</p>
                )}
              </div>
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
    </div>
  );
}