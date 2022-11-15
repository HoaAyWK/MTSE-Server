const express = require('express')
const router = express.Router()
const skillController = require('../../controllers/skillController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, skillController.createSkill)
router.get('/show', skillController.getSkills)

module.exports = router