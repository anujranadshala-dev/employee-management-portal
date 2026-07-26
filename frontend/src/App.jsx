/**
 * @license
 * SPDX-License-Identifier: Apache-2.0 
 */
 
import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  NavLink,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import {
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import AppRoutes from './AppRoutes';
import LoginView from './components/LoginView';
import EmployeeFormModal from './components/EmployeeFormModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncements, postAnnouncement } from './store/slices/announcementsSlice';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee, selectAllEmployees, selectVisibleEmployees } from './store/slices/employeeSlice';
import { resetUi, openEmployeeForm, setSubmittingAnnouncement } from './store/slices/uiSlice';
import { logout, selectAuth } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user: session } = useSelector(selectAuth);

  // App Data State
  const employeesList = useSelector(selectAllEmployees);
  const visibleEmployees = useSelector(selectVisibleEmployees);

  const navigate = useNavigate();

  useEffect(() => {
    // On initial load (or after login), fetch all necessary data
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate('/');
    }
  }, [isAuthenticated, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetUi());
    navigate('/');
  };

  // CRUD Save Employee Action
  const handleSaveEmployee = async (formData, employeeId) => {
    if (!session) return false;
    try {
      const isEdit = !!employeeId;
      if (isEdit) {
        await dispatch(updateEmployee({ id: employeeId, changes: formData })).unwrap();
      }
      else {
        // Dispatch the async thunk for adding an employee
        await dispatch(addEmployee({
          ...formData,
          startDate: new Date().toISOString(), // Add current date for new employees
        })).unwrap();
      }
      return true;
    } catch (err) {
      console.error('Failed saving employee profile:', err);
      alert('An error occurred during save operations');
      return false;
    }
  };

  // CRUD Delete Employee Action
  const handleDeleteEmployee = async (id) => {
    if (!session || !session.isAdmin) { // Only Admins can delete
      alert('Unauthorized action');
      return;
    }

    if (!confirm('Are you absolutely sure you want to terminate this employee record? This action cannot be reversed.')) {
      return;
    }

    try {
      await dispatch(deleteEmployee(id)).unwrap();
    } catch (err) {
      console.error('Delete operation error:', err);
    }
  };

  // Post Corporate Memo action
  const handlePostAnnouncement = async (memoData) => {
    if (!session || (!session.isAdmin && !session.isDepartmentManager)) return; // Admins and Managers can post
    dispatch(setSubmittingAnnouncement(true));
    try {
      // The backend will handle ID, date, etc.
      await dispatch(postAnnouncement({
        author: session.name,
        ...memoData
      })).unwrap(); // .unwrap() will throw an error if the thunk is rejected
    } catch (err) {
      console.error('Error posting announcement:', err);
      alert('Failed to post announcement.');
    } finally {
      dispatch(setSubmittingAnnouncement(false));
    }
  };

  const onAddClick = () => {
    dispatch(openEmployeeForm());
  };

  const onEditClick = (emp) => {
    dispatch(openEmployeeForm({ employeeId: emp.id }));
  };

  // Render Login view if no session exists
  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Loaded Application view
  return (
    <>
      {/* The Routes component now wraps only the PortalLayout */}
      <Routes>
        <Route
          // All authenticated routes are now nested here
          path="/*"
          element={
            <PortalLayout
              session={session}
              employeesList={employeesList}
              handleLogout={handleLogout}
            >
              {/* The AppRoutes component is passed as a child to be rendered by the Outlet */}
              <AppRoutes
                visibleEmployees={visibleEmployees}
                onAddClick={onAddClick}
                onEditClick={onEditClick}
                handleDeleteEmployee={handleDeleteEmployee}
                handlePostAnnouncement={handlePostAnnouncement}
              />
            </PortalLayout>
          }
        />
      </Routes>

      {/* CREATE / EDIT DYNAMIC MODAL FORM */}
      <EmployeeFormModal
        onSave={handleSaveEmployee}
      />
    </>
  );
}

/**
 * Main application layout for authenticated users.
 * Includes the sidebar, header, and the main content area where routed views are rendered.
 */
function PortalLayout({ session, handleLogout, employeesList, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentView = location.pathname.split('/')[1] || 'dashboard';

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-left transition-colors ${
      isActive
        ? 'bg-slate-800 text-white font-medium'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `w-full text-left px-3.5 py-2.5 rounded-xl transition-all ${
      isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'
    }`;

  const activeIndicator = (isActive) => (
    <div className={`w-1 h-4 rounded-full transition-all ${isActive ? 'bg-indigo-500' : 'bg-transparent'}`} />
  );

  useEffect(() => {
    // Close mobile menu on navigation
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans select-none text-slate-900" id="portal-root">
      <div className="flex min-h-screen">
        {/* DESKTOP SIDE NAVIGATION */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 z-30">
          <div className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 ml-2 mt-2">Workspace</div>

            <NavLink to="/dashboard" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  {activeIndicator(isActive)}
                  <span className="text-xs font-semibold">Dashboard</span>
                </>
              )}
            </NavLink>

            <NavLink to="/employees" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  {activeIndicator(isActive)}
                  <span className="text-xs font-semibold">Employee Directory</span>
                </>
              )}
            </NavLink>

            <NavLink to="/leave" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  {activeIndicator(isActive)}
                  <span className="text-xs font-semibold">Leave & Absences</span>
                </>
              )}
            </NavLink>

            <NavLink to="/announcements" className={navLinkClasses}>
              {({ isActive }) => (
                <>
                  {activeIndicator(isActive)}
                  <span className="text-xs font-semibold">Announcements</span>
                </>
              )}
            </NavLink>

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

        <div className="flex-1 flex flex-col lg:ml-60 min-h-screen">
          {/* GLOBAL HEADER */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20 shadow-xs">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg">E</div>
                <span className="font-bold text-lg tracking-tight">EPICORE <span className="text-indigo-600">PORTAL</span></span>
              </div>
            </div>

            {/* Header Right Content */}
            <div className="flex items-center gap-4">
              {/* Active User profile box */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs font-mono" title={session.username}>
                  {session.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">{session.name ?? 'User'}</span>
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
                  <div className="h-7 w-7 bg-indigo-600 rounded-full text-white flex items-center justify-center text-xs font-bold" title={session.username}>
                    {session.name?.[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{session.name ?? 'User'}</span>
                    <span className="text-[9px] text-emerald-400 font-mono font-bold block">{session.role}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs font-semibold">
                  <NavLink to="/employees" className={mobileNavLinkClasses}>
                    Employee Directory
                  </NavLink>
                  <NavLink to="/leave" className={mobileNavLinkClasses}>
                    Absence Manager
                  </NavLink>
                  <NavLink to="/announcements" className={mobileNavLinkClasses}>
                    Announcements
                  </NavLink>
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
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 relative">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-200 pb-3 mb-2">
              <div>
                <span className="font-semibold text-slate-600">Employee Portal</span> &gt; <span className="capitalize text-slate-800 font-semibold">{currentView}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500">
                {employeesList.length} Corporate Records Active
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
