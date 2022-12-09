const express = require('express')
const router = express.Router()
const freelancerController = require('../../controllers/freelancerController')
const jwtFilter = require('../../middleware/jwtFilter');

router.get('/info', freelancerController.getInfo)
router.post('/register', freelancerController.registerFreelancer)
router.put('/edit' ,jwtFilter.verifyToken, freelancerController.editFreelancer)
router.get('/', freelancerController.getFreelancers);
router.get('/top', freelancerController.getTopFreelancers);
router.put('/turnOn', jwtFilter.verifyToken, freelancerController.turnOnFindJob);
router.put('/turnOff', jwtFilter.verifyToken, freelancerController.turnOffFindJob);

router.get('/single/:id', freelancerController.getSingle);

module.exports = router
