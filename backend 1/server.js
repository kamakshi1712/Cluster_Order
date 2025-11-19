require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const clusterRoutes = require('./routes/clusters');
const submissionRoutes = require('./routes/submissions');


const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));


const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/clusterdb';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Mongo connected'))
.catch(err => console.error('Mongo connect error', err));


app.use('/api/auth', authRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/submissions', submissionRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));