/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Seed initial employees
let employees = [
  {
    id: 'EMP-001',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@enterprise.com',
    phone: '+1 (555) 019-2834',
    department: 'Engineering',
    role: 'Engineering Director',
    status: 'Active',
    salary: 165000,
    performanceScore: 5,
    joinDate: '2021-04-12',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    skills: ['System Design', 'React', 'Node.js', 'Team Leadership', 'Cloud Architecture'],
    bio: 'Jane has over 12 years of experience leading cross-functional engineering teams. She is passionate about scalable systems and modern web technologies.',
    notes: 'Outstanding executive leadership. Key driver of the core system migration.'
  },
  {
    id: 'EMP-002',
    firstName: 'Alex',
    lastName: 'Smith',
    email: 'alex.smith@enterprise.com',
    phone: '+1 (555) 014-9382',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    status: 'Remote',
    salary: 125000,
    performanceScore: 4,
    joinDate: '2022-09-15',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Docker'],
    bio: 'Full stack developer focused on building intuitive, high-performance web applications. Open source contributor.',
    notes: 'Strong technical delivery. Highly self-motivated and proactive.'
  },
  {
    id: 'EMP-003',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@enterprise.com',
    phone: '+1 (555) 017-4839',
    department: 'Design',
    role: 'Principal Product Designer',
    status: 'Active',
    salary: 130000,
    performanceScore: 5,
    joinDate: '2020-11-01',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    bio: 'Sarah leads our product design team, ensuring cohesive user experiences across all enterprise modules.',
    notes: 'Exceptional eye for detail. Revamped the complete UI guidelines system.'
  },
  {
    id: 'EMP-004',
    firstName: 'Dwight',
    lastName: 'Schrute',
    email: 'dwight.schrute@enterprise.com',
    phone: '+1 (555) 012-7384',
    department: 'Sales',
    role: 'Senior Sales Executive',
    status: 'Active',
    salary: 82000,
    performanceScore: 4,
    joinDate: '2019-02-28',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    skills: ['Negotiation', 'B2B Sales', 'Lead Generation', 'Client Relations'],
    bio: 'Consistently the top salesperson. Specialized in agricultural enterprise clients and paper products sales.',
    notes: 'Passionate sales representative. Can be a bit over-enthusiastic about internal protocols.'
  },
  {
    id: 'EMP-005',
    firstName: 'Pam',
    lastName: 'Beesly',
    email: 'pam.beesly@enterprise.com',
    phone: '+1 (555) 013-8472',
    department: 'HR',
    role: 'HR Specialist',
    status: 'Active',
    salary: 68000,
    performanceScore: 3,
    joinDate: '2021-08-10',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    skills: ['Employee Relations', 'Conflict Resolution', 'Onboarding', 'Event Planning'],
    bio: 'Dedicated HR professional focusing on positive workplace environments, employee onboarding, and culture campaigns.',
    notes: 'Great organizer. Highly empathetic and trusted by the team.'
  },
  {
    id: 'EMP-006',
    firstName: 'Angela',
    lastName: 'Martin',
    email: 'angela.martin@enterprise.com',
    phone: '+1 (555) 016-9302',
    department: 'Finance',
    role: 'Lead Accountant',
    status: 'Active',
    salary: 92000,
    performanceScore: 4,
    joinDate: '2018-05-20',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    skills: ['Financial Audits', 'Tax Reporting', 'Compliance', 'Budget Planning'],
    bio: 'Meticulous accountant with zero tolerance for math errors or unapproved expense filings.',
    notes: 'Highly accurate financial reporting. Very strict compliance adherence.'
  },
  {
    id: 'EMP-007',
    firstName: 'Ryan',
    lastName: 'Howard',
    email: 'ryan.howard@enterprise.com',
    phone: '+1 (555) 011-8899',
    department: 'Marketing',
    role: 'Marketing Associate',
    status: 'On Leave',
    salary: 60000,
    performanceScore: 2,
    joinDate: '2023-01-10',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    skills: ['Social Media', 'Market Research', 'SEO', 'PowerPoint'],
    bio: 'Enthusiastic about tech startups and digital marketing growth loops. Keen on viral outreach projects.',
    notes: 'Performance needs tracking. Transitioned through multiple temporary positions.'
  },
  {
    id: 'EMP-008',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@enterprise.com',
    phone: '+1 (555) 019-3829',
    department: 'Finance',
    role: 'Financial Analyst',
    status: 'Remote',
    salary: 85000,
    performanceScore: 3,
    joinDate: '2022-11-15',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    skills: ['Excel Modeling', 'Predictive Analysis', 'Cost Reduction', 'Market Analytics'],
    bio: 'Marcus analyzes corporate spending and performs cost-benefit evaluations to maximize operational efficiency.',
    notes: 'Solid worker. Strong analytical skills.'
  }
];

// Seed activities
let activities = [
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
  },
  {
    id: 'ACT-004',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    actor: 'Jane Doe',
    action: 'Created new company announcement',
    target: 'Q3 Annual Health Plan Update',
    type: 'info'
  }
];

