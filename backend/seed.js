import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Employee from './models/employee.model.js';
import LeaveRequest from './models/leave.model.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = [
  // 1. HR Admin
  {
    firstName: 'Alice',
    lastName: 'Admin',
    email: 'admin@epicore.com',
    password: 'password123',
    department: 'Human Resources',
    role: 'HR Director',
    isAdmin: true,
    isDepartmentManager: true,
    status: 'Active',
    startDate: '2022-01-15T00:00:00.000Z',
    phone: '+1-555-100-0001',
    dob: '1985-03-20T00:00:00.000Z',
    joinDate: '2022-01-15T00:00:00.000Z',
    salary: 120000,
    performanceScore: 5,
    skills: ['Leadership', 'HR Management', 'Recruitment', 'Conflict Resolution'],
    bio: 'Experienced HR Director with a passion for employee development.',
  },
  // 2. Department Managers
  {
    firstName: 'Bob',
    lastName: 'Manager',
    email: 'bob.manager@epicore.com',
    password: 'password123',
    department: 'Engineering',
    role: 'Engineering Manager',
    isDepartmentManager: true,
    status: 'Active',
    startDate: '2022-03-10T00:00:00.000Z',
    phone: '+1-555-100-0002',
    dob: '1980-11-05T00:00:00.000Z',
    joinDate: '2022-03-10T00:00:00.000Z',
    salary: 110000,
    performanceScore: 4,
    skills: ['Project Management', 'Software Architecture', 'Team Leadership'],
    bio: 'Results-driven Engineering Manager focused on innovation.',
  },
  {
    firstName: 'Charlie',
    lastName: 'Manager',
    email: 'charlie.manager@epicore.com',
    password: 'password123',
    department: 'Marketing',
    role: 'Marketing Lead',
    isDepartmentManager: true,
    status: 'Active',
    startDate: '2022-05-20T00:00:00.000Z',
    phone: '+1-555-100-0003',
    dob: '1988-07-12T00:00:00.000Z',
    joinDate: '2022-05-20T00:00:00.000Z',
    salary: 95000,
    performanceScore: 4,
    skills: ['Marketing Strategy', 'Digital Campaigns', 'Content Creation'],
    bio: 'Creative Marketing Lead driving brand growth and engagement.',
  },
  // 3. Employees
  // Engineering Team
  {
    firstName: 'Eve',
    lastName: 'Engineer',
    email: 'eve.engineer@epicore.com',
    password: 'password123',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    isAdmin: false,
    isDepartmentManager: false,
    status: 'Active',
    startDate: '2023-02-01T00:00:00.000Z', // joinDate will be set to this by pre-save hook
    phone: '+1-555-100-0004',
    dob: '1992-09-18T00:00:00.000Z',
    joinDate: '2023-02-01T00:00:00.000Z',
    salary: 90000,
    performanceScore: 5,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    bio: 'Passionate Senior Software Engineer building scalable applications.',
  },
  {
    firstName: 'Frank',
    lastName: 'Developer',
    email: 'frank.developer@epicore.com',
    password: 'password123',
    department: 'Engineering',
    role: 'Frontend Developer',
    isAdmin: false,
    isDepartmentManager: false,
    status: 'Active',
    startDate: '2023-06-15T00:00:00.000Z', // joinDate will be set to this by pre-save hook
    phone: '+1-555-100-0005',
    dob: '1995-01-25T00:00:00.000Z',
    joinDate: '2023-06-15T00:00:00.000Z',
    salary: 75000,
    performanceScore: 3,
    skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
    bio: 'Dedicated Frontend Developer creating engaging user interfaces.',
  },
  // Marketing Team
  {
    firstName: 'Grace',
    lastName: 'Marketer',
    email: 'grace.marketer@epicore.com',
    password: 'password123',
    department: 'Marketing',
    role: 'Content Strategist',
    isAdmin: false,
    isDepartmentManager: false,
    status: 'Active',
    startDate: '2023-01-20T00:00:00.000Z', // joinDate will be set to this by pre-save hook
    phone: '+1-555-100-0006',
    dob: '1990-04-01T00:00:00.000Z',
    joinDate: '2023-01-20T00:00:00.000Z',
    salary: 80000,
    performanceScore: 4,
    skills: ['Content Marketing', 'SEO', 'Social Media', 'Copywriting'],
    bio: 'Strategic Content Strategist crafting compelling narratives.',
  },
  {
    firstName: 'Henry',
    lastName: 'Designer',
    email: 'henry.designer@epicore.com',
    password: 'password123',
    department: 'Marketing',
    role: 'UI/UX Designer',
    isAdmin: false,
    isDepartmentManager: false,
    status: 'Active',
    startDate: '2023-08-01T00:00:00.000Z', // joinDate will be set to this by pre-save hook
    phone: '+1-555-100-0007',
    dob: '1993-12-10T00:00:00.000Z',
    joinDate: '2023-08-01T00:00:00.000Z',
    salary: 82000,
    performanceScore: 3,
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD'],
    bio: 'Creative UI/UX Designer focused on user-centric experiences.',
  },
];

const importData = async () => {
  try {
    await Employee.deleteMany();
    await LeaveRequest.deleteMany();

    // Use create to trigger the 'pre-save' middleware for password hashing
    const createdEmployees = await Employee.create(seedData);

    // --- Create a sample leave request for one of the employees ---
    const frankDeveloper = createdEmployees.find(emp => emp.email === 'frank.developer@epicore.com');
    if (frankDeveloper) {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 2); // Starts 2 days ago
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 2); // Ends 2 days from now

      await LeaveRequest.create({
        id: `LR-${uuidv4().split('-')[0]}`,
        employeeId: frankDeveloper._id,
        employeeName: `${frankDeveloper.firstName} ${frankDeveloper.lastName}`,
        department: frankDeveloper.department,
        leaveType: 'Vacation',
        startDate,
        endDate,
        reason: 'Annual vacation.',
        status: 'Approved',
      });
    }

    // The insertMany method was skipping the pre-save hook.
    console.log('Data Imported!');
    await mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Employee.deleteMany();
    await LeaveRequest.deleteMany();

    console.log('Data Destroyed!');
    await mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData();
  }
});