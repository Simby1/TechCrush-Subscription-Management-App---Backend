import sgMail from "@sendgrid/mail";

const sendEmail_SendGrid = async (option) => {
  // Set sendgrid API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Email details
  const msg = {
    to: option.email,
    from: "TSMA Support<support@tsma.com>",
    subject: option.subject,
    text: option.text,
    html: option.message,
  };

  await sgMail.send(msg);
};

export default sendEmail_SendGrid;
