const express = require('express')
const router = express.Router()
const freelancerController = require('../../controllers/freelancerController')
const jwtFilter = require('../../middleware/jwtFilter');

router.get('/info', freelancerController.getInfo)
router.post('/register', freelancerController.registerFreelancer)
router.put('/edit' ,jwtFilter.verifyToken, freelancerController.editFreelancer)
router.get('/', jwtFilter.verifyToken, freelancerController.getFreelancers);

module.exports = router