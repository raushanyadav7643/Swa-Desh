const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getUserOrders);

module.exports = router;
