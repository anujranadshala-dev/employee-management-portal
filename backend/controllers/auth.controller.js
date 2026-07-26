import Employee from '../models/employee.model.js';
import jwt from 'jsonwebtoken';

// POST /api/auth/login - Authenticate a user and return a token
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = password === employee.password;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and sign a JWT
    const payload = {
      user: {
        id: employee.id,
        role: employee.role,
        name: `${employee.firstName} ${employee.lastName}`,
        isAdmin: employee.isAdmin,
        isDepartmentManager: employee.isDepartmentManager,
      },
    };

    // NOTE: Use environment variables for your JWT_SECRET and token expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, user: payload.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};