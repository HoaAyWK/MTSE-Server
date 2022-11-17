const { Router } = require('express');

const { transactionHistoryController } = require('../../controllers');

const router = Router();

router.post('/create', transactionHistoryController.createTransaction);


module.exports = router;
