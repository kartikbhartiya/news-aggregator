import nodemailer from 'nodemailer';
import { Article } from '@/types/news';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER || 'noreply@support.zarpit.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || '"PRISM Executive Intelligence" <noreply@support.zarpit.com>';

export interface SendDigestOptions {
  toEmail: string;
  userName?: string;
  edition?: 'india' | 'international';
  articles: Article[];
}

export function createSmtpTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // port 465 requires SSL
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Builds Apple-grade responsive HTML newsletter
 */
function buildNewsletterHtml(options: SendDigestOptions): string {
  const { userName = 'Executive Reader', edition = 'international', articles } = options;
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const storiesHtml = articles.slice(0, 5).map((art, idx) => `
    <div style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #E4E4E7;">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #71717A; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
        ${art.source.name} • <span style="color: #10B981;">${art.category.toUpperCase()}</span>
      </div>
      <h3 style="font-family: 'Newsreader', Georgia, serif; font-size: 19px; line-height: 1.35; color: #09090B; margin: 0 0 8px 0; font-weight: 700;">
        <a href="${art.url}" style="color: #09090B; text-decoration: none;">${art.title}</a>
      </h3>
      <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #52525B; margin: 0 0 10px 0;">
        ${art.description || ''}
      </p>
      ${art.bulletPoints && art.bulletPoints.length > 0 ? `
        <div style="background-color: #F4F4F5; padding: 10px 14px; border-radius: 8px; margin-top: 8px;">
          <div style="font-family: monospace; font-size: 10px; font-weight: bold; color: #71717A; text-transform: uppercase; margin-bottom: 4px;">KEY SIGNALS:</div>
          <ul style="margin: 0; padding-left: 16px; font-family: -apple-system, sans-serif; font-size: 12px; color: #3F3F46; line-height: 1.5;">
            ${art.bulletPoints.map(bp => `<li>${bp}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PRISM Daily Intelligence</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF9FC; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FC; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E4E4E7; box-shadow: 0 10px 30px -4px rgba(0,0,0,0.05); overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #09090B; padding: 28px 36px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; width: 28px; height: 28px; background-color: #18181B; border-radius: 8px; border: 1px solid #27272A; text-align: center; vertical-align: middle; line-height: 28px; font-size: 14px; color: #10B981; font-weight: bold; margin-right: 8px;">
                      ✦
                    </div>
                    <span style="font-family: -apple-system, sans-serif; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; color: #FFFFFF; vertical-align: middle;">
                      PRISM
                    </span>
                    <span style="background-color: #064E3B; color: #34D399; font-size: 10px; font-family: monospace; font-weight: bold; padding: 2px 8px; border-radius: 12px; margin-left: 8px; vertical-align: middle;">
                      ${edition === 'india' ? '🇮🇳 INDIA EDITION' : '🌐 GLOBAL WIRE'}
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: monospace; font-size: 11px; color: #A1A1AA;">
                      ${dateFormatted}
                    </span>
                  </td>
                </tr>
              </table>
              <div style="font-family: -apple-system, sans-serif; font-size: 13px; color: #D4D4D8; margin-top: 14px; line-height: 1.4;">
                Good morning, <strong>${userName}</strong>. Here is your personalized executive intelligence briefing compiled from verified real-time sources.
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 36px;">
              <div style="font-family: monospace; font-size: 11px; font-weight: 700; color: #09090B; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #09090B;">
                TOP VERIFIED SIGNALS
              </div>
              
              ${storiesHtml}

              <!-- Footer CTA -->
              <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #F8F8F8; border-radius: 12px;">
                <p style="font-family: -apple-system, sans-serif; font-size: 12px; color: #71717A; margin: 0 0 10px 0;">
                  Access real-time live feeds, AI audio synthesis, and interactive market charts:
                </p>
                <a href="http://localhost:3000" style="display: inline-block; background-color: #09090B; color: #FFFFFF; text-decoration: none; font-size: 12px; font-weight: 700; padding: 10px 20px; border-radius: 9999px;">
                  Open Live Dashboard ↗
                </a>
              </div>
            </td>
          </tr>

          <!-- Legal & Footnote -->
          <tr>
            <td style="background-color: #F4F4F5; padding: 20px 36px; text-align: center; border-top: 1px solid #E4E4E7;">
              <p style="font-family: -apple-system, sans-serif; font-size: 11px; color: #A1A1AA; margin: 0; line-height: 1.5;">
                Dispatched by PRISM News Intelligence • Hostinger Secure SMTP Gateway<br>
                Sovereign news aggregation with verified cryptographic attribution.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends Daily Digest Email via Hostinger SMTP
 */
export async function sendDailyDigestEmail(options: SendDigestOptions) {
  const transporter = createSmtpTransporter();
  const html = buildNewsletterHtml(options);
  const editionLabel = options.edition === 'india' ? 'India' : 'Global';

  const mailOptions = {
    from: SMTP_FROM,
    to: options.toEmail,
    subject: `PRISM Daily Intelligence: Top ${editionLabel} Signals for ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
