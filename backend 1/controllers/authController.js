const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
const { name, email, password } = req.body;
try {
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ error: 'Email used' });
const hash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash: hash });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret');
res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
} catch (err) { res.status(500).json({ error: 'Server error' }); }
}


exports.login = async (req, res) => {
const { email, password } = req.body;
try {
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ error: 'Invalid creds' });
const ok = await user.comparePassword(password);
if (!ok) return res.status(400).json({ error: 'Invalid creds' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret');
res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
} catch (err) { res.status(500).json({ error: 'Server error' }); }
}