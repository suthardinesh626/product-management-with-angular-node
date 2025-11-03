const { User } = require('../models');
const { generateToken } = require('../utils/jwt.util');
const { successResponse, errorResponse } = require('../utils/response.util');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role: 'user'
    });

    const token = generateToken({ id: user.id, email: user.email });

    return successResponse(res, {
      user,
      token
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, error.message || 'Registration failed');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      return errorResponse(res, 'Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({ id: user.id, email: user.email });

    return successResponse(res, {
      user,
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, error.message || 'Login failed');
  }
};

const getProfile = async (req, res) => {
  try {
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, error.message || 'Failed to get profile');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, error.message || 'Failed to update profile');
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, error.message || 'Failed to change password');
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};

