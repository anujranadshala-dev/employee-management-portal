import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Employee from './models/employee.model.js';

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
    startDate: '2023-02-01T00:00:00.000Z',
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
    startDate: '2023-06-15T00:00:00.000Z',
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
    startDate: '2023-01-20T00:00:00.000Z',
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
    startDate: '2023-08-01T00:00:00.000Z',
  },
];

const importData = async () => {
  try {
    await Employee.deleteMany();

    // Use create to trigger the 'pre-save' middleware for password hashing
    for (const employee of seedData) {
      // Manually add a unique ID to match the schema and controller logic
      const employeeWithId = { ...employee, id: `EMP-${uuidv4().split('-')[0]}` };
      await Employee.create(employeeWithId);
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