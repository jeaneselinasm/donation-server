const { v4: uuidv4 } = require("uuid");
const midtransClient = require("midtrans-client");
const getExchangeRate = require("../helpers/getExchangeRate");
const nodemailer = require("nodemailer");
class PaymentController {
    static async generatePayment(req, res, next) {
        try {
            const {
                amount,
                firstName,
                lastName,
                email,
                phone,
                address,
                country,
                city,
                postalCode,
                currency,
            } = req.body;
            const orderId = uuidv4();
            const rateUsdToIdr = await getExchangeRate();

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MID_TRANS_SERVER_KEY,
            });
            const conversionRates = {
                id: 1,
                en: Math.round(rateUsdToIdr),
            };

            let price = amount * (conversionRates[currency] || 1);

            let parameter = {
                "transaction_details": {
                    "order_id": orderId,
                    "gross_amount": price,
                },
                "credit_card": {
                    "secure": true,
                },
                item_details: [
                    {
                        id: "donation",
                        price: price,
                        quantity: 1,
                        name:
                            currency === "id"
                                ? `Jumlah donasi Rp. ${amount}`
                                : `Donation ${amount} USD (~IDR ${price})`,
                    },
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
                        "country_code": country,
                    },
                },
            };

            const midTransToken = await snap.createTransactionToken(parameter);
            res.status(201).json({
                token: midTransToken,
                display_amount:
                    currency === "en" ? `$${amount} (IDR ${price})` : `Rp ${amount}`,
                currency_used: currency,
                converted_amount: price,
            });
            console.log('midtranstoken :', midTransToken)
        } catch (error) {
            next(error);
        }
    }

    static async handleNotification(req, res, next) {
        console.log(">> handleNotification");
        console.log(req.body, 'req body')
        try {
            const {
                transaction_status,
                order_id,
                gross_amount,
                payment_type,
                customer_details,
            } = req.body;

            console.log(customer_details, 'customer_details')
            if (transaction_status === "200") {
                const donorEmail = customer_details?.email;
                const donorName = `${customer_details?.first_name} ${customer_details?.last_name}`;

                // Send email to donor
                await PaymentController.sendEmailNotification({
                    to: donorEmail,
                    name: donorName,
                    amount: gross_amount,
                    orderId: order_id,
                });

            }
        } catch (error) {
            console.log("error handle notification", error);
            next(error);
        }
    }

    static async sendEmailNotification({ to, name, amount, orderId }) {
        try {
            console.log(">> sendEmailNotification");
            console.log(">> to", to);
            console.log(">> name", name);
            console.log(">> amount", amount);
            console.log(">> orderId", orderId);

            const transporter = nodemailer.createTransport({
                servicev: "gmail",
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            });

            const mailOptions = {
                from: `'Bahtraku Donation'${process.env.USER}`,
                to,
                subject: "Thank you for your donation!",
                html: `
                <p>Hi ${name || "Donor"},</p>
        <p>Thank you for your generous donation of <strong>IDR ${amount}</strong>.</p>
        <p>Your donation ID is: <strong>${orderId}</strong>.</p>
        <p>We appreciate your support!</p>
        <br/>
        <p>Regards,<br/>Your Organization</p>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log("error send email notification : ", error);
            next(error);
        }
    }
}

module.exports = PaymentController;
