/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, CalendarRange, Megaphone, ArrowRight, Building2 } from 'lucide-react';

export default function DashboardView({ employees, leaveRequests, announcements, company, onNavigate }) {
  const activeEmployees = employees.filter((employee) => employee.status === 'Active' || employee.status === 'Remote').length;
  const pendingLeaves = leaveRequests.filter((request) => request.status === 'Pending').length;

  return (
    <div className="space-y-6" id="dashboard-root">
      <div className="rounded-2xl bg-slate-900 p-6 text-slate-100 shadow-sm">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-400">Overview</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Use this portal to keep employee records current, review leave requests, and share announcements with the team.
        </p>
        {company && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-300">
            <Building2 className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-white">{company.name}</span>
            <span>• {company.industry}</span>
            <span>• {company.location}</span>
            <span>• {company.size}</span>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Employees</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{employees.length}</p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active Staff</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{activeEmployees}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pending Leave</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{pendingLeaves}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
              <CalendarRange className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('employees')}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Employee Directory
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('leave')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Leave Requests
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('announcements')}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Announcements
              <Megaphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent announcements</h3>
            <span className="text-xs font-medium text-slate-500">{announcements.length} total</span>
          </div>
          <div className="mt-4 space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{announcement.title}</p>
                <p className="mt-1 text-xs text-slate-500">{announcement.date} · {announcement.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
