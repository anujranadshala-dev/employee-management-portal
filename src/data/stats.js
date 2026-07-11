import { employeeSeedData } from './employees';
import { leaveRequestSeedData } from './leaveRequests';
import { announcementSeedData } from './announcements';

const departmentConfig = {
  Engineering: { manager: 'Jane Doe', budget: 1500000 },
  Design: { manager: 'Sarah Connor', budget: 600000 },
  Marketing: { manager: 'Ryan Howard', budget: 400000 },
  Sales: { manager: 'Dwight Schrute', budget: 800000 },
  HR: { manager: 'Pam Beesly', budget: 350000 },
  Finance: { manager: 'Angela Martin', budget: 500000 }
};

export function buildDashboardStats(
  employees = employeeSeedData,
  leaveRequests = leaveRequestSeedData,
  announcements = announcementSeedData
) {
  const totalCount = employees.length;
  const activeCount = employees.filter((employee) => employee.status === 'Active' || employee.status === 'Remote').length;
  const onLeaveCount = employees.filter((employee) => employee.status === 'On Leave').length;
  const avgSalary = totalCount > 0
    ? Math.round(employees.reduce((sum, employee) => sum + employee.salary, 0) / totalCount)
    : 0;
  const avgPerformance = totalCount > 0
    ? Number((employees.reduce((sum, employee) => sum + employee.performanceScore, 0) / totalCount).toFixed(1))
    : 0;

  const departmentMetrics = Object.entries(departmentConfig).map(([name, config]) => {
    const departmentEmployees = employees.filter((employee) => employee.department === name);

    return {
      name,
      headCount: departmentEmployees.length,
      manager: config.manager,
      budget: config.budget,
      avgSalary: departmentEmployees.length > 0
        ? Math.round(departmentEmployees.reduce((sum, employee) => sum + employee.salary, 0) / departmentEmployees.length)
        : 0
    };
  });

  const recentActivities = [
    {
      id: 'ACT-001',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      actor: 'Jane Doe',
      action: 'Approved vacation request',
      target: 'Ryan Howard',
      type: 'update'
    },
    {
      id: 'ACT-002',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      actor: 'Pam Beesly',
      action: 'Onboarded new employee profile',
      target: 'Marcus Vance',
      type: 'create'
    },
    {
      id: 'ACT-003',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      actor: 'Angela Martin',
      action: 'Updated quarterly payroll audit',
      target: 'Finance Dept',
      type: 'info'
    }
  ];

  return {
    totalCount,
    activeCount,
    onLeaveCount,
    avgSalary,
    avgPerformance,
    departmentMetrics,
    recentActivities,
    pendingLeave: leaveRequests.filter((request) => request.status === 'Pending').length,
    announcements: announcements.length
  };
}

export const dashboardStatsSeedData = buildDashboardStats();
