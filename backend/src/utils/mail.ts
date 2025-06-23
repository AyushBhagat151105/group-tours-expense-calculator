import nodemailer from "nodemailer";
import { env } from "@/validators/env";

interface SendMailOptions {
  subject: string;
  html: string;
}

export class MailtrapMailer {
  private email: string;
  private transporter: nodemailer.Transporter;

  constructor(email: string) {
    this.email = email;

    this.transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: env.MAILTRAP_USER,
        pass: env.MAILTRAP_PASS, 
      },
    });
  }

  async sendMail({ subject, html }: SendMailOptions): Promise<any> {
    try {
      const info = await this.transporter.sendMail({
        from: '"RMS" <admin@email.ayushbhagat.live>',
        to: this.email,
        subject,
        html,
      });

      // console.log("Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email with Mailtrap:", error);
      throw error;
    }
  }
}