const mongoose = require('mongoose');


const SubmissionSchema = new mongoose.Schema({
cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },
author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
code: { type: String, required: true },
filename: { type: String },
handedToOwner: { type: Boolean, default: true },
acceptedByOwner: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model('Submission', SubmissionSchema);