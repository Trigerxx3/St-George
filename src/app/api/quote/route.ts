import { NextResponse } from "next/server";
import { QuoteRequestSchema } from "@/lib/validations";
import { sendNotificationEmail } from "@/lib/email";
import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

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

    await sendNotificationEmail({
      to: BUSINESS.email,
      subject: emailSubject,
      text: emailBody,
      html: `<div style="font-family:sans-serif;line-height:1.5;">
        <h2 style="color:#0F2238;">New Quote Request (${refId})</h2>
        <p><strong>Customer:</strong> ${data.name} (<a href="tel:${data.phone}">${data.phone}</a> | <a href="mailto:${data.email}">${data.email}</a>)</p>
        <p><strong>Service:</strong> ${data.serviceType}</p>
        <p><strong>Property:</strong> ${data.propertyType} in ${data.suburb}, ${data.postcode}</p>
        <p><strong>Quarterly Bill:</strong> ${data.billAmount || "N/A"}</p>
        <p><strong>Notes:</strong> ${data.message || "None"}</p>
      </div>`,
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
