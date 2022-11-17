const { Router } = require('express');

const userSkillController = require('../../controllers/userSkillController')
const jwtFilter = require('../../middleware/jwtFilter');
const router = Router();

router.post('/add', jwtFilter.verifyToken, userSkillController.addSkills)


module.exports = router;