/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  CalendarRange, 
  Megaphone, 
  Terminal, 
  LogOut, 
  UserCheck, 
  Menu, 
  X,
  Lock,
  RefreshCw
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import EmployeeDirectoryView from './components/EmployeeDirectoryView';
import EmployeeFormModal from './components/EmployeeFormModal';
import LeaveManagerView from './components/LeaveManagerView';
import AnnouncementsView from './components/AnnouncementsView';
import TestRunnerView from './components/TestRunnerView';
import { employeeSeedData } from './data/employees';
import { leaveRequestSeedData } from './data/leaveRequests';
import { announcementSeedData } from './data/announcements';
import { dashboardStatsSeedData } from './data/stats';

export default function App() {
  // Authentication & Session
  const [session, setSession] = useState(null);

  // Views Navigation
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Data State
  const [employees, setEmployees] = useState(employeeSeedData);
  const [stats, setStats] = useState(dashboardStatsSeedData);
  const [leaveRequests, setLeaveRequests] = useState(leaveRequestSeedData);
  const [announcements, setAnnouncements] = useState(announcementSeedData);

  // Directory filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Loading & Modals
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Sync / Reset local state data handler
  const handleSyncData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const visibleEmployees = useMemo(() => {
    return [...employees]
      .filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm.toLowerCase());
        const matchesDepartment = deptFilter === 'All' || employee.department === deptFilter;
        const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
        return matchesSearch && matchesDepartment && matchesStatus;
      })
      .sort((a, b) => {
        const direction = sortOrder === 'asc' ? 1 : -1;
        const aValue = a[sortField] ?? '';
        const bValue = b[sortField] ?? '';
        return aValue > bValue ? direction : aValue < bValue ? -direction : 0;
      });
  }, [employees, searchTerm, deptFilter, statusFilter, sortField, sortOrder]);

  useEffect(() => {
    setEmployees(employeeSeedData);
    setLeaveRequests(leaveRequestSeedData);
    setAnnouncements(announcementSeedData);
    setStats(dashboardStatsSeedData);
  }, []);

  // Login Simulator handler
  const handleLogin = (role) => {
    const defaultUser = {
      username: role === 'Admin' ? 'Jane Doe' : role === 'Manager' ? 'Sarah Connor' : 'Alex Smith',
      role,
      employeeId: role === 'Admin' ? 'EMP-001' : role === 'Manager' ? 'EMP-003' : 'EMP-002',
      department: role === 'Admin' ? 'Engineering' : role === 'Manager' ? 'Design' : 'Engineering'
    };
    setSession(defaultUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setSession(null);
    setEmployees(employeeSeedData);
    setStats(dashboardStatsSeedData);
    setLeaveRequests(leaveRequestSeedData);
    setAnnouncements(announcementSeedData);
  };

  // CRUD Save Employee Action
  const handleSaveEmployee = async (formData) => {
    if (!session) return false;
    try {
      const isEdit = !!editingEmployee;
      setEmployees((prevEmployees) => {
        if (isEdit) {
          return prevEmployees.map((employee) => employee.id === editingEmployee.id ? { ...employee, ...formData } : employee);
        }

        return [{ ...formData, id: `EMP-${String(prevEmployees.length + 1).padStart(3, '0')}` }, ...prevEmployees];
      });
      setEditingEmployee(null);
      setIsFormOpen(false);
      return true;
    } catch (err) {
      console.error('Failed saving employee profile:', err);
      alert('An error occurred during save operations');
      return false;
    }
  };

  // CRUD Delete Employee Action
  const handleDeleteEmployee = async (id) => {
    if (!session || session.role !== 'Admin') {
      alert('Unauthorized action');
      return;
    }

    if (!confirm('Are you absolutely sure you want to terminate this employee record? This action cannot be reversed.')) {
      return;
    }

    try {
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
    } catch (err) {
      console.error('Delete operation error:', err);
    }
  };

  // Submit Leave request action
  const handlePostLeave = async (leaveData) => {
    if (!session) return;
    try {
      const newLeaveRequest = {
        id: `LR-${String(leaveRequests.length + 1).padStart(3, '0')}`,
        employeeId: session.employeeId,
        employeeName: session.username,
        ...leaveData,
        status: 'Pending'
      };

      setLeaveRequests((prevLeaveRequests) => [newLeaveRequest, ...prevLeaveRequests]);
    } catch (err) {
      console.error('Leave submit error:', err);
    }
  };

  // Approve / Reject Leave Request action
  const handleUpdateLeave = async (id, status) => {
    if (!session || session.role === 'Employee') return;
    try {
      setLeaveRequests((prevLeaveRequests) => prevLeaveRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      ));
    } catch (err) {
      console.error('Error updating leave status:', err);
    }
  };

  // Post Corporate Memo action
  const handlePostAnnouncement = async (memoData) => {
    if (!session || session.role === 'Employee') return;
    try {
      const newAnnouncement = {
        id: `ANN-${String(announcements.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().slice(0, 10),
        author: session.username,
        ...memoData
      };

      setAnnouncements((prevAnnouncements) => [newAnnouncement, ...prevAnnouncements]);
    } catch (err) {
      console.error('Error posting announcement:', err);
    }
  };

  const onAddClick = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const onEditClick = (emp) => {
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  // Multi-column sorting trigger
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Simulated Custom Route Guard view mapper
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView stats={stats} onNavigate={setCurrentView} />;
      case 'employees':
        return (
          <EmployeeDirectoryView
            employees={visibleEmployees}
            userRole={session?.role || 'Employee'}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            onDeleteClick={handleDeleteEmployee}
            onSearchChange={setSearchTerm}
            onDeptFilterChange={setDeptFilter}
            onStatusFilterChange={setStatusFilter}
            onSortChange={handleSortChange}
            currentSortField={sortField}
            currentSortOrder={sortOrder}
          />
        );
      case 'leave':
        return (
          <LeaveManagerView
            leaveRequests={leaveRequests}
            userRole={session?.role || 'Employee'}
            employeeId={session?.employeeId}
            onSubmitLeave={handlePostLeave}
            onUpdateLeaveStatus={handleUpdateLeave}
          />
        );
      case 'announcements':
        return (
          <AnnouncementsView
            announcements={announcements}
            userRole={session?.role || 'Employee'}
            onPostAnnouncement={handlePostAnnouncement}
          />
        );
      case 'tests':
        return <TestRunnerView />;
      default:
        return <DashboardView stats={stats} onNavigate={setCurrentView} />;
    }
  };

  // Render Login view if no session exists
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          id="login-container"
          className="bg-white w-full max-w-md rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-2xl text-white shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Portal</h2>
              <p className="text-xs text-slate-500 font-medium font-mono">Employee Directory Command</p>
            </div>
          </div>

          <div className="space-y-2 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800 text-sm">Role-Based Authentication</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Authenticate via simulation roles. Custom route guards, directory controls, and payroll scopes are configured differently for each credential tier.
            </p>
          </div>

          <div className="space-y-3">
            {/* Admin trigger */}
            <button
              onClick={() => handleLogin('Admin')}
              id="login-as-admin"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-100 transition-colors">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">HR Admin</span>
                  <span className="text-slate-500 text-xs mt-0.5 block">Full CRUD, payroll audits, employee terminations</span>
                </div>
              </div>
              <Lock className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            </button>

            {/* Manager trigger */}
            <button
              onClick={() => handleLogin('Manager')}
              id="login-as-manager"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Department Manager</span>
                  <span className="text-slate-500 text-xs mt-0.5 block">Profile editing, leave approvals, performance ratings</span>
                </div>
              </div>
              <Lock className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            </button>

            {/* Employee trigger */}
            <button
              onClick={() => handleLogin('Employee')}
              id="login-as-employee"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex gap-3.5 items-center">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl group-hover:bg-slate-200 transition-colors">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Standard Employee</span>
                  <span className="text-slate-500 text-xs mt-0.5 block">Read-only directory, self profile, leave request filings</span>
                </div>
              </div>
              <Lock className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-mono">
            Secure simulation sandbox Environment
          </p>
        </motion.div>
      </div>
    );
  }

  // Loaded Application view
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none text-slate-900" id="portal-root">
      
      {/* GLOBAL HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg">E</div>
            <span className="font-bold text-lg tracking-tight">EPICORE <span className="text-indigo-600">PORTAL</span></span>
          </div>
          
          {/* Desktop Horizontal View Switcher */}
          <nav className="hidden lg:flex gap-6 h-16">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`text-xs font-bold px-1 h-16 flex items-center border-b-2 transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('employees')}
              className={`text-xs font-bold px-1 h-16 flex items-center border-b-2 transition-all cursor-pointer ${
                currentView === 'employees'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              Directory
            </button>
            <button
              onClick={() => setCurrentView('leave')}
              className={`text-xs font-bold px-1 h-16 flex items-center border-b-2 transition-all cursor-pointer ${
                currentView === 'leave'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              Payroll & Absences
            </button>
            <button
              onClick={() => setCurrentView('announcements')}
              className={`text-xs font-bold px-1 h-16 flex items-center border-b-2 transition-all cursor-pointer ${
                currentView === 'announcements'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              Communications
            </button>
            <button
              onClick={() => setCurrentView('tests')}
              className={`text-xs font-bold px-1 h-16 flex items-center border-b-2 transition-all cursor-pointer ${
                currentView === 'tests'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              Test Suites
            </button>
          </nav>
        </div>

        {/* Header Right Content */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSyncData}
            title="Synchronize Metrics"
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-semibold text-slate-600 hidden md:inline">Sync Portal</span>
          </button>

          {/* Active User profile box */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs font-mono">
              {session.username.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">{session.username}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold block font-mono leading-none mt-0.5">{session.role}</span>
            </div>
          </div>

          {/* Mobile burger button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* BODY WRAPPER */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* DESKTOP SIDE NAVIGATION */}
        <aside className="hidden lg:flex flex-col w-60 bg-slate-900 text-slate-300 flex-shrink-0 border-r border-slate-800">
          <div className="p-4 flex flex-col gap-1.5 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ml-2 mt-2">Management</div>
            
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-1 h-4 rounded-full transition-all ${currentView === 'dashboard' ? 'bg-indigo-500' : 'bg-transparent'}`} />
              <span className="text-xs font-semibold">Dashboard Control</span>
            </button>

            <button
              onClick={() => setCurrentView('employees')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left transition-colors ${
                currentView === 'employees'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-1 h-4 rounded-full transition-all ${currentView === 'employees' ? 'bg-indigo-500' : 'bg-transparent'}`} />
              <span className="text-xs font-semibold">Employee Directory</span>
            </button>

            <button
              onClick={() => setCurrentView('leave')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left transition-colors ${
                currentView === 'leave'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-1 h-4 rounded-full transition-all ${currentView === 'leave' ? 'bg-indigo-500' : 'bg-transparent'}`} />
              <span className="text-xs font-semibold">Leave & Absences</span>
            </button>

            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-6 mb-2 ml-2">Administration</div>

            <button
              onClick={() => setCurrentView('announcements')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left transition-colors ${
                currentView === 'announcements'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-1 h-4 rounded-full transition-all ${currentView === 'announcements' ? 'bg-indigo-500' : 'bg-transparent'}`} />
              <span className="text-xs font-semibold">Corporate Memos</span>
            </button>

            <button
              onClick={() => setCurrentView('tests')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left transition-colors ${
                currentView === 'tests'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-1 h-4 rounded-full transition-all ${currentView === 'tests' ? 'bg-indigo-500' : 'bg-transparent'}`} />
              <span className="text-xs font-semibold">Vitest Test Suite</span>
            </button>

            {/* Logout button */}
            <div className="mt-auto pt-4 border-t border-slate-800/80">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-md cursor-pointer transition-colors text-xs font-semibold"
              >
                <div className="w-1 h-4 bg-transparent" />
                <LogOut className="h-4 w-4" />
                Logout Session
              </button>
            </div>
          </div>

          {/* System status widget */}
          <div className="p-4 bg-slate-950/40 border-t border-slate-800/50">
            <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-900/50">
              <div className="text-xs text-indigo-300 font-bold mb-1 font-mono uppercase tracking-wider text-[10px]">System Health</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] text-indigo-200 font-semibold font-mono">All REST APIs operational</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-slate-900 text-slate-300 border-b border-slate-800 px-6 py-4 space-y-3 z-10 relative"
            >
              <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl mb-2">
                <div className="h-7 w-7 bg-indigo-600 rounded-full text-white flex items-center justify-center text-xs font-bold">
                  {session.username[0]}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{session.username}</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold block">{session.role}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs font-semibold">
                <button
                  onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setCurrentView('employees'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${currentView === 'employees' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Employee Directory
                </button>
                <button
                  onClick={() => { setCurrentView('leave'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${currentView === 'leave' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Absence Manager
                </button>
                <button
                  onClick={() => { setCurrentView('announcements'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${currentView === 'announcements' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Announcements
                </button>
                <button
                  onClick={() => { setCurrentView('tests'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${currentView === 'tests' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Vitest Test Suite
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-955/20"
                >
                  Logout Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRIMARY CONTENT PANEL */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-200 pb-3 mb-2">
            <div>
              <span className="font-semibold text-slate-600">Enterprise Shell</span> &gt; <span className="capitalize text-slate-800 font-semibold">{currentView === 'leave' ? 'Absences' : currentView === 'tests' ? 'Vitest' : currentView}</span>
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              {employees.length} Corporate Records Active
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

      {/* CREATE / EDIT DYNAMIC MODAL FORM */}
      <EmployeeFormModal
        employee={editingEmployee}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
      />

    </div>
  );
}
