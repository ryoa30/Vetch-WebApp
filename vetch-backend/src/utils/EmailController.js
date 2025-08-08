const nodemailer = require('nodemailer');

class EmailController {
    #transporter;

    constructor() {
        // Create the transporter using the config passed in.
        this.#transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            },
        });
    }

    /**
     * Sends an email.
     * @param {object} mailOptions - Options for the email.
     * @param {string} mailOptions.to - Recipient's email address.
     * @param {string} mailOptions.subject - Subject of the email.
     * @param {string} mailOptions.text - Plain text body of the email.
     * @param {string} [mailOptions.html] - HTML body of the email (optional).
     * @returns {Promise<void>}
     */
    async sendMail({ to, subject, text, html }) {
        try {
            const info = await this.#transporter.sendMail({
                from: '"Vetch" <no-reply@vetch.com>', // sender address
                to,
                subject,
                text,
                html,
            });
            console.log("Message sent: %s", info.messageId);
        } catch (error) {
            console.error("Failed to send email:", error);
            // In a real app, you'd want more robust error handling here.
            throw new Error("Could not send email.");
        }
    }
}

module.exports = EmailController;