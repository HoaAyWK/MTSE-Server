const { Router } = require('express');

const { transactionHistoryController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.get('/', jwtFilter.verifyToken, transactionHistoryController.getTransactions);


module.exports = router;
