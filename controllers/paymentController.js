const { v4: uuidv4 } = require('uuid')
const midtransClient = require('midtrans-client')
const getExchangeRate = require('../helpers/getExchangeRate')


class PaymentController {
    static async generatePayment(req, res, next) {
        try {
            const { amount, firstName, lastName, email, phone, address, country, city, postalCode, currency } = req.body
            const orderId = uuidv4()
            const rateUsdToIdr = getExchangeRate()

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MID_TRANS_SERVER_KEY
            })
            const conversionRates = {
                id: 1,
                en: rateUsdToIdr
            }

            let price = amount * (conversionRates[currency] || 1)

            let parameter = {
                'transaction_details': {
                    "order_id": orderId,
                    "gross_amount": price
                },
                "credit_card": {
                    "secure": true
                },
                item_details: [
                    {
                        id: 'donation',
                        price: price,
                        quantity: 1,
                        name: currency === 'id' ? `Jumlah donasi Rp. ${amount}` : `Donation ${amount} USD (~IDR ${price})`
                    }
                ],
                "customer_details": {
                    "first_name": firstName,
                    "last_name": lastName,
                    "phone": phone,
                    "email": email,
                    "billing_address": {
                        "address": address,
                        "city": city,
                        "postal_code": postalCode,
                        "country_code": country
                    }
                }
            }

            const midTransToken = await snap.createTransactionToken(parameter)

            console.log(midTransToken, 'INI TOKEN MIDTRANS')

            res.status(201).json({
                ...midTransToken,
                display_amount: amount
            })

        } catch (error) {
            console.log('error', error)
            next(error)
        }
    }
}

module.exports = PaymentController