import { BUSINESS } from "./constants";

interface SendEmailParams {
  to?: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Sends an email notification using Resend if RESEND_API_KEY is configured.
 * In development or when unconfigured, logs to console for verification.
 */
export async function sendNotificationEmail({
  to = BUSINESS.email,
  subject,
  text,
  html,
}: SendEmailParams): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    console.log(`[Email Mock Text]:\n${text}`);
    return { success: true, id: "mock-" + Date.now() };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "St George Electrical <notifications@stgeorgeelectrical.com.au>",
        to: [to],
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Email Resend Error]", err);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("[Email Dispatch Exception]", error);
    return { success: false };
  }
}
