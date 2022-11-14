const express = require('express')
const router = express.Router()
const freelancerController = require('../../controllers/freelancerController')


router.post('/register', freelancerController.registerFreelancer)

module.exports = router