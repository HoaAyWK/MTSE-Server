const { Router } = require('express');

const { checkoutController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.get('/', jwtFilter.verifyToken, checkoutController.checkoutWithStripe);
router.get('/success', checkoutController.checkoutSuccess);
router.get('/failure', checkoutController.checkoutCancel);

module.exports = router;
