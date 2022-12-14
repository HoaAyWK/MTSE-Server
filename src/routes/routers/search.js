const express = require('express')
const router = express.Router()

const searchController = require('../../controllers/searchController')

router.post('/', searchController.search)
router.post('/freelancer', searchController.getFreelancersBySkills)
router.post('/employer', searchController.getEmployersBySkills)
router.post('/job', searchController.getJobsByCategories)
router.get('/jobs', searchController.searchJobs);
router.get('/freelancers', searchController.searchFreelancers);
router.get('/employers', searchController.searchEmployers);

module.exports = router;
