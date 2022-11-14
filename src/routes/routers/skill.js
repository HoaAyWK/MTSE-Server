const { Router } = require('express');

const { skillController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.get('/', skillController.getSkills);

router.post('/admin/create', jwtFilter.verifyToken, skillController.createSkill);

router.route('/admin/:id')
    .put(jwtFilter.verifyToken, skillController.updateSkill)
    .delete(jwtFilter.verifyToken, skillController.deleteSkill);

module.exports = router;
