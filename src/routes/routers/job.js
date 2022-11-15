const express = require('express')
const router = express.Router()
const jobController = require('../../controllers/jobController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, jobController.createJob)

module.exports = router