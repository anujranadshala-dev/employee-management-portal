/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalendarRange, ShieldCheck, Clock, Check, X, FileText, Send, UserCircle } from 'lucide-react';

export default function LeaveManagerView({
  leaveRequests,
  userRole,
  employeeId,
  onSubmitLeave,
  onUpdateLeaveStatus
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Vacation');
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert('Please fill out all request details');
      return;
    }

    setIsSubmitting(true);
    await onSubmitLeave({ startDate, endDate, reason, type });
    setIsSubmitting(false);

    setStartDate('');
    setEndDate('');
    setReason('');
    setType('Vacation');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  return (
    <div className="space-y-6" id="leave-root">
      
      {/* Upper info section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-indigo-500" />
            Leave & Absence Manager
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            File annual vacations or medical absences. Approvals instantly transition system statuses.
          </p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 font-mono font-bold">
          Current Role: {userRole}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Submit form (Left col) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Send className="h-4 w-4 text-slate-500" />
            Submit Leave Request
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Leave Classification</label>
              <select
                id="leave-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="Vacation">Annual Paid Vacation</option>
                <option value="Sick">Medical Leave (Sick)</option>
                <option value="Personal">Unpaid Personal Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Start Date</label>
                <input
                  id="leave-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">End Date</label>
                <input
                  id="leave-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason Statement</label>
              <textarea
                id="leave-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief description of the absence request..."
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                required
              />
            </div>

            {formSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                <span className="font-semibold text-[11px]">Leave request filed successfully! Pending supervisor approval.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-submit-leave"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? 'Filing leave...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Requests tracker lists (Right cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            Absence Approvals & Requests ({leaveRequests.length})
          </h3>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {leaveRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No leave requests filed yet.
              </div>
            ) : (
              leaveRequests.map(req => {
                const isPending = req.status === 'Pending';
                const canApprove = userRole !== 'Employee' && isPending;

                return (
                  <div 
                    key={req.id} 
                    id={`leave-req-${req.id}`}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                          req.type === 'Sick' ? 'bg-rose-50 text-rose-800 border-rose-100' :
                          req.type === 'Vacation' ? 'bg-indigo-50 text-indigo-800 border-indigo-100' :
                          'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          {req.type}
                        </span>
                        
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          <UserCircle className="h-4 w-4 text-slate-400 shrink-0" />
                          {req.employeeName}
                        </h4>
                        
                        <span className="text-[10px] text-slate-400 font-mono">({req.employeeId})</span>
                      </div>

                      <p className="text-xs text-slate-500 font-medium">
                        Calendar: <span className="text-slate-800 font-mono">{req.startDate}</span> to <span className="text-slate-800 font-mono">{req.endDate}</span>
                      </p>

                      <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 mt-1 italic flex items-start gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>"{req.reason}"</span>
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 w-full md:w-auto justify-end">
                      {isPending ? (
                        <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full font-semibold font-mono flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          Pending
                        </span>
                      ) : (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold font-mono flex items-center gap-1 border ${
                          req.status === 'Approved' 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                            : 'text-rose-700 bg-rose-50 border-rose-100'
                        }`}>
                          {req.status === 'Approved' ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          )}
                          {req.status}
                        </span>
                      )}

                      {canApprove && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onUpdateLeaveStatus(req.id, 'Approved')}
                            id={`btn-approve-${req.id}`}
                            title="Approve Leave"
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')}
                            id={`btn-reject-${req.id}`}
                            title="Reject Leave"
                            className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
