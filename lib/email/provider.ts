import { Resend } from "resend";

class EmailProvider {
    private resend: Resend;
    
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("RESEND_API_KEY is not defined");
        }
        this.resend = new Resend(apiKey);
    }
    
    async sendEmail(to: string, from: string, subject: string, html: string) {
        try {
            const response = await this.resend.emails.send({
                to,
                from,
                subject,
                html,
            });
            return response;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }

    async sendPasswordResetEmail(to: string, otp: string) {
        const from = process.env.EMAIL_FROM || "noreply@yourapp.com";
        const subject = "Password Reset - Verification Code";
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You have requested to reset your password. Please use the verification code below:</p>
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #333; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h1>
                </div>
                <p>This code will expire in 15 minutes for security reasons.</p>
                <p>If you did not request this password reset, please ignore this email.</p>
                <hr style="margin: 30px 0;">
                <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
            </div>
        `;
        
        return this.sendEmail(to, from, subject, html);
    }
}

const emailProvider = new EmailProvider();
export default emailProvider;


