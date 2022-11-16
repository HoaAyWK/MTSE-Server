const express = require('express')
const router = express.Router()
const employerController = require('../../controllers/employerController')
const jwtFilter = require('../../middleware/jwtFilter');

router.post('/register', employerController.registerEmployer)
router.get('/', jwtFilter.verifyToken, employerController.getEmployers);

module.exports = router