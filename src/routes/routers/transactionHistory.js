const { Router } = require('express');

const { transactionHistoryController } = require('../../controllers');
const jwtFilter = require('../../middleware/jwtFilter');

const router = Router();

router.post('/create', transactionHistoryController.createTransaction);
router.get('/', jwtFilter.verifyToken, transactionHistoryController.getTransactions);


module.exports = router;
