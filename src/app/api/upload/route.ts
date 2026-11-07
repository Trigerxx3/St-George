import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "image/gif",
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only image files (JPG, PNG, WebP, AVIF, SVG) are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean filename
    const ext = path.extname(file.name) || ".jpg";
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
      const supabase = createClient();
      await supabase.storage.from("site-assets").upload(`products/${fileName}`, buffer, {
        contentType: file.type,
        upsert: true,
      });
    } catch {
      // Local file is already saved and accessible
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

