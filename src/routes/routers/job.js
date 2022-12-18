const express = require('express')
const router = express.Router()
const jobController = require('../../controllers/jobController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, jobController.createJob)
router.get('/find', jobController.getJobById)
router.get('/show', jobController.getJobs)
router.put('/edit', jwtFilter.verifyToken, jobController.editJob)
router.get('/category/:id', jobController.getJobs)
router.get('/myJobs',jwtFilter.verifyToken, jobController.getMyJobs)
router.put('/status/:id', jwtFilter.verifyToken, jobController.changeStatus)

router.get('/my', jwtFilter.verifyToken, jobController.getAllMyJobs);

router.get('/single/:id', jobController.getJobWithApplies);

router.get('/latest', jobController.getLatestAvailableJobs);

module.exports = router