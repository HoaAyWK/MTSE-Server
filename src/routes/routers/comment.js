const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/commentController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, commentController.createComment)
router.get('/my', jwtFilter.verifyToken, commentController.getMyComments)

module.exports = router