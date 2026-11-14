import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, enquiries: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // Authenticate admin user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { id, all } = body;

    if (all === true) {
      // Delete all enquiries
      const { error } = await supabase
        .from("enquiries")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "All enquiries successfully removed." });
    }

    if (id) {
      // Delete specific enquiry
      const { error } = await supabase
        .from("enquiries")
        .delete()
        .eq("id", id);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "Enquiry successfully deleted." });
    }

    return NextResponse.json({ success: false, error: "Missing enquiry id or all flag" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to delete enquiry" }, { status: 500 });
  }
}

