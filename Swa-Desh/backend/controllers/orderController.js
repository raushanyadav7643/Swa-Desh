const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret',
});

exports.createOrder = async (req, res) => {
    try {
        const { product, quantity, address } = req.body;

        const productDetails = await Product.findById(product);
        if (!productDetails) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const amount = productDetails.price * quantity * 100; // Razorpay expects amount in paise

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const newOrder = new Order({
            user: req.user.id,
            product,
            quantity,
            address,
            razorpayOrderId: razorpayOrder.id,
            status: 'Pending'
        });

        await newOrder.save();

        res.json({
            order: newOrder,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'Paid', razorpayPaymentId: razorpay_payment_id }
            );
            res.status(200).json({ msg: 'Payment verified successfully' });
        } else {
            res.status(400).json({ msg: 'Invalid signature' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('product');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
