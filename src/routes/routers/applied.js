const express = require('express')
const router = express.Router()
const appliedController = require('../../controllers/appliedController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/add', jwtFilter.verifyToken, appliedController.addApply)
router.delete('/cancel/:job', jwtFilter.verifyToken, appliedController.cancelApplied)
router.get('/myJob/:job', jwtFilter.verifyToken, appliedController.getAppliedByJob)

module.exports = router