// Seed leave requests
let leaveRequests = [
  {
    id: 'LR-001',
    employeeId: 'EMP-007',
    employeeName: 'Ryan Howard',
    startDate: '2026-07-15',
    endDate: '2026-07-25',
    reason: 'Personal tech program attendance',
    status: 'Pending',
    type: 'Vacation'
  },
  {
    id: 'LR-002',
    employeeId: 'EMP-004',
    employeeName: 'Dwight Schrute',
    startDate: '2026-10-01',
    endDate: '2026-10-05',
    reason: 'Annual beet harvesting festival',
    status: 'Approved',
    type: 'Personal'
  },
  {
    id: 'LR-003',
    employeeId: 'EMP-005',
    employeeName: 'Pam Beesly',
    startDate: '2026-08-12',
    endDate: '2026-08-15',
    reason: 'Art course intensive workshop',
    status: 'Approved',
    type: 'Vacation'
  }
];

// Seed Announcements
let announcements = [
  {
    id: 'ANN-001',
    date: '2026-07-08',
    title: 'Hybrid Work Guidelines Policy Update',
    content: 'We are updating our remote status eligibility framework. Beginning next month, all departments are requested to align their off-site calendars on a quarterly basis. Ensure your status is fully updated in the employee portal directory.',
    author: 'Jane Doe',
    important: true
  },
  {
    id: 'ANN-002',
    date: '2026-07-01',
    title: 'Annual Performance Review Submissions',
    content: 'Self-assessments are now open for Q2/Q3 performance evaluations. Please complete your questionnaire before the 25th of this month. Direct managers should organize review syncs.',
    author: 'Pam Beesly',
    important: false
  }
];

