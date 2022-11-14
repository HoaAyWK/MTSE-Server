const express = require('express')
const router = express.Router()
const employerController = require('../../controllers/employerController')

router.post('/register', employerController.registerEmployer)

module.exports = router