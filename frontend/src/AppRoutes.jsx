/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Lazy load view components for code splitting
const DashboardView = lazy(() => import('./components/DashboardView'));
const EmployeeDirectoryView = lazy(() => import('./components/EmployeeDirectoryView'));
const LeaveManagerView = lazy(() => import('./components/LeaveManagerView'));
const AnnouncementsView = lazy(() => import('./components/AnnouncementsView'));

/**
 * Defines the application's routes.
 * This component is wrapped with Suspense to handle lazy loading of route components.
 */
export default function AppRoutes({
  session,
  visibleEmployees,
  onAddClick,
  onEditClick,
  handleDeleteEmployee,
  handlePostLeave,
  handleUpdateLeave,
  handlePostAnnouncement,
}) {
  return (
    <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm"><RefreshCw className="h-6 w-6 text-slate-400 animate-spin" /></div>}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          <Routes>
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Application Routes */}
            <Route path="dashboard" element={<DashboardView />} />
            <Route
              path="employees"
              element={
                <EmployeeDirectoryView
                  employees={visibleEmployees}
                  userRole={session?.role || 'Employee'}
                  onAddClick={onAddClick}
                  onEditClick={onEditClick}
                  onDeleteClick={handleDeleteEmployee}
                />
              }
            />
            <Route
              path="leave"
              element={
                <LeaveManagerView
                  userRole={session?.role || 'Employee'}
                  employeeId={session?.employeeId}
                  department={session?.department}
                  onSubmitLeave={handlePostLeave}
                  onUpdateLeaveStatus={handleUpdateLeave}
                />
              }
            />
            <Route
              path="announcements"
              element={
                <AnnouncementsView
                  userRole={session?.role || 'Employee'}
                  onPostAnnouncement={handlePostAnnouncement}
                />
              }
            />

            {/* Catch-all route to redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}