import { NextResponse } from "next/server";
import { BookingRequestSchema } from "@/lib/validations";
import { sendNotificationEmail } from "@/lib/email";
import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { escapeHtml } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, id: "BK-BOT" });
    }

    const validation = BookingRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const bookingMessage = `Urgency: ${data.urgency.toUpperCase()} | Preferred: ${data.preferredDate} (${data.preferredTime}) | Address: ${data.address} | Job: ${data.description}`;

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
            service_type: `Booking: ${data.serviceType}`,
            message: bookingMessage,
            status: "new",
          },
        ]);
      } catch (dbErr) {
        console.warn("[Booking Supabase Insert Warning]", dbErr);
      }
    }

    const emailSubject = `[Booking Request #${bookingId}] ${data.urgency.toUpperCase()}: ${data.serviceType} - ${data.name}`;
    const emailBody = `
New Booking Request:
--------------------
Reference: ${bookingId}
Urgency: ${data.urgency}
Service: ${data.serviceType}
Preferred Date: ${data.preferredDate} (${data.preferredTime})
Customer: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}, ${data.suburb} ${data.postcode}
Description:
${data.description}
    `.trim();

    const safeName = escapeHtml(data.name);
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safeService = escapeHtml(data.serviceType);
    const safeUrgency = escapeHtml(data.urgency).toUpperCase();
    const safeSite = `${escapeHtml(data.address)}, ${escapeHtml(data.suburb)} ${escapeHtml(data.postcode)}`;
    const safeTiming = `${escapeHtml(data.preferredDate)} (${escapeHtml(data.preferredTime)})`;
    const safeDesc = escapeHtml(data.description).replace(/\n/g, "<br/>");

    await sendNotificationEmail({
      to: BUSINESS.email,
      subject: emailSubject,
      text: emailBody,
      html: `<div style="font-family:sans-serif;line-height:1.5;">
        <h2 style="color:#0F2238;">New Booking Request (${bookingId})</h2>
        <p><strong>Urgency:</strong> <span style="color:#E8751A;font-weight:bold;">${safeUrgency}</span></p>
        <p><strong>Customer:</strong> ${safeName} (<a href="tel:${safePhone}">${safePhone}</a> | <a href="mailto:${safeEmail}">${safeEmail}</a>)</p>
        <p><strong>Service:</strong> ${safeService}</p>
        <p><strong>Site:</strong> ${safeSite}</p>
        <p><strong>Requested Timing:</strong> ${safeTiming}</p>
        <p><strong>Description:</strong></p>
        <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #e8751a;">${safeDesc}</blockquote>
      </div>`,
    });

    return NextResponse.json({
      success: true,
      id: bookingId,
      message: "Booking request submitted successfully",
    });
  } catch (error) {
    console.error("[Booking API Error]", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
