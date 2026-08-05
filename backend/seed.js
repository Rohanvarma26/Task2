import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';

dotenv.config();

const sampleEmployees = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@company.com',
    phone: '+91 98765 43210',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    salary: 98000,
    dateOfJoining: '2024-03-15',
    status: 'Active'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    phone: '+91 98765 43211',
    department: 'Human Resources',
    position: 'HR Manager',
    salary: 75000,
    dateOfJoining: '2023-08-01',
    status: 'Active'
  },
  {
    name: 'Amit Verma',
    email: 'amit.verma@company.com',
    phone: '+91 98765 43212',
    department: 'Marketing',
    position: 'Marketing Executive',
    salary: 62000,
    dateOfJoining: '2025-01-10',
    status: 'On Leave'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    phone: '+91 98765 43213',
    department: 'Sales',
    position: 'Sales Director',
    salary: 115000,
    dateOfJoining: '2021-11-20',
    status: 'Active'
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@company.com',
    phone: '+91 98765 43214',
    department: 'Finance',
    position: 'Senior Accountant',
    salary: 82000,
    dateOfJoining: '2022-05-14',
    status: 'Active'
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.m@company.com',
    phone: '+91 98765 43215',
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 105000,
    dateOfJoining: '2024-07-01',
    status: 'Active'
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer@company.com',
    phone: '+91 98765 43216',
    department: 'Design',
    position: 'Product Designer',
    salary: 78000,
    dateOfJoining: '2024-10-15',
    status: 'Active'
  },
  {
    name: 'Rohan Gupta',
    email: 'rohan.gupta@company.com',
    phone: '+91 98765 43217',
    department: 'Operations',
    position: 'Operations Analyst',
    salary: 70000,
    dateOfJoining: '2024-02-10',
    status: 'Inactive'
  },
  {
    name: 'Pooja Joshi',
    email: 'pooja.joshi@company.com',
    phone: '+91 98765 43218',
    department: 'Marketing',
    position: 'SEO Specialist',
    salary: 58000,
    dateOfJoining: '2025-03-01',
    status: 'Active'
  },
  {
    name: 'Aditya Sen',
    email: 'aditya.sen@company.com',
    phone: '+91 98765 43219',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 85000,
    dateOfJoining: '2025-02-15',
    status: 'Active'
  },
  {
    name: 'Neha Nair',
    email: 'neha.nair@company.com',
    phone: '+91 98765 43220',
    department: 'Sales',
    position: 'Account Executive',
    salary: 68000,
    dateOfJoining: '2023-12-05',
    status: 'On Leave'
  },
  {
    name: 'Sanjay Rao',
    email: 'sanjay.rao@company.com',
    phone: '+91 98765 43221',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 74000,
    dateOfJoining: '2024-11-01',
    status: 'Active'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employee_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to database for seeding...');

    await Employee.deleteMany({});
    console.log('Cleared existing employee records.');

    const inserted = await Employee.insertMany(sampleEmployees);
    console.log(`Successfully seeded ${inserted.length} employee records!`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
