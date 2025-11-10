import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});

export async function sendMail({
  from = process.env.EMAIL_FROM,
  to,
  subject,
  text,
  html,
  attachments = [],
}) {
  try {
    if (!to || !subject) throw new Error("Missing required fields: to or subject");

    const mailOptions = {
      from,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text: text || html?.replace(/<[^>]+>/g, ""), 
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📨 Email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}
