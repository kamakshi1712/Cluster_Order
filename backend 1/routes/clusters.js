const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createCluster, getCluster, addMember, listClusters } = require('../controllers/clusterController');


router.post('/', auth, createCluster);
router.get('/', auth, listClusters);
router.get('/:id', auth, getCluster);
router.post('/:id/members', auth, addMember);


module.exports = router;