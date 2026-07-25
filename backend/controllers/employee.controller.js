import Employee from '../models/employee.model.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Get all employees
// @route   GET /api/employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
};

// @desc    Create a new employee
// @route   POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee({
      ...req.body,
      id: `EMP-${uuidv4().split('-')[0]}`, // Generate a shorter, unique ID
    });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee', error: error.message });
  }
};

// @desc    Update an employee
// @route   PATCH /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findOneAndUpdate({ id: id }, req.body, {
      new: true, // Return the updated document
      runValidators: true,
    });
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findOneAndDelete({ id: id });
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(204).send(); // 204 No Content is a standard response for a successful delete
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};