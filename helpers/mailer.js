const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "",
        pass: ""
    }
})

const sendDonationReceivedEmail = async (donationInfo) => {
    await transporter.sendMail({
        from: '"Your Donation Platform" <your@email.com>',
        to: "",
        subject: 'Thank You - Donation Success',
        html: `
         <h3>Donation Received</h3>
            <p><strong>Name:</strong> ${donationInfo.name}</p>
            <p><strong>Email:</strong> ${donationInfo.email}</p>
            <p><strong>Amount:</strong> IDR ${donationInfo.amount}</p>
            <p><strong>Order ID:</strong> ${donationInfo.orderId}</p>
        `
    })
}

module.exports = { sendDonationReceivedEmail }