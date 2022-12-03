const { Router } = require('express');

const { categoryController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/all', categoryController.getCategoriesWithCount);

router.post('/admin/create', jwtFilter.verifyToken, categoryController.createCategory);

router.route('/admin/:id')
    .put(jwtFilter.verifyToken, categoryController.updateCategory)
    .delete(jwtFilter.verifyToken, categoryController.deleteCategory);

module.exports = router;

