const express = require('express')
const router = express.Router()
const jobController = require('../../controllers/jobController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, jobController.createJob)
router.get('/find', jobController.getJobById)
router.get('/show', jobController.getJobs)
router.put('/status/:id', jwtFilter.verifyToken, jobController.changeStatus)

module.exports = router