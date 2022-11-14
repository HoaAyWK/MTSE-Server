const { Router } = require('express');
const packageController = require('../../controllers/packageController');

const router = Router();

router.get('/', packageController.getPackagies);
router.post('/admin/create', packageController.createPackage);

module.exports = router;
