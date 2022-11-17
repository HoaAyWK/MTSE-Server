const express = require('express')
const router = express.Router()
const jobCategoryController = require('../../controllers/categoryJobController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/',jwtFilter.verifyToken, jobCategoryController.addJobCategories)

module.exports = router