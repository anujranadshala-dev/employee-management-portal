/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Building2, Landmark, Star, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function DashboardView({ stats, onNavigate }) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // Find department with maximum headCount for scaling the bar chart
  const maxHeadCount = Math.max(...stats.departmentMetrics.map(d => d.headCount), 1);

  return (
    <div className="space-y-8" id="dashboard-root">
      
      {/* 1. Header Hero section */}
      <div className="bg-slate-900 text-slate-100 p-8 rounded-2xl relative overflow-hidden shadow-sm border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-indigo-900/30 to-transparent opacity-50 -mr-20 -mt-20 pointer-events-none rounded-full" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            System Operational
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
            Enterprise Directory Command
          </h1>
          <p className="text-slate-300 mt-2 text-sm leading-relaxed max-w-xl">
            Welcome back. Monitor corporate departments, manage employee profile records, and view automated unit test coverages through the control panel.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('employees')}
              id="dash-quick-directory"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              Manage Employees
              <ArrowUpRight className="h-3 w-3" />
            </button>
            <button
              onClick={() => onNavigate('tests')}
              id="dash-quick-tests"
              className="px-4 py-2 bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              Verify Vitest Suite
              <TrendingUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total headcount */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter block">Total Headcount</span>
            <div className="text-3xl font-bold text-slate-900 font-mono">{stats.totalCount}</div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              +1.2% this quarter
            </p>
          </div>
          <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Active staff */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter block">Active Staff</span>
            <div className="text-3xl font-bold text-slate-900 font-mono">{stats.activeCount}</div>
            <p className="text-[10px] text-slate-400 font-medium">
              {stats.totalCount > 0 ? Math.round((stats.activeCount / stats.totalCount) * 100) : 0}% on-site/remote
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
        </div>

        {/* Average Annual Payroll */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter block">Avg Annual Salary</span>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              ${stats.avgSalary.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Exceeding industry avg
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
            <Landmark className="h-5 w-5 text-amber-600" />
          </div>
        </div>

        {/* Average Performance Evaluation Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter block">Avg Performance</span>
            <div className="text-3xl font-bold text-slate-900 font-mono flex items-baseline gap-1">
              {stats.avgPerformance}
              <span className="text-xs text-slate-400 font-normal font-sans">/ 5.0</span>
            </div>
            <p className="text-[10px] text-indigo-600 font-bold">
              Outstanding rating index
            </p>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100">
            <Star className="h-5 w-5 text-rose-500 fill-rose-500/10" />
          </div>
        </div>

      </div>

      {/* 3. Bottom charts and activity log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department headcount distribution chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Department Allocations</h3>
              <p className="text-xs text-slate-500">Employee headcount by functional department</p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
              Real-time counts
            </span>
          </div>

          {/* Elegant SVG bar chart */}
          <div className="space-y-4">
            {stats.departmentMetrics.map(dept => {
              const percentage = (dept.headCount / maxHeadCount) * 100;
              return (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{dept.name}</span>
                    <span className="font-mono text-slate-500 flex items-center gap-2">
                      <span>{dept.headCount} {dept.headCount === 1 ? 'member' : 'members'}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-400 font-medium">Avg: ${dept.avgSalary.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit / Activities feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Audit Trail</h3>
              <p className="text-xs text-slate-500">Latest administrative security & profile actions</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {stats.recentActivities.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent administrative actions logged.
              </div>
            ) : (
              stats.recentActivities.map(act => {
                let badgeColor = 'bg-slate-100 text-slate-800';
                if (act.type === 'create') badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                if (act.type === 'update') badgeColor = 'bg-blue-50 text-blue-800 border-blue-100';
                if (act.type === 'delete') badgeColor = 'bg-rose-50 text-rose-800 border-rose-100';

                return (
                  <div key={act.id} className="flex gap-3 text-xs items-start">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${badgeColor} shrink-0`}>
                      {act.type}
                    </span>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-slate-700 leading-tight">
                        <span className="font-semibold text-slate-900">{act.actor}</span> {act.action}{' '}
                        <span className="font-medium text-slate-900 truncate block sm:inline">{act.target}</span>
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
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
