const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/categoryController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, categoryController.createCategory)
router.get('/show', categoryController.getCategories)

module.exports = router