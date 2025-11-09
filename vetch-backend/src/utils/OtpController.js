const { createClient } = require("redis");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

class OtpController {
  #redisClient;
  #emailService; // Private field for our injected email service

  // The constructor now ACCEPTS an emailService instance.
  constructor(emailService) {
    if (!emailService) {
      throw new Error("OtpService requires an email service instance.");
    }
    this.#emailService = emailService;

    this.#redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    this.#redisClient.on("error", (err) =>
      console.log("Redis Client Error", err)
    );
  }

  async connect() {
    if (!this.#redisClient.isOpen) {
      await this.#redisClient.connect();
      console.log("Redis client connected successfully.");
    }
  }

  /**
   * Generates a 6-digit OTP, stores it in Redis with a 5-minute expiry,
   * and sends it to the user.
   * @param {string} contact - The user's email or phone number.
   * @returns {Promise<boolean>} - True if successful, false otherwise.
   */
  async generateAndSend(user) {
    if (!this.#redisClient.isOpen) {
      throw new Error("Redis client is not connected. Call .connect() first.");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const key = `otp:${user.userInfo.email}`;
    const payload = JSON.stringify({ ...user, otp: otp });
    console.log(payload);

    try {
      // Store OTP in Redis
      await this.#redisClient.set(key, payload, { EX: 300 });
      // Use the injected email service to send the OTP
      await this.#emailService.sendMail({
        to: user.userInfo.email,
        subject: "🔐 Your One-Time Password",
        html: `
                <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
                    <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #111827; text-align: center; margin-bottom: 20px;">Your One-Time Password</h2>
                    <p style="font-size: 15px; color: #374151; text-align: center;">
                        Use the code below to complete your verification. <br>
                        <strong>This code will expire in 5 minutes.</strong>
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background: linear-gradient(90deg, #4f46e5, #3b82f6); color: white; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 15px 25px; border-radius: 8px;">
                        ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; text-align: center;">
                        Didn’t request this code? Please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                        © ${new Date().getFullYear()} MyApp. All rights reserved.
                    </p>
                    </div>
                </div>
                `,
      });

      console.log(
        `Successfully generated and sent OTP for ${user.userInfo.email}`
      );
      return true;
    } catch (error) {
      console.error("Failed to generate or send OTP:", error.message);
      return false;
    }
  }

  async generateAndSendForgotPassword(email) {
    if (!this.#redisClient.isOpen) {
      throw new Error("Redis client is not connected. Call .connect() first.");
    }

    const masterKey = crypto.randomInt(100000, 999999).toString();
    const key = `forgotPassword:${email}`;
    const payload = JSON.stringify({ masterKey: masterKey });
    console.log(payload);

    const url = process.env.CORS_URL;
    const encryptedKey = await bcrypt.hash(masterKey, 10);
    const searchParams = new URLSearchParams({ email: email, key: encryptedKey });
    const redirectUrl = url + `/changepassword?${searchParams.toString()}`;

    try {
      // Store OTP in Redis
      await this.#redisClient.set(key, payload, { EX: 300 });
      // Use the injected email service to send the OTP
      await this.#emailService.sendMail({
        to: email,
        subject: "🔒 Reset Your Password",
        // (optional) text version improves deliverability
        text: `We received a request to reset your password.
Click the link to continue: ${redirectUrl}
If you didn’t request this, you can ignore this email.`,
        html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <h2 style="color: #111827; text-align: center; margin: 0 0 12px;">Reset your password</h2>
      <p style="font-size: 15px; color: #374151; text-align: center; margin: 0 0 8px;">
        We received a request to reset your password for <strong>Vetch</strong>.
      </p>
      <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 0 0 24px;">
        The reset link will expire in <strong>30 minutes</strong>.
      </p>

      <!-- Button -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${redirectUrl}"
           style="display: inline-block; text-decoration: none; background: linear-gradient(90deg, #4f46e5, #3b82f6); color: #ffffff; font-weight: 700; font-size: 16px; padding: 14px 22px; border-radius: 10px;">
           Reset Password
        </a>
      </div>

      <!-- Direct link fallback -->
      <div style="background: #f3f4f6; border-radius: 8px; padding: 14px 16px; word-break: break-all; margin: 0 0 20px;">
        <p style="font-size: 13px; color: #374151; margin: 0;">
          If the button doesn't work, copy and paste this URL into your browser:
        </p>
        <a href="${redirectUrl}" style="font-size: 13px; color: #2563eb; text-decoration: underline;">
          ${redirectUrl}
        </a>
      </div>

      <!-- Simple instructions -->
      <div style="margin: 16px 0 0;">
        <p style="font-size: 14px; color: #374151; margin: 0 0 8px;"><strong>Quick steps:</strong></p>
        <ol style="font-size: 14px; color: #374151; margin: 0 0 20px 20px; padding: 0;">
          <li>Click the <em>Reset Password</em> button or open the URL above.</li>
          <li>Enter your new password and confirm it.</li>
          <li>Save changes — you&apos;re done.</li>
        </ol>
      </div>

      <p style="font-size: 13px; color: #6b7280; text-align: center; margin: 0 0 8px;">
        If you didn&apos;t request this, you can safely ignore this email — your password won&apos;t change.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        © ${new Date().getFullYear()} Vetch. All rights reserved.
      </p>
    </div>
  </div>
  `,
      });

      console.log(
        `Successfully generated and sent reset password email for ${email}`
      );
      return true;
    } catch (error) {
      console.error("Failed to generate or send reset password email:", error.message);
      return false;
    }
  }

  /**
   * Verifies a submitted OTP against the one stored in Redis.
   * @param {string} contact - The user's email or phone number.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async resendOTP(contact) {
    if (!this.#redisClient.isOpen) {
      throw new Error("Redis client is not connected. Call .connect() first.");
    }

    const key = `otp:${contact}`;

    console.log(key);

    try {
      const getRedis = await this.#redisClient.get(key);
      const storedOtp = getRedis ? JSON.parse(getRedis) : null;

      if (!storedOtp) {
        console.log("No OTP found to resend.");
        return { success: false, message: "OTP expired or invalid." };
      }

      console.log("Stored OTP:", storedOtp);

      if (storedOtp.otp) {
        await this.#emailService.sendMail({
          to: contact,
          subject: "🔐 Your One-Time Password",
          html: `
                    <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
                        <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #111827; text-align: center; margin-bottom: 20px;">Your One-Time Password</h2>
                        <p style="font-size: 15px; color: #374151; text-align: center;">
                            Use the code below to complete your verification. <br>
                            <strong>This code will expire in 5 minutes.</strong>
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="display: inline-block; background: linear-gradient(90deg, #4f46e5, #3b82f6); color: white; font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 15px 25px; border-radius: 8px;">
                            ${storedOtp.otp}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #6b7280; text-align: center;">
                            Didn’t request this code? Please ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                            © ${new Date().getFullYear()} MyApp. All rights reserved.
                        </p>
                        </div>
                    </div>
                    `,
        });
        return {
          success: true,
          data: storedOtp.otp,
          message: "OTP sent successfully.",
        };
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      return {
        success: false,
        message: "An error occurred during verification.",
      };
    }
  }

  /**
   * Verifies a submitted OTP against the one stored in Redis.
   * @param {string} contact - The user's email or phone number.
   * @param {string} submittedOtp - The OTP submitted by the user.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verify(contact, submittedOtp) {
    if (!this.#redisClient.isOpen) {
      throw new Error("Redis client is not connected. Call .connect() first.");
    }

    const key = `otp:${contact}`;

    console.log(key);

    try {
      const getRedis = await this.#redisClient.get(key);
      const storedOtp = getRedis ? JSON.parse(getRedis) : null;

      if (!storedOtp) {
        return { success: false, message: "OTP expired or invalid." };
      }

      console.log("Stored OTP:", storedOtp);
      console.log("Submitted OTP:", submittedOtp);

      if (storedOtp.otp === submittedOtp) {
        // Security first: delete the key immediately after use.
        await this.#redisClient.del(key);
        return {
          success: true,
          data: storedOtp,
          message: "OTP verified successfully.",
        };
      } else {
        return { success: false, message: "Incorrect OTP." };
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      return {
        success: false,
        message: "An error occurred during verification.",
      };
    }
  }

  async validateKey(email, masterKey){
    const key = `forgotPassword:${email}`;
    const getRedis = await this.#redisClient.get(key);
    const storedKey = getRedis ? JSON.parse(getRedis) : null;
    if (!storedKey) {
      return false;
    }
    if(await bcrypt.compare(storedKey.masterKey, masterKey)){
      await this.#redisClient.del(key);
      return true;
    }else{
      return false;
    }
  }

  // A method to gracefully disconnect the client.
  async disconnect() {
    if (this.#redisClient.isOpen) {
      await this.#redisClient.quit();
      console.log("Redis client disconnected.");
    }
  }
}

module.exports = OtpController;
