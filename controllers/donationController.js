const { v4: uuidv4 } = require('uuid')
const midtransClient = require('midtrans-client')
const getExchangeRate = require('../helpers/getExchangeRate')


class PaymentController {

    static async generatePayment(req, res, next) {
        try {
            const { amount, firstName, lastName, email, phone, address, country, city, postalCode, currency } = req.body

        } catch (error) {

        }
    }
}