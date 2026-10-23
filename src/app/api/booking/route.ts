import { NextResponse } from "next/server";
import { BookingRequestSchema } from "@/lib/validations";
import { sendNotificationEmail } from "@/lib/email";
import { BUSINESS } from "@/lib/constants";

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

    await sendNotificationEmail({
      to: BUSINESS.email,
      subject: emailSubject,
      text: emailBody,
      html: `<div style="font-family:sans-serif;line-height:1.5;">
        <h2 style="color:#0F2238;">New Booking Request (${bookingId})</h2>
        <p><strong>Urgency:</strong> <span style="color:#E8751A;font-weight:bold;">${data.urgency.toUpperCase()}</span></p>
        <p><strong>Customer:</strong> ${data.name} (<a href="tel:${data.phone}">${data.phone}</a> | <a href="mailto:${data.email}">${data.email}</a>)</p>
        <p><strong>Service:</strong> ${data.serviceType}</p>
        <p><strong>Site:</strong> ${data.address}, ${data.suburb} ${data.postcode}</p>
        <p><strong>Requested Timing:</strong> ${data.preferredDate} (${data.preferredTime})</p>
        <p><strong>Description:</strong> ${data.description}</p>
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
