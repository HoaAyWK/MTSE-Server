const { Router } = require('express');

const { userController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.get('/profile', jwtFilter.verifyToken, userController.getCurrentUser);

module.exports = router;
