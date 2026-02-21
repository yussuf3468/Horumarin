/**
 * MIDEEYE Email Service — Resend
 *
 * Usage:
 *   import { sendWelcomeEmail, sendAnswerNotification } from "@/lib/email";
 *
 * Required env vars:
 *   RESEND_API_KEY=re_xxxxxxxxxxxx
 *   EMAIL_FROM=MIDEEYE <noreply@mideeye.com>
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "MIDEEYE <noreply@mideeye.com>";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SendResult {
  success: boolean;
  id?: string;
  error?: string;
}

// ─── Welcome email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  to: string,
  name: string,
): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject: `Mideeye Ku Soo Dhawow, ${name}! 🧠`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#0f1117;font-family:sans-serif;color:#e2e8f0">
          <div style="max-width:600px;margin:0 auto;padding:40px 24px">
            <div style="text-align:center;margin-bottom:32px">
              <div style="display:inline-block;padding:12px 24px;border-radius:12px;
                          background:linear-gradient(135deg,#1d4ed8,#0d9488)">
                <span style="font-size:24px;font-weight:900;color:white;letter-spacing:-0.5px">
                  MIDEEYE
                </span>
              </div>
            </div>

            <h1 style="font-size:28px;font-weight:700;color:white;margin-bottom:8px">
              Ku soo dhawow, ${name}! 👋
            </h1>
            <p style="color:#94a3b8;font-size:16px;margin-bottom:32px">
              Welcome to MIDEEYE — the Somali knowledge community.
            </p>

            <div style="background:#1e293b;border-radius:16px;padding:24px;margin-bottom:24px">
              <h2 style="color:white;font-size:18px;margin-top:0;margin-bottom:16px">
                Get started in 3 steps:
              </h2>
              <div style="display:flex;align-items:center;margin-bottom:16px">
                <span style="background:#0d9488;color:white;border-radius:50%;
                             width:28px;height:28px;display:inline-flex;
                             align-items:center;justify-content:center;
                             font-weight:700;margin-right:12px;flex-shrink:0">1</span>
                <span style="color:#e2e8f0">Complete your profile — add a photo and bio</span>
              </div>
              <div style="display:flex;align-items:center;margin-bottom:16px">
                <span style="background:#0d9488;color:white;border-radius:50%;
                             width:28px;height:28px;display:inline-flex;
                             align-items:center;justify-content:center;
                             font-weight:700;margin-right:12px;flex-shrink:0">2</span>
                <span style="color:#e2e8f0">Ask your first question — any topic, any language</span>
              </div>
              <div style="display:flex;align-items:center">
                <span style="background:#0d9488;color:white;border-radius:50%;
                             width:28px;height:28px;display:inline-flex;
                             align-items:center;justify-content:center;
                             font-weight:700;margin-right:12px;flex-shrink:0">3</span>
                <span style="color:#e2e8f0">Follow 5 people — build your knowledge network</span>
              </div>
            </div>

            <div style="text-align:center;margin-bottom:32px">
              <a href="https://mideeye.com/dashboard"
                 style="display:inline-block;padding:14px 32px;border-radius:12px;
                        background:linear-gradient(135deg,#0d9488,#1d4ed8);
                        color:white;font-weight:700;font-size:16px;text-decoration:none">
                Get Started →
              </a>
            </div>

            <p style="color:#475569;font-size:13px;text-align:center;margin-bottom:0">
              Nabad iyo caano — The MIDEEYE Team<br/>
              <a href="https://mideeye.com/settings" style="color:#0d9488">
                Manage notification settings
              </a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("sendWelcomeEmail error:", err);
    return { success: false, error: err.message };
  }
}

// ─── Answer notification ──────────────────────────────────────────────────────

export async function sendAnswerNotification(
  to: string,
  toName: string,
  answererName: string,
  questionTitle: string,
  questionId: string,
): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject: `${answererName} answered your question on MIDEEYE 💬`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#0f1117;font-family:sans-serif;color:#e2e8f0">
          <div style="max-width:600px;margin:0 auto;padding:40px 24px">
            <div style="text-align:center;margin-bottom:32px">
              <span style="font-size:20px;font-weight:900;color:white">MIDEEYE</span>
            </div>
            <h2 style="color:white;margin-bottom:8px">Your question was answered!</h2>
            <p style="color:#94a3b8;margin-bottom:24px">
              <strong style="color:#2dd4bf">${answererName}</strong> answered:
            </p>
            <div style="background:#1e293b;border-left:3px solid #0d9488;
                        padding:16px 20px;border-radius:0 12px 12px 0;margin-bottom:32px">
              <p style="color:#e2e8f0;margin:0;font-size:16px">"${questionTitle}"</p>
            </div>
            <div style="text-align:center;margin-bottom:32px">
              <a href="https://mideeye.com/questions/${questionId}"
                 style="display:inline-block;padding:14px 32px;border-radius:12px;
                        background:#0d9488;color:white;font-weight:700;text-decoration:none">
                Read the Answer →
              </a>
            </div>
            <p style="color:#475569;font-size:13px;text-align:center">
              <a href="https://mideeye.com/settings" style="color:#0d9488">
                Unsubscribe from notifications
              </a>
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("sendAnswerNotification error:", err);
    return { success: false, error: err.message };
  }
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [to],
      subject: "Reset your MIDEEYE password",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#0f1117;font-family:sans-serif;color:#e2e8f0">
          <div style="max-width:600px;margin:0 auto;padding:40px 24px">
            <div style="text-align:center;margin-bottom:32px">
              <span style="font-size:20px;font-weight:900;color:white">MIDEEYE</span>
            </div>
            <h2 style="color:white">Reset your password</h2>
            <p style="color:#94a3b8;margin-bottom:24px">
              We received a request to reset your password. Click the button below —
              this link expires in 1 hour.
            </p>
            <div style="text-align:center;margin-bottom:32px">
              <a href="${resetUrl}"
                 style="display:inline-block;padding:14px 32px;border-radius:12px;
                        background:#0d9488;color:white;font-weight:700;text-decoration:none">
                Reset Password →
              </a>
            </div>
            <p style="color:#475569;font-size:13px">
              If you didn't request this, ignore this email — your password won't change.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error("sendPasswordResetEmail error:", err);
    return { success: false, error: err.message };
  }
}
