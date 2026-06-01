/**
 * Email Templates for different events
 * Each template returns { subject, html, text }
 */

export const EmailTemplates = {
  communitySignup: (data: {
    communityName: string;
    email: string;
    website?: string;
  }) => ({
    subject: `Welcome to CommDesk 🚀 ${data.communityName} is Under Review`,

    html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background: #f4f7fb;
          color: #111827;
          line-height: 1.6;
          padding: 30px 15px;
        }

        .wrapper {
          max-width: 620px;
          margin: auto;
        }

        .card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow:
            0 10px 25px rgba(0,0,0,0.06),
            0 2px 8px rgba(0,0,0,0.04);
        }

        .hero {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          padding: 50px 30px;
          text-align: center;
          color: white;
        }

        .hero h1 {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .hero p {
          font-size: 15px;
          opacity: 0.95;
        }

        .content {
          padding: 35px 30px;
        }

        .badge {
          display: inline-block;
          background: #ecfdf3;
          color: #027a48;
          border: 1px solid #abefc6;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 25px;
        }

        .community-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 18px;
          margin: 24px 0;
        }

        .community-box p {
          margin-bottom: 8px;
          font-size: 14px;
        }

        .community-name {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #111827;
        }

        .timeline {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 14px;
          padding: 18px;
          margin-top: 25px;
        }

        .timeline h3 {
          color: #1d4ed8;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .timeline ul {
          padding-left: 18px;
        }

        .timeline li {
          margin-bottom: 10px;
          color: #374151;
          font-size: 14px;
        }

        .buttons {
          margin-top: 32px;
          text-align: center;
        }

        .btn {
          display: inline-block;
          padding: 14px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          margin: 6px;
        }

        .btn-primary {
          background: #2563eb;
          color: white !important;
        }

        .btn-secondary {
          background: #eef2ff;
          color: #4338ca !important;
        }

        .about {
          margin-top: 35px;
          padding-top: 28px;
          border-top: 1px solid #e5e7eb;
        }

        .about h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .about p {
          color: #4b5563;
          font-size: 14px;
        }

        .footer {
          text-align: center;
          padding: 28px 20px;
          color: #6b7280;
          font-size: 12px;
        }

        .footer a {
          color: #2563eb;
          text-decoration: none;
        }

        @media only screen and (max-width: 600px) {
          .hero {
            padding: 40px 20px;
          }

          .content {
            padding: 28px 20px;
          }

          .hero h1 {
            font-size: 26px;
          }

          .btn {
            display: block;
            width: 100%;
          }
        }
      </style>
    </head>

    <body>
      <div class="wrapper">
        <div class="card">

          <div class="hero">
            <h1>🎉 Welcome to CommDesk</h1>
            <p>Your community has been successfully submitted for approval.</p>
          </div>

          <div class="content">

            <div class="badge">
              Community Submission Received
            </div>

            <p>Hello,</p>

            <p style="margin-top: 14px;">
              Congratulations! Your community has officially joined the CommDesk platform.
              We're excited to help you build, manage, and grow your community experience.
            </p>

            <div class="community-box">
              <div class="community-name">
                ${data.communityName}
              </div>

              <p><strong>Community Email:</strong> ${data.email}</p>

              ${
                data.website
                  ? `
                <p>
                  <strong>Website:</strong>
                  <a href="${data.website}" target="_blank">
                    ${data.website}
                  </a>
                </p>
              `
                  : ""
              }
            </div>

            <div class="timeline">
              <h3>⏳ What Happens Next?</h3>

              <ul>
                <li>Your community is currently under review by the CommDesk team.</li>
                <li>Approval usually takes less than <strong>24 hours</strong>.</li>
                <li>Once approved, you'll receive another email confirmation.</li>
                <li>After approval, you can invite members and start managing your community dashboard.</li>
              </ul>
            </div>

            <div class="buttons">
              <a
                href="${process.env.APP_URL || "https://commdesk.com"}/dashboard"
                class="btn btn-primary"
              >
                Open Dashboard
              </a>

              <a
                href="${process.env.APP_URL || "https://commdesk.com"}/community-guidelines"
                class="btn btn-secondary"
              >
                Community Rules
              </a>
            </div>

            <div class="about">
              <h3>What is CommDesk?</h3>

              <p>
                CommDesk is a modern community management platform built for organizations,
                creators, teams, and online communities. Manage members, communication,
                events, permissions, and workflows — all in one place.
              </p>
            </div>

          </div>

          <div class="footer">
            <p>
              © 2026 CommDesk. All rights reserved.
            </p>

            <p style="margin-top: 8px;">
              This is an automated email. Please do not reply.
            </p>

            <p style="margin-top: 8px;">
              Need help?
              <a href="${process.env.APP_URL || "https://commdesk.com"}/support">
                Contact Support
              </a>
            </p>
          </div>

        </div>
      </div>
    </body>
  </html>
  `,

    text: `
Welcome to CommDesk 🚀

Your community "${data.communityName}" has been submitted successfully.

Community Email:
${data.email}

${data.website ? `Website: ${data.website}` : ""}

What happens next?
- Your community is under review
- Approval usually takes less than 24 hours
- You’ll receive another email once approved
- Then you can start inviting members and managing your dashboard

Dashboard:
${process.env.APP_URL || "https://commdesk.com"}/dashboard

Community Rules:
${process.env.APP_URL || "https://commdesk.com"}/community-guidelines

About CommDesk:
CommDesk is a modern platform for managing communities, teams, members, communication, and workflows in one place.

© 2026 CommDesk
This is an automated email.
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
