import { IEmailTemplate } from "../../../../application/ports/mail/template/IEmailTemplate";

export class OTPMailTemplate implements IEmailTemplate<{ otp: string }> {
  render(data: { otp: string }): { subject: string; html: string } {
    return {
      subject: 'Complete Your CodeHive Registration',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Complete Your CodeHive Registration</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              line-height: 1.6;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
              padding: 40px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .greeting {
              font-size: 18px;
              color: #333333;
              margin-bottom: 30px;
            }
            .otp-container {
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              border-radius: 12px;
              padding: 30px;
              margin: 30px 0;
              box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
            }
            .otp-label {
              color: white;
              font-size: 14px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            .otp-code {
              background-color: rgba(255, 255, 255, 0.2);
              color: white;
              font-size: 36px;
              font-weight: bold;
              padding: 15px 30px;
              border-radius: 8px;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
              border: 2px solid rgba(255, 255, 255, 0.3);
              backdrop-filter: blur(10px);
            }
            .instructions {
              color: #666666;
              font-size: 16px;
              margin: 30px 0;
              line-height: 1.8;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              color: #856404;
            }
            .warning-icon {
              font-size: 20px;
              margin-right: 8px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 0;
              color: #6c757d;
              font-size: 14px;
            }
            .security-info {
              background-color: #e8f4fd;
              border-left: 4px solid #0066cc;
              padding: 20px;
              margin: 25px 0;
              border-radius: 0 8px 8px 0;
            }
            .security-info h3 {
              margin: 0 0 10px 0;
              color: #0066cc;
              font-size: 16px;
            }
            .security-info p {
              margin: 0;
              color: #004499;
              font-size: 14px;
            }
            @media only screen and (max-width: 600px) {
              .email-container {
                margin: 10px;
                border-radius: 8px;
              }
              .header {
                padding: 30px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .content {
                padding: 30px 20px;
              }
              .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
                padding: 12px 20px;
              }
              .footer {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🐝 Welcome to CodeHive</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Welcome to CodeHive! Please verify your email address to complete your registration.
              </div>
              
              <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${data.otp}</div>
              </div>
              
              <div class="instructions">
                Enter this code in the registration form to activate your CodeHive account. 
                <strong>This code will expire in 10 minutes</strong> for your security.
              </div>
              
              <div class="security-info">
                <h3>🛡️ Security Information</h3>
                <p>This code is unique to your CodeHive registration and should never be shared with anyone. Our team will never ask you for this code via phone or email.</p>
              </div>
              
              <div class="warning">
                <span class="warning-icon">⚠️</span>
                If you didn't try to register for CodeHive, please ignore this email and your email address will not be registered.
              </div>
            </div>
            
            <div class="footer">
              <p>Welcome to the CodeHive community! 🐝</p>
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }
}
