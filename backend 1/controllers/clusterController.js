const Cluster = require('../models/Cluster');


exports.createCluster = async (req, res) => {
const { name } = req.body;
try {
const cluster = await Cluster.create({ name, owner: req.user._id, members: [req.user._id] });
res.json(cluster);
} catch (err) { res.status(500).json({ error: 'Could not create' }); }
}


exports.listClusters = async (req, res) => {
const clusters = await Cluster.find({ members: req.user._id }).populate('owner', 'name email');
res.json(clusters);
}


exports.getCluster = async (req, res) => {
const cluster = await Cluster.findById(req.params.id).populate('owner', 'name email').populate('members', 'name email');
if (!cluster) return res.status(404).json({ error: 'Not found' });
res.json(cluster);
}


exports.addMember = async (req, res) => {
const { email } = req.body;
const User = require('../models/User');
try {
const user = await User.findOne({ email });
if (!user) return res.status(404).json({ error: 'User not found' });
const cluster = await Cluster.findById(req.params.id);
if (!cluster) return res.status(404).json({ error: 'Cluster not found' });
// only owner can add
if (!cluster.owner.equals(req.user._id)) return res.status(403).json({ error: 'Only owner can add members' });
if (!cluster.members.includes(user._id)) cluster.members.push(user._id);
await cluster.save();
res.json(cluster);
} catch (err) { res.status(500).json({ error: 'Server error' }); }
}