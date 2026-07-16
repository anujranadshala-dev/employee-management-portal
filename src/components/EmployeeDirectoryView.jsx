/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Plus, SlidersHorizontal, Trash2, Edit3, ShieldAlert, Award, Phone, Mail, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { setFilters, setSearchTerm, selectEmployeeFilters } from '../store/slices/employeeSlice';

export default function EmployeeDirectoryView({
  employees,
  userRole,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) {
  const dispatch = useDispatch();
  const { searchTerm, deptFilter, statusFilter, sortField, sortOrder } = useSelector(selectEmployeeFilters);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The search term is already in the store, this button can be for explicit submission if needed
    // or we can rely on onChange. For now, it does nothing extra.
  };

  const handleSearchClear = () => {
    dispatch(setSearchTerm(''));
  };

  const handleSortChange = (field) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortField: field, sortOrder: newSortOrder }));
  };

  return (
    <div className="space-y-6" id="directory-root">
      
      {/* 1. Filter bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="search-input"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              placeholder="Search by first or last name, email, role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleSearchClear}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              id="btn-search-apply"
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
            >
              Apply Search
            </button>

            {userRole === 'Admin' && (
              <button
                type="button"
                onClick={onAddClick}
                id="btn-add-employee"
                className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" /> Add Employee
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Department select */}
            <div className="flex items-center gap-1.5 normal-case tracking-normal text-slate-600 font-semibold">
              <span>Department:</span>
              <select
                id="filter-dept"
                value={deptFilter}
                onChange={(e) => dispatch(setFilters({ deptFilter: e.target.value }))}
                className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium cursor-pointer"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Status select */}
            <div className="flex items-center gap-1.5 normal-case tracking-normal text-slate-600 font-semibold">
              <span>Status:</span>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => dispatch(setFilters({ statusFilter: e.target.value }))}
                className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Remote">Remote</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 font-normal">
            <span>Found {employees.length} records</span>
          </div>
        </div>
      </div>

      {/* Role Notice */}
      {userRole === 'Employee' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0" />
          <span><strong>Employee view:</strong> You can view the directory only.</span>
        </div>
      )}

      {/* 2. Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm space-y-2">
            <SlidersHorizontal className="h-8 w-8 mx-auto text-slate-300" />
            <p>No employee profiles matched the active query filters.</p>
          </div>
        ) : (
          employees.map(emp => (
            <div 
              key={emp.id} 
              id={`emp-card-${emp.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              
              {/* Card Header Info */}
              <div className="flex gap-4 items-start">
                {emp.avatarUrl ? (
                  <img 
                    src={emp.avatarUrl} 
                    alt={`${emp.firstName} ${emp.lastName}`}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-full object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 font-mono">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                )}
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm truncate hover:text-slate-700 cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                      {emp.firstName} {emp.lastName}
                    </h3>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {emp.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">{emp.role}</p>
                  
                  {/* Department Badge */}
                  <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md mt-1.5">
                    {emp.department}
                  </span>
                </div>

                {/* Status indicator */}
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  emp.status === 'Active' ? 'bg-emerald-500' :
                  emp.status === 'Remote' ? 'bg-indigo-500' :
                  emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-rose-500'
                }`} title={`Status: ${emp.status}`} />
              </div>

              {/* Quick Details List */}
              <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {emp.email}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {emp.phone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" /> Hired: {new Date(emp.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                {/* Salary (Visible to Admin and Manager) */}
                {userRole === 'Employee' ? (
                  <p className="flex items-center gap-1.5 text-slate-400 italic">
                    <DollarSign className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    Salary hidden
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Salary: <span className="font-mono">${emp.salary.toLocaleString()} / yr</span>
                  </p>
                )}
              </div>

              {/* Skills section */}
              {emp.skills && emp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {emp.skills.slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100">
                      {sk}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="text-[9px] font-mono text-slate-400 px-1 py-0.5">
                      +{emp.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions segment */}
              <div className="flex gap-2 pt-3 border-t border-slate-100 justify-between items-center mt-auto">
                <button
                  onClick={() => setSelectedEmployee(emp)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Full Profile
                </button>

                <div className="flex gap-1">
                  {userRole !== 'Employee' && (
                    <button
                      onClick={() => onEditClick(emp)}
                      title="Edit Profile"
                      id={`btn-edit-${emp.id}`}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}

                  {userRole === 'Admin' && (
                    <button
                      onClick={() => onDeleteClick(emp.id)}
                      title="Delete Profile"
                      id={`btn-delete-${emp.id}`}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 3. Detail popover / side-drawer modal (if selectedEmployee is open) */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {selectedEmployee.avatarUrl ? (
                  <img 
                    src={selectedEmployee.avatarUrl} 
                    alt={selectedEmployee.firstName} 
                    referrerPolicy="no-referrer"
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono">
                    {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">{selectedEmployee.role}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedEmployee.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Plus className="h-5 w-5 transform rotate-45" />
              </button>
            </div>

            {/* Profile body content */}
            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                <div>
                  <span className="text-slate-400 font-medium block">DEPARTMENT</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedEmployee.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">REGISTRY STATUS</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${
                      selectedEmployee.status === 'Active' ? 'bg-emerald-500' :
                      selectedEmployee.status === 'Remote' ? 'bg-indigo-500' :
                      selectedEmployee.status === 'On Leave' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Professional Biography</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  {selectedEmployee.bio || 'No corporate biography available for this employee.'}
                </p>
              </div>

              {/* Performance Indicator */}
              <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Award className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10 shrink-0" />
                  <span>Performance Score Rating:</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Award 
                      key={star} 
                      className={`h-4 w-4 shrink-0 ${
                        star <= selectedEmployee.performanceScore 
                          ? 'text-amber-500 fill-amber-500' 
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Skills tags list */}
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Verified Skills & Technologies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmployee.skills.map((sk, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[10px] px-2.5 py-1 rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Confidential assessment Notes */}
              {userRole !== 'Employee' && selectedEmployee.notes && (
                <div className="space-y-1.5 border-t border-slate-100 pt-4">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest block">HR Confidential Assessment Notes</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedEmployee.notes}
                  </p>
                </div>
              )}

              {/* Complete contact info */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2.5 text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Joined: {new Date(selectedEmployee.joinDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
              >
                Dismiss Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
