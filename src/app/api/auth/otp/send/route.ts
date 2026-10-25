import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreOtp } from '@/lib/otp-store';
import { createSmtpTransporter } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otp = generateAndStoreOtp(cleanEmail);

    // Send real email using Hostinger SMTP
    const transporter = createSmtpTransporter();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>PRISM Security Code</title>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #09090B;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E4E4E7; box-shadow: 0 4px 20px rgba(0,0,0,0.04); overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #F4F4F5;">
              <div style="display: inline-block; width: 44px; height: 44px; border-radius: 12px; background-color: #09090B; line-height: 44px; text-align: center; margin-bottom: 12px;">
                <span style="color: #34D399; font-weight: 900; font-size: 20px;">▲</span>
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #09090B;">PRISM INTELLIGENCE</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; font-family: monospace; color: #71717A; text-transform: uppercase; letter-spacing: 0.08em;">Secure Access Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #52525B;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #52525B;">
                Use the following 6-digit one-time password (OTP) to securely authenticate your PRISM Intelligence account.
              </p>
              
              <div style="background-color: #F4F4F5; border: 1px solid #E4E4E7; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: -apple-system, monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #09090B; display: inline-block;">
                  ${otp}
                </span>
                <div style="margin-top: 8px; font-size: 11px; color: #71717A; font-family: monospace;">
                  Valid for 10 minutes • Do not share this code
                </div>
              </div>

              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #71717A;">
                If you did not request this verification code, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #FAFAFA; border-top: 1px solid #F4F4F5; text-align: center; font-size: 11px; color: #A1A1AA;">
              PRISM Executive Intelligence • noreply@support.zarpit.com
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"PRISM Security" <noreply@support.zarpit.com>',
      to: cleanEmail,
      subject: `Your PRISM Verification Code: ${otp}`,
      text: `Your PRISM verification code is: ${otp}. It expires in 10 minutes.`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
    });
  } catch (error: any) {
    console.error('Failed to send OTP email:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch verification email via SMTP server.' },
      { status: 500 }
    );
  }
}
