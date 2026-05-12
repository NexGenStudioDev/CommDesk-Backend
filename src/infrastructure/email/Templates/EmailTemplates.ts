/**
 * Email Templates for different events
 * Each template returns { subject, html, text }
 */

export const EmailTemplates = {
  /**
   * Community Signup Welcome Email
   */
  communitySignup: (data: {
    communityName: string;
    email: string;
    website?: string;
  }) => ({
    subject: `Welcome to CommDesk - ${data.communityName} Community Created!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: white; padding: 20px; border: 1px solid #ddd; }
            .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #666; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            h1 { margin: 0; font-size: 24px; }
            .highlight { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Community Created Successfully!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Great news! Your community <strong>"${data.communityName}"</strong> has been successfully created on CommDesk.</p>
              
              <div class="highlight">
                <strong>📧 Community Email:</strong> ${data.email}
              </div>

              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Your community account is pending approval</li>
                <li>Our team will review and activate it shortly</li>
                <li>You'll receive a confirmation email once approved</li>
                <li>Start inviting members to join your community</li>
              </ul>

              ${
                data.website
                  ? `<p><strong>Community Website:</strong> <a href="${data.website}">${data.website}</a></p>`
                  : ""
              }

              <a href="${process.env.APP_URL || "https://commdesk.com"}/dashboard" class="button">Go to Dashboard</a>

              <p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                If you didn't create this community, please contact support immediately.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2026 CommDesk. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Community Created Successfully!

Hello,

Great news! Your community "${data.communityName}" has been successfully created on CommDesk.

Community Email: ${data.email}

Next Steps:
- Your community account is pending approval
- Our team will review and activate it shortly
- You'll receive a confirmation email once approved
- Start inviting members to join your community

${data.website ? `Community Website: ${data.website}` : ""}

Go to Dashboard: ${process.env.APP_URL || "https://commdesk.com"}/dashboard

If you didn't create this community, please contact support immediately.

© 2026 CommDesk. All rights reserved.
This is an automated email. Please do not reply.
    `,
  }),

  /**
   * Account Banned - Failed Login Attempts
   */
  accountBanned: (data: {
    email: string;
    userName?: string;
    unbannedAt: Date;
  }) => ({
    subject: "⛔ Your Account Has Been Temporarily Banned",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: white; padding: 20px; border: 1px solid #ddd; }
            .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #666; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .warning { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .button { display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
            h1 { margin: 0; font-size: 24px; }
            .timer { font-size: 18px; color: #dc3545; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⛔ Account Temporarily Banned</h1>
            </div>
            <div class="content">
              <p>Hello ${data.userName || "User"},</p>
              
              <div class="warning">
                <strong>⚠️ Security Alert:</strong> Your account has been temporarily banned due to 5 failed login attempts. This is a security measure to protect your account.
              </div>

              <p><strong>Ban Details:</strong></p>
              <ul>
                <li>Account Email: ${data.email}</li>
                <li>Reason: 5 failed login attempts</li>
                <li>Banned At: ${new Date().toLocaleString()}</li>
                <li>Account Will Be Unbanned At: <span class="timer">${data.unbannedAt.toLocaleString()}</span></li>
              </ul>

              <p><strong>What Happened?</strong></p>
              <p>We detected multiple failed login attempts on your account from different locations. To keep your account secure, we've temporarily locked it.</p>

              <p><strong>What Should You Do?</strong></p>
              <ul>
                <li>Wait 30 minutes for the ban to be automatically lifted</li>
                <li>Make sure you use the correct password when trying again</li>
                <li>If you don't recognize these login attempts, consider changing your password immediately after unbanning</li>
              </ul>

              <a href="${process.env.APP_URL || "https://commdesk.com"}/support" class="button">Contact Support</a>

              <p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                If this wasn't you, please secure your account immediately by changing your password.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2026 CommDesk. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Account Temporarily Banned

Hello ${data.userName || "User"},

Security Alert: Your account has been temporarily banned due to 5 failed login attempts. This is a security measure to protect your account.

Ban Details:
- Account Email: ${data.email}
- Reason: 5 failed login attempts
- Banned At: ${new Date().toLocaleString()}
- Account Will Be Unbanned At: ${data.unbannedAt.toLocaleString()}

What Happened?
We detected multiple failed login attempts on your account. To keep your account secure, we've temporarily locked it.

What Should You Do?
- Wait 30 minutes for the ban to be automatically lifted
- Make sure you use the correct password when trying again
- If you don't recognize these login attempts, consider changing your password immediately after unbanning

Contact Support: ${process.env.APP_URL || "https://commdesk.com"}/support

If this wasn't you, please secure your account immediately by changing your password.

© 2026 CommDesk. All rights reserved.
This is an automated email. Please do not reply.
    `,
  }),

  /**
   * Forgot Password Email
   */
  forgotPasswordTemplate: (resetLink: string) => ({
    subject: "🔐 Reset Your CommDesk Password",

    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            margin: 0;
            padding: 0;
          }

          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }

          .card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #e5e5e5;
          }

          .header {
            background: #2563eb;
            color: white;
            padding: 30px 20px;
            text-align: center;
          }

          .header h1 {
            margin: 0;
            font-size: 26px;
          }

          .content {
            padding: 30px 25px;
          }

          .button {
            display: inline-block;
            background: #2563eb;
            color: white !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
          }

          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }

          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
          }

          .link-box {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            word-break: break-word;
            font-size: 13px;
            margin-top: 15px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="card">

            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>

            <div class="content">
              <p>Hello,</p>

              <p>
                We received a request to reset your CommDesk account password.
              </p>

              <p>
                Click the button below to create a new password:
              </p>

              <a href="${resetLink}" class="button">
                Reset Password
              </a>

              <div class="warning">
                <strong>⚠️ Important:</strong>
                This password reset link will expire in 15 minutes for security reasons.
              </div>

              <p>
                If the button above does not work, copy and paste this link into your browser:
              </p>

              <div class="link-box">
                ${resetLink}
              </div>

              <p style="margin-top: 30px;">
                If you did not request a password reset, you can safely ignore this email.
                Your account will remain secure.
              </p>
            </div>

            <div class="footer">
              <p>&copy; 2026 CommDesk. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `,

    text: `
Reset Your CommDesk Password

Hello,

We received a request to reset your CommDesk account password.

Use the link below to reset your password:

${resetLink}

Important:
- This reset link will expire in 15 minutes.
- If you did not request this password reset, you can safely ignore this email.

© 2026 CommDesk. All rights reserved.
This is an automated email. Please do not reply.
  `,
  }),
};

export default EmailTemplates;
