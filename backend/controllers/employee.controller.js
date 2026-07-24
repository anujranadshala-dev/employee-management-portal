import Employee from '../models/employee.model.js';

// GET /api/employees - Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/employees - Create a new employee
export const createEmployee = async (req, res) => {
  const employee = new Employee(req.body);
  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/employees/:id - Get a single employee
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/employees/:id - Update an employee
export const updateEmployee = async (req, res) => {
  try {
    // Frontend sends updates in a 'changes' object
    const updatedEmployee = await Employee.findOneAndUpdate(
      { id: req.params.id },
      req.body.changes, // Use req.body.changes as sent by frontend
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/employees/:id - Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const result = await Employee.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};