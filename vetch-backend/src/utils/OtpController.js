const { createClient } = require('redis');
const crypto = require('crypto');

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
            url: process.env.REDIS_URL
        });
        this.#redisClient.on('error', (err) => console.log('Redis Client Error', err));
    }

    async connect() {
        if (!this.#redisClient.isOpen) {
            await this.#redisClient.connect();
            console.log('Redis client connected successfully.');
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
        const payload = JSON.stringify({...user, otp: otp});
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

            console.log(`Successfully generated and sent OTP for ${user.userInfo.email}`);
            return true;
        } catch (error) {
            console.error("Failed to generate or send OTP:", error.message);
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
                return { success: true, data: storedOtp.otp, message: "OTP sent successfully." };
            }
        } catch (error) {
            console.error("Failed to resend OTP:", error);
            return { success: false, message: "An error occurred during verification." };
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
                return { success: true, data: storedOtp, message: "OTP verified successfully." };
            } else {
                return { success: false, message: "Incorrect OTP." };
            }
        } catch (error) {
            console.error("Failed to verify OTP:", error);
            return { success: false, message: "An error occurred during verification." };
        }
    }
    
    // A method to gracefully disconnect the client.
    async disconnect() {
        if (this.#redisClient.isOpen) {
            await this.#redisClient.quit();
            console.log('Redis client disconnected.');
        }
    }
}

module.exports = OtpController;