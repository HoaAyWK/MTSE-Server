const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/commentController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/create', jwtFilter.verifyToken, commentController.createComment)
router.get('/show', commentController.getCommentsOfObject)
router.get('/my', jwtFilter.verifyToken, commentController.getMyComments)
router.put('/edit', jwtFilter.verifyToken, commentController.editComment)

router.get('/user', commentController.getCommentedForReceiver);
router.get('/sender', commentController.getCommentsForSender);

module.exports = router