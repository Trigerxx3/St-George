import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB max
const VALID_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export async function POST(req: Request) {
  try {
    // 1. Authenticate admin user if Supabase is active
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
    ) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Admin session required." },
          { status: 401 }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // 2. Enforce File Size Limit (5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 5MB limit. Please upload a smaller image." },
        { status: 413 }
      );
    }

    // 3. Strict MIME Type Validation (No raw SVGs or scripts)
    if (!VALID_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only standard image formats (JPG, PNG, WebP, AVIF) are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Sanitize extension and filename
    const rawExt = path.extname(file.name).toLowerCase();
    const ext = [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(rawExt) ? rawExt : ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 40);
    const fileName = `product-${Date.now()}-${baseName}${ext}`;

    // Target folder
    const targetDir = path.join(process.cwd(), "public", "images", "products");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/images/products/${fileName}`;

    // Try Supabase Storage upload in background if available
    try {
      const supabase = await createClient();
      await supabase.storage.from("site-assets").upload(`products/${fileName}`, buffer, {
        contentType: file.type,
        upsert: true,
      });
    } catch {
      // Local file is saved and accessible
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Server failed to process uploaded file" },
      { status: 500 }
    );
  }
}
