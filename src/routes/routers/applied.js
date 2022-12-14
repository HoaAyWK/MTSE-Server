const express = require('express')
const router = express.Router()
const appliedController = require('../../controllers/appliedController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/add', jwtFilter.verifyToken, appliedController.addApply)
router.delete('/cancel/:job', jwtFilter.verifyToken, appliedController.cancelApplied)
router.get('/myJob/:job', jwtFilter.verifyToken, appliedController.getAppliedByJob)
router.get('/check/:job', jwtFilter.verifyToken, appliedController.checkApplied)
router.get('/admin/:job', jwtFilter.verifyToken, appliedController.getAppliedsByJobForAdmin);
router.get('/jobs/:job', jwtFilter.verifyToken, appliedController.getAppliedsByJob);
router.get('/my', jwtFilter.verifyToken, appliedController.getAppliedsByFreelancer);

module.exports = router