import { NextResponse } from "next/server";
import { QuoteRequestSchema } from "@/lib/validations";
import { sendNotificationEmail } from "@/lib/email";
import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { escapeHtml } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check honeypot
    if (body.honeypot) {
      return NextResponse.json({ success: true, id: "STG-BOT" });
    }

    const validation = QuoteRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;
    const refId = `STG-Q${Math.floor(100000 + Math.random() * 900000)}`;

    const messageDetails = `Property: ${data.propertyType} | Quarterly Bill: ${data.billAmount || "N/A"}${data.message ? ` | Notes: ${data.message}` : ""}`;

    // Store in Supabase enquiries table (if configured)
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
    ) {
      try {
        const supabase = await createClient();
        await supabase.from("enquiries").insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            suburb: `${data.suburb} ${data.postcode}`,
            service_type: data.serviceType,
            message: messageDetails,
            status: "new",
          },
        ]);
      } catch (dbErr) {
        console.warn("[Quote Supabase Insert Warning]", dbErr);
      }
    }

    // Prepare email notification for Justin
    const emailSubject = `[New Quote Lead #${refId}] ${data.serviceType} - ${data.name} (${data.suburb})`;
    const emailBody = `
New Quote Request Received:
---------------------------
Reference: ${refId}
Service Type: ${data.serviceType}
Property Type: ${data.propertyType}
Location: ${data.suburb}, ${data.postcode}
Quarterly Bill: ${data.billAmount || "N/A"}
Customer Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Notes: ${data.message || "None provided"}
Timestamp: ${new Date().toISOString()}
    `.trim();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const safeName = escapeHtml(data.name);
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safeService = escapeHtml(data.serviceType);
    const safeProperty = escapeHtml(data.propertyType);
    const safeLocation = `${escapeHtml(data.suburb)}, ${escapeHtml(data.postcode)}`;
    const safeBill = escapeHtml(data.billAmount) || "Not specified";
    const safeNotes = data.message ? escapeHtml(data.message).replace(/\n/g, "<br>") : null;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
    <!-- Top Brand Header -->
    <div style="background-color:#071522;padding:28px 32px;color:#ffffff;border-bottom:3px solid #e8751a;">
      <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#e8751a;margin-bottom:6px;">
        St George Electrical · Lead Notification
      </div>
      <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">
        New Quote Request
      </h1>
      <div style="margin-top:10px;display:inline-block;padding:4px 12px;background:rgba(232,117,26,0.18);border:1px solid rgba(232,117,26,0.4);border-radius:999px;font-size:12px;font-weight:700;color:#f97316;font-family:monospace;">
        Ref ID: ${refId}
      </div>
    </div>

    <!-- Body Details -->
    <div style="padding:32px;">
      <!-- Customer Primary Card -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;margin-bottom:8px;">
          Customer Contact
        </div>
        <div style="font-size:18px;font-weight:800;color:#071522;margin-bottom:12px;">
          ${safeName}
        </div>
        <div style="margin-bottom:8px;font-size:14px;">
          <strong>Phone:</strong> <a href="tel:${safePhone}" style="color:#e8751a;text-decoration:none;font-weight:700;">${safePhone}</a>
        </div>
        <div style="font-size:14px;">
          <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#e8751a;text-decoration:none;">${safeEmail}</a>
        </div>
      </div>

      <!-- Project & Service Specs -->
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 0;color:#64748b;font-weight:600;width:40%;">Service Division:</td>
          <td style="padding:10px 0;color:#071522;font-weight:700;text-align:right;">${safeService}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 0;color:#64748b;font-weight:600;">Property Type:</td>
          <td style="padding:10px 0;color:#071522;font-weight:700;text-align:right;">${safeProperty}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 0;color:#64748b;font-weight:600;">Location:</td>
          <td style="padding:10px 0;color:#071522;font-weight:700;text-align:right;">${safeLocation}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 0;color:#64748b;font-weight:600;">Approx. Power Bill:</td>
          <td style="padding:10px 0;color:#071522;font-weight:700;text-align:right;">${safeBill}</td>
        </tr>
      </table>

      ${
        safeNotes
          ? `
      <div style="margin-bottom:28px;">
        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;margin-bottom:6px;">
          Customer Notes / Requirements
        </div>
        <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;padding:14px;font-size:13px;line-height:1.6;color:#334155;">
          ${safeNotes}
        </div>
      </div>
      `
          : ""
      }

      <!-- Action Buttons -->
      <div style="text-align:center;padding-top:8px;">
        <a href="tel:${safePhone}" style="display:inline-block;padding:12px 24px;background-color:#e8751a;color:#ffffff;text-decoration:none;font-weight:800;font-size:13px;border-radius:10px;margin-right:8px;box-shadow:0 2px 6px rgba(232,117,26,0.35);">
          📞 Call Customer Now
        </a>
        <a href="mailto:${safeEmail}?subject=St%20George%20Electrical%20Quote%20Follow-up%20(${refId})" style="display:inline-block;padding:12px 24px;background-color:#071522;color:#ffffff;text-decoration:none;font-weight:800;font-size:13px;border-radius:10px;">
          ✉️ Reply via Email
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;">
      This lead was captured from the St George Electrical website (<a href="${siteUrl}" style="color:#64748b;">${siteUrl}</a>) at ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })} AEST.
    </div>
  </div>
</body>
</html>
    `.trim();

    await sendNotificationEmail({
      to: BUSINESS.email,
      subject: emailSubject,
      text: emailBody,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      id: refId,
      message: "Quote request submitted successfully",
    });
  } catch (error) {
    console.error("[Quote API Error]", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
