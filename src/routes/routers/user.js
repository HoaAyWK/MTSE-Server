const { Router } = require('express');

const jwtFilter = require('../../middleware/jwtFilter');
const { userController } = require('../../controllers');

const router = Router();

router.route('/profile')
    .get(jwtFilter.verifyToken, userController.getCurrentUser)
    .put(jwtFilter.verifyToken, userController.updateUser);

module.exports = router;
