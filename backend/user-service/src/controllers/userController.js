import User from '../models/User.js';
import { generateToken } from '../services/authService.js';
import { info, error } from '../../../common/utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = await User.create({ name, email, password, role, status: role==='customer'? 'Active':'Pending' });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, role: user.role } });
  } catch (err) {
    error(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.status !== 'Active') {
      return res.status(403).json({ message: `Your account is ${user.status}` });
    }
    res.json({ token: generateToken(user), user: { id: user._id, role: user.role } });
  } catch (err) {
    error(err);
    next(err);
  }
};

export const getMe = (_req, res) => {
  res.json({ user: { id: _req.user.id, role: _req.user.role } });
};
