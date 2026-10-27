import { NextResponse } from "next/server";
import { ContactRequestSchema } from "@/lib/validations";
import { sendNotificationEmail } from "@/lib/email";
import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, id: "CT-BOT" });
    }

    const validation = ContactRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;
    const contactId = `CT-${Math.floor(100000 + Math.random() * 900000)}`;

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
            suburb: null,
            service_type: data.subject || "General Contact",
            message: data.message,
            status: "new",
          },
        ]);
      } catch (dbErr) {
        console.warn("[Contact Supabase Insert Warning]", dbErr);
      }
    }

    const emailSubject = `[Website Contact Inquiry #${contactId}] ${data.subject} - ${data.name}`;
    const emailBody = `
New Website Contact Inquiry:
---------------------------
Reference: ${contactId}
From: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}
Message:
${data.message}
    `.trim();

    await sendNotificationEmail({
      to: BUSINESS.email,
      subject: emailSubject,
      text: emailBody,
      html: `<div style="font-family:sans-serif;line-height:1.5;">
        <h2 style="color:#0F2238;">New Website Contact Message (${contactId})</h2>
        <p><strong>From:</strong> ${data.name} (<a href="tel:${data.phone}">${data.phone}</a> | <a href="mailto:${data.email}">${data.email}</a>)</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #4C8C2B;">${data.message}</blockquote>
      </div>`,
    });

    return NextResponse.json({
      success: true,
      id: contactId,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
