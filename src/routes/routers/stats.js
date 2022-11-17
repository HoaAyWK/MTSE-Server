const { Router } = require('express');
const { statsController } = require('../../controllers');


const router = Router();

router.get('/', statsController.getStats);

module.exports = router;
