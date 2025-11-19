const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async function(req, res, next) {
const auth = req.header('Authorization');
if (!auth) return res.status(401).json({ error: 'No token' });
const token = auth.replace('Bearer ', '');
try {
const data = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
req.user = await User.findById(data.id).select('-passwordHash');
if (!req.user) return res.status(401).json({ error: 'Invalid user' });
next();
} catch (err) {
res.status(401).json({ error: 'Invalid token' });
}
}