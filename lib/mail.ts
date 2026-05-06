import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM;

function getMailerConfig() {
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !mailFrom) {
    throw new Error("SMTP environment variables are not fully configured");
  }

  return {
    host: smtpHost,
    port: Number(smtpPort),
    user: smtpUser,
    pass: smtpPass,
    from: mailFrom,
  };
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const config = getMailerConfig();

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject: "Reset your password",
    text: `You requested a password reset.\n\nOpen this link to set a new password:\n${resetLink}\n\nThis link expires in 30 minutes.\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>You requested a password reset.</p><p><a href="${resetLink}">Open this link to set a new password</a></p><p>This link expires in 30 minutes.</p><p>If you did not request this, you can ignore this email.</p>`,
  });
}
