const Submission = require('../models/Submission');
const Cluster = require('../models/Cluster');


exports.submitCode = async (req, res) => {
const { clusterId } = req.params;
const { code, filename } = req.body;
try {
const cluster = await Cluster.findById(clusterId);
if (!cluster) return res.status(404).json({ error: 'Cluster not found' });
// verify author is a member
if (!cluster.members.find(m => m.equals(req.user._id))) return res.status(403).json({ error: 'Not a member' });
// Save submission: handedToOwner is true by design; owner receives and reviews
const sub = await Submission.create({ cluster: clusterId, author: req.user._id, code, filename });
res.json(sub);
} catch (err) { console.error(err); res.status(500).json({ error: 'Server' }); }
}


exports.listSubmissionsForOwner = async (req, res) => {
const { clusterId } = req.params;
const cluster = await Cluster.findById(clusterId);
if (!cluster) return res.status(404).json({ error: 'Cluster not found' });
if (!cluster.owner.equals(req.user._id)) return res.status(403).json({ error: 'Only owner' });
const subs = await Submission.find({ cluster: clusterId }).populate('author', 'name email').sort('-createdAt');
res.json(subs);
}


exports.acceptSubmission = async (req, res) => {
const sub = await Submission.findById(req.params.id).populate('cluster');
if (!sub) return res.status(404).json({ error: 'Not found' });
if (!sub.cluster.owner.equals(req.user._id)) return res.status(403).json({ error: 'Only owner' });
sub.acceptedByOwner = true;
await sub.save();
res.json(sub);
}


exports.listMemberSubmissions = async (req, res) => {
const { clusterId } = req.params;
const subs = await Submission.find({ cluster: clusterId, author: req.user._id }).sort('-createdAt');
res.json(subs);
}