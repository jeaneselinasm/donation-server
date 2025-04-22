const express = require('express')
const PaymentController = require('../controllers/paymentController')
const router = express.Router()

router.get('/example', (req, res) => {
    res.status(200).json({ message: 'Connected to our server API' })
})

router.post('/payment', PaymentController.generatePayment)
module.exports = router