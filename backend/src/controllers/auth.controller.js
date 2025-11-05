import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.util.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!user.is_active) {
      return errorResponse(res, 'Account is inactive', 403);
    }

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

export const getProfile = async (req, res) => {
  try {
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, error.message || 'Failed to get profile');
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    return successResponse(res, user, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, error.message || 'Failed to update profile');
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, error.message || 'Failed to change password');
  }
};