// Helper to log activities
function addLog(actor, action, target, type) {
  const newLog = {
    id: `ACT-${String(activities.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    target,
    type
  };
  activities.unshift(newLog);
  if (activities.length > 50) {
    activities.pop();
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. HEALTH CHECK
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. GET ALL EMPLOYEES (with search, filter, sorting options)
  app.get('/api/employees', (req, res) => {
    let result = [...employees];
    const { search, department, status, sortField, sortOrder } = req.query;

    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(e => 
        e.firstName.toLowerCase().includes(q) || 
        e.lastName.toLowerCase().includes(q) || 
        e.email.toLowerCase().includes(q) || 
        e.role.toLowerCase().includes(q)
      );
    }

    if (department && department !== 'All') {
      result = result.filter(e => e.department === department);
    }

    if (status && status !== 'All') {
      result = result.filter(e => e.status === status);
    }

    if (sortField) {
      const field = String(sortField);
      const order = sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
        return 0;
      });
    }

    res.json(result);
  });

  // 3. GET SINGLE EMPLOYEE
  app.get('/api/employees/:id', (req, res) => {
    const emp = employees.find(e => e.id === req.params.id);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(emp);
  });

  // 4. CREATE EMPLOYEE
  app.post('/api/employees', (req, res) => {
    const data = req.body;
    
    // Server-side robust validation
    if (!data.firstName || !data.lastName || !data.email || !data.department || !data.role) {
      return res.status(400).json({ error: 'Missing mandatory fields (firstName, lastName, email, department, role)' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const emailExists = employees.some(e => e.email.toLowerCase() === data.email.toLowerCase());
    if (emailExists) {
      return res.status(400).json({ error: 'Email already assigned to an existing profile' });
    }

    // Generate neat consecutive ID
    const nextNum = Math.max(...employees.map(e => parseInt(e.id.split('-')[1] || '0')), 0) + 1;
    const newId = `EMP-${String(nextNum).padStart(3, '0')}`;

    const newEmp = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '+1 (555) 010-0000',
      department: data.department,
      role: data.role,
      status: data.status || 'Active',
      salary: Number(data.salary) || 50000,
      performanceScore: Number(data.performanceScore) || 3,
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      skills: Array.isArray(data.skills) ? data.skills : [],
      bio: data.bio || '',
      notes: data.notes || '',
      avatarUrl: data.avatarUrl || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=120`
    };

    employees.push(newEmp);
    addLog(data.actorName || 'HR Admin', 'Registered employee profile', `${newEmp.firstName} ${newEmp.lastName}`, 'create');

    res.status(201).json(newEmp);
  });

  // 5. UPDATE EMPLOYEE
  app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const idx = employees.findIndex(e => e.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    // Robust validation
    if (!data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({ error: 'Missing mandatory fields' });
    }

    const emailConflict = employees.some(e => e.id !== id && e.email.toLowerCase() === data.email.toLowerCase());
    if (emailConflict) {
      return res.status(400).json({ error: 'Email conflict with another profile' });
    }

    const currentEmp = employees[idx];

    employees[idx] = {
      ...currentEmp,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      role: data.role,
      status: data.status,
      salary: Number(data.salary) || currentEmp.salary,
      performanceScore: Number(data.performanceScore) || currentEmp.performanceScore,
      joinDate: data.joinDate,
      skills: Array.isArray(data.skills) ? data.skills : currentEmp.skills,
      bio: data.bio || '',
      notes: data.notes || ''
    };

    addLog(data.actorName || 'HR Admin', 'Updated employee details', `${employees[idx].firstName} ${employees[idx].lastName}`, 'update');

    res.json(employees[idx]);
  });

  // 6. DELETE EMPLOYEE
  app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const actorName = req.query.actorName ? String(req.query.actorName) : 'HR Admin';
    const idx = employees.findIndex(e => e.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const deleted = employees[idx];
    employees.splice(idx, 1);
    addLog(actorName, 'Terminated employee record', `${deleted.firstName} ${deleted.lastName}`, 'delete');

    res.json({ success: true, deletedId: id });
  });

  // 7. GET GENERAL COMPANY METRICS & STATISTICS
  app.get('/api/stats', (req, res) => {
    const totalCount = employees.length;
    const activeCount = employees.filter(e => e.status === 'Active' || e.status === 'Remote').length;
    const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
    
    const avgSalary = totalCount > 0 
      ? Math.round(employees.reduce((acc, e) => acc + e.salary, 0) / totalCount) 
      : 0;

    const avgPerformance = totalCount > 0 
      ? Number((employees.reduce((acc, e) => acc + e.performanceScore, 0) / totalCount).toFixed(1))
      : 0;

    // Calculate department metrics
    const depts = {
      Engineering: { count: 0, salarySum: 0, manager: 'Jane Doe', budget: 1500000 },
      Design: { count: 0, salarySum: 0, manager: 'Sarah Connor', budget: 600000 },
      Marketing: { count: 0, salarySum: 0, manager: 'Ryan Howard', budget: 400000 },
      Sales: { count: 0, salarySum: 0, manager: 'Dwight Schrute', budget: 800000 },
      HR: { count: 0, salarySum: 0, manager: 'Pam Beesly', budget: 350000 },
      Finance: { count: 0, salarySum: 0, manager: 'Angela Martin', budget: 500000 }
    };

    employees.forEach(e => {
      if (depts[e.department]) {
        depts[e.department].count += 1;
        depts[e.department].salarySum += e.salary;
      }
    });

    const departmentMetrics = Object.keys(depts).map(deptName => {
      const d = depts[deptName];
      return {
        name: deptName,
        headCount: d.count,
        manager: d.manager,
        budget: d.budget,
        avgSalary: d.count > 0 ? Math.round(d.salarySum / d.count) : 0
      };
    });

    const stats = {
      totalCount,
      activeCount,
      onLeaveCount,
      avgSalary,
      avgPerformance,
      departmentMetrics,
      recentActivities: activities.slice(0, 8)
    };

    res.json(stats);
  });

  // 8. GET LEAVE REQUESTS
  app.get('/api/leave-requests', (req, res) => {
    res.json(leaveRequests);
  });

  // 9. SUBMIT LEAVE REQUEST
  app.post('/api/leave-requests', (req, res) => {
    const data = req.body;
    if (!data.employeeId || !data.startDate || !data.endDate || !data.reason || !data.type) {
      return res.status(400).json({ error: 'Missing leave fields' });
    }

    const emp = employees.find(e => e.id === data.employeeId);
    if (!emp) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newRequest = {
      id: `LR-${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'Pending',
      type: data.type
    };

    leaveRequests.unshift(newRequest);
    addLog(`${emp.firstName} ${emp.lastName}`, 'Submitted leave request', `${data.type} Leave (${data.startDate})`, 'info');

    res.status(201).json(newRequest);
  });

  // 10. UPDATE LEAVE REQUEST STATUS (APPROVE / REJECT)
  app.patch('/api/leave-requests/:id', (req, res) => {
    const { id } = req.params;
    const { status, actorName } = req.body;
    const request = leaveRequests.find(lr => lr.id === id);

    if (!request) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (status !== 'Approved' && status !== 'Rejected') {
      return res.status(400).json({ error: 'Invalid leave request status' });
    }

    request.status = status;

    // If approved, update employee's profile status in memory
    if (status === 'Approved') {
      const empIdx = employees.findIndex(e => e.id === request.employeeId);
      if (empIdx !== -1) {
        employees[empIdx].status = 'On Leave';
      }
    }

    addLog(actorName || 'HR Admin', `${status === 'Approved' ? 'Approved' : 'Rejected'} leave request`, `For ${request.employeeName}`, 'update');

    res.json(request);
  });

  // 11. GET ANNOUNCEMENTS
  app.get('/api/announcements', (req, res) => {
    res.json(announcements);
  });

  // 12. CREATE ANNOUNCEMENT
  app.post('/api/announcements', (req, res) => {
    const { title, content, author, important } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Missing announcement fields' });
    }

    const newAnnouncement = {
      id: `ANN-${String(announcements.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      author,
      important: !!important
    };

    announcements.unshift(newAnnouncement);
    addLog(author, 'Published general announcement', title, 'info');

    res.status(201).json(newAnnouncement);
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise Server booted successfully at http://localhost:${PORT}`);
  });
}

startServer();
