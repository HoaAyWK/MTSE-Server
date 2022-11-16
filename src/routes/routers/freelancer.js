const express = require('express')
const router = express.Router()
const freelancerController = require('../../controllers/freelancerController')
const jwtFilter = require('../../middleware/jwtFilter');


router.post('/register', freelancerController.registerFreelancer)
router.get('/', jwtFilter.verifyToken, freelancerController.getFreelancers);

module.exports = router