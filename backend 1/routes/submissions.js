const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitCode, listSubmissionsForOwner, acceptSubmission, listMemberSubmissions } = require('../controllers/submissionController');


router.post('/:clusterId', auth, submitCode); // members submit
router.get('/owner/:clusterId', auth, listSubmissionsForOwner); // owner views all
router.post('/accept/:id', auth, acceptSubmission); // owner accepts a submission
router.get('/me/:clusterId', auth, listMemberSubmissions); // member sees their own submissions in cluster


module.exports = router;