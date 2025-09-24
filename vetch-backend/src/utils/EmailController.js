const nodemailer = require("nodemailer");
const { google } = require("googleapis");

class EmailController {

  async refreshAccessToken() {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENTID,
        process.env.OAUTH_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN,
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      const accessToken = credentials.access_token;

      console.log("✅ Access token refreshed successfully");
      return accessToken;
    } catch (error) {
      console.error("❌ Error refreshing access token:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  async createTransporter() {
    try {
      // Always refresh access token before creating transporter
      const accessToken = await this.refreshAccessToken();

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USERNAME,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      return transporter;
    } catch (error) {
      console.error("❌ Error creating transporter:", error);
      throw new Error("Failed to create email transporter");
    }
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
      const transporter = await this.createTransporter();

      const info = await transporter.sendMail({
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
