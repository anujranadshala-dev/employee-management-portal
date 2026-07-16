/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { X, Save, AlertCircle } from 'lucide-react';
import { selectIsEmployeeFormOpen, selectEditingEmployeeId, closeEmployeeForm } from '../store/slices/uiSlice';
import { selectEmployeeById } from '../store/slices/employeeSlice';

export default function EmployeeFormModal({ onSave }) {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsEmployeeFormOpen);
  const editingEmployeeId = useSelector(selectEditingEmployeeId);
  const employee = useSelector((state) => selectEmployeeById(state, editingEmployeeId));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        role: employee.role,
        status: employee.status,
        salary: employee.salary,
        performanceScore: employee.performanceScore,
        joinDate: employee.joinDate,
        skillsString: employee.skills ? employee.skills.join(', ') : '',
        bio: employee.bio || '',
        notes: employee.notes || ''
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Engineering',
        role: '',
        status: 'Active',
        salary: 60000,
        performanceScore: 3,
        joinDate: new Date().toISOString().split('T')[0],
        skillsString: '',
        bio: '',
        notes: ''
      });
    }
  }, [employee, reset]);

  if (!isOpen) return null;

  const onSubmitForm = async (data) => {
    // Process comma separated skills to array
    const skills = data.skillsString
      ? data.skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload = {
      ...data,
      salary: Number(data.salary),
      performanceScore: Number(data.performanceScore),
      skills
    };

    const success = await onSave(payload, editingEmployeeId);
    if (success) {
      dispatch(closeEmployeeForm());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      
      <div 
        id="employee-form-container"
        className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in duration-200"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {employee ? 'Edit Employee Profile' : 'Register New Employee'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Please fill out all the mandatory details. Correct formats are verified.
            </p>
          </div>
          <button
            onClick={() => dispatch(closeEmployeeForm())}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">First Name *</label>
              <input
                id="form-firstName"
                type="text"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.firstName 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="Jane"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Last Name *</label>
              <input
                id="form-lastName"
                type="text"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.lastName 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="Doe"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Corporate Email *</label>
              <input
                id="form-email"
                type="email"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="jane.doe@enterprise.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid corporate email format'
                  }
                })}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Contact Phone *</label>
              <input
                id="form-phone"
                type="text"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.phone 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="+1 (555) 012-3456"
                {...register('phone', { required: 'Contact phone is required' })}
              />
              {errors.phone && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Dept & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Department *</label>
              <select
                id="form-department"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                {...register('department')}
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Corporate Role *</label>
              <input
                id="form-role"
                type="text"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.role 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="Senior Engineer"
                {...register('role', { required: 'Role description is required' })}
              />
              {errors.role && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Status & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Registry Status</label>
              <select
                id="form-status"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                {...register('status')}
              >
                <option value="Active">Active</option>
                <option value="Remote">Remote</option>
                <option value="On Leave">On Leave</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Annual Salary (USD) *</label>
              <input
                id="form-salary"
                type="number"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.salary 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                placeholder="85000"
                {...register('salary', { 
                  required: 'Salary is required',
                  min: { value: 15000, message: 'Salary must exceed $15,000' },
                  max: { value: 1000000, message: 'Salary exceeds corporate cap of $1,000,000' }
                })}
              />
              {errors.salary && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.salary.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Performance Rating *</label>
              <select
                id="form-performanceScore"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                {...register('performanceScore')}
              >
                <option value={5}>5 - Outstanding</option>
                <option value={4}>4 - Exceeds Expectations</option>
                <option value={3}>3 - Meets Expectations</option>
                <option value={2}>2 - Needs Improvement</option>
                <option value={1}>1 - Unsatisfactory</option>
              </select>
            </div>
          </div>

          {/* Row 5: Join Date & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Start Join Date *</label>
              <input
                id="form-joinDate"
                type="date"
                className={`w-full px-3.5 py-2 rounded-lg text-sm border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.joinDate 
                    ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
                {...register('joinDate', { required: 'Join date is required' })}
              />
              {errors.joinDate && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                  <AlertCircle className="h-3 w-3 shrink-0" /> {errors.joinDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Skills / Tags (comma separated)</label>
              <input
                id="form-skillsString"
                type="text"
                className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="React, TypeScript, SQL, Figma"
                {...register('skillsString')}
              />
            </div>
          </div>

          {/* Bio (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Short Bio</label>
            <textarea
              id="form-bio"
              rows={2}
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Provide a brief background statement..."
              {...register('bio')}
            />
          </div>

          {/* Notes (Optional internal HR) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Internal HR Assessment Notes</label>
            <textarea
              id="form-notes"
              rows={2}
              className="w-full px-3.5 py-2 rounded-lg text-sm border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Confidential assessment notes (only visible to HR Admin and Manager roles)..."
              {...register('notes')}
            />
          </div>

        </form>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => dispatch(closeEmployeeForm())}
            className="px-5 py-2 rounded-lg text-slate-600 hover:bg-slate-200 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit(onSubmitForm)}
            disabled={isSubmitting}
            id="btn-save-employee"
            type="button"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving changes...' : 'Save Profile'}
          </button>
        </div>

      </div>

    </div>
  );
}
