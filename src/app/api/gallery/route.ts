import { NextResponse } from "next/server";
import {
  getStoredGalleryItems,
  saveStoredGalleryItems,
  resetStoredGalleryItems,
} from "@/lib/gallery-store";
import { GalleryItem } from "@/types/catalogue";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const showAll = url.searchParams.get("all") === "true";

    const allItems = getStoredGalleryItems();
    const items = showAll ? allItems : allItems.filter((i) => i.isActive !== false);

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Authenticate admin session if Supabase is active
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
    ) {
      try {
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
      } catch (authErr) {
        console.warn("Gallery auth check error (proceeding in fallback mode):", authErr);
      }
    }

    const body = await req.json();
    const { action, item, id, isActive } = body;
    let items = [...getStoredGalleryItems()];

    // 1. Toggle active / disabled
    if (action === "toggle") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Item ID required" }, { status: 400 });
      }
      items = items.map((i) => {
        if (i.id === id) {
          const newActive = isActive !== undefined ? Boolean(isActive) : !(i.isActive !== false);
          return { ...i, isActive: newActive };
        }
        return i;
      });
      saveStoredGalleryItems(items);
      return NextResponse.json({ success: true, items });
    }

    // 2. Add new item
    if (action === "add") {
      if (!item || !item.title || !item.image) {
        return NextResponse.json(
          { success: false, error: "Title and Image are required" },
          { status: 400 }
        );
      }
      const newItem: GalleryItem = {
        id: item.id || `proj-${Date.now()}`,
        title: item.title,
        category: item.category || "solar",
        categoryLabel: item.categoryLabel || "Solar & Battery",
        suburb: item.suburb || "Canberra, ACT",
        system: item.system || "Custom Installation",
        description: item.description || "",
        results: Array.isArray(item.results) ? item.results : [],
        image: item.image,
        clientQuote: item.clientQuote || "",
        clientName: item.clientName || "",
        sort_order: Number(item.sort_order) || items.length + 1,
        isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
        created_at: new Date().toISOString(),
      };
      items = [newItem, ...items];
      saveStoredGalleryItems(items);
      return NextResponse.json({ success: true, items });
    }

    // 3. Edit / Update existing item
    if (action === "edit" || action === "update") {
      if (!item || !item.id) {
        return NextResponse.json(
          { success: false, error: "Item ID required for update" },
          { status: 400 }
        );
      }
      items = items.map((i) =>
        i.id === item.id
          ? {
              ...i,
              ...item,
              sort_order: item.sort_order !== undefined ? Number(item.sort_order) : i.sort_order,
              isActive: item.isActive !== undefined ? Boolean(item.isActive) : i.isActive,
            }
          : i
      );
      saveStoredGalleryItems(items);
      return NextResponse.json({ success: true, items });
    }

    // 4. Delete item
    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Item ID required for delete" }, { status: 400 });
      }
      items = items.filter((i) => i.id !== id);
      saveStoredGalleryItems(items);
      return NextResponse.json({ success: true, items });
    }

    // 5. Reset to defaults
    if (action === "reset") {
      const defaults = resetStoredGalleryItems();
      return NextResponse.json({ success: true, items: defaults });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Gallery POST handler error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

