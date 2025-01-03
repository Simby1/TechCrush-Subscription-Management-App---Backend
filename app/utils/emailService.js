import nodemailer from "nodemailer";

const sendEmail = async (option) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define email options
  const emailOptions = {
    from: "SubNotify support<support@subnotify.com>",
    to: option.email,
    subject: option.subject,
    text: option.text,
    html: option.message,
  };
  await transporter.sendMail(emailOptions);
};

export default sendEmail;
