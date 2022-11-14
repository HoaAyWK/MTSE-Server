const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/accountController')
const jwtFilter = require('../../middleware/jwtFilter')

router.post('/login', accountController.loginAccount)
router.put('/changePassword', jwtFilter.verifyToken, accountController.changePassword)

module.exports = router