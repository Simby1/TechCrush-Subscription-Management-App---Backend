export const passwordResetEmailTemplate = (name, resetURL) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333;">
  <h1>Password Reset Request</h1>
  <p>Hello ${name || "User"},</p>
  <p>We received a request to reset your password. Please click the link below:</p>
  <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
  <p>This link expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
  <p>If you have any questions or need assistance, please feel free to contact our support team.</p>
  <footer style="margin-top: 20px">
    <p>Best regards,</p>
    <p><strong>SubNotify Team</strong></p>
  </footer>
</body>
</html>
`;

export const altPasswordResetEmailTemplate = (name, resetURL) =>
  `Hello ${name || "User"},
  
We received a request to reset your password. Please visit the provided link.
  
${resetURL}

Best regards,
SubNotify Team
  `;
