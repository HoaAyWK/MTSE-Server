const { Router } = require('express');

const { packageController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.get('/', packageController.getPackages);

router.post('/admin/create', jwtFilter.verifyToken, packageController.createPackage);

router.route('/admin/:id')
    .put(jwtFilter.verifyToken, packageController.updatePackage)
    .delete(jwtFilter.verifyToken, packageController.deletePakage);

module.exports = router;
