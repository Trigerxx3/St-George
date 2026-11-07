import { NextResponse } from "next/server";
import {
  getStoredProducts,
  saveStoredProducts,
  resetStoredProducts,
} from "@/lib/products-store";
import { ProductItem } from "@/types/catalogue";

export async function GET() {
  try {
    const products = getStoredProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, product, id, isActive } = body;
    let products = [...getStoredProducts()];

    if (action === "toggle") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
      }
      products = products.map((p) => {
        if (p.id === id) {
          const newActive = isActive !== undefined ? isActive : !(p.isActive !== false);
          return { ...p, isActive: newActive };
        }
        return p;
      });
      saveStoredProducts(products);
      return NextResponse.json({ success: true, products });
    }

    if (action === "add") {
      if (!product || !product.name) {
        return NextResponse.json({ success: false, error: "Valid product data required" }, { status: 400 });
      }
      const newProduct: ProductItem = {
        ...product,
        id: product.id || `prod-custom-${Date.now()}`,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        isActive: product.isActive !== undefined ? product.isActive : true,
        images: Array.isArray(product.images) && product.images.length > 0 ? product.images : ["/images/products/solar-panel.jpg"],
        specs: product.specs || {},
      };
      products = [newProduct, ...products];
      saveStoredProducts(products);
      return NextResponse.json({ success: true, products });
    }

    if (action === "edit") {
      if (!product || !product.id) {
        return NextResponse.json({ success: false, error: "Product ID required for edit" }, { status: 400 });
      }
      products = products.map((p) => (p.id === product.id ? { ...p, ...product } : p));
      saveStoredProducts(products);
      return NextResponse.json({ success: true, products });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Product ID required for delete" }, { status: 400 });
      }
      products = products.filter((p) => p.id !== id);
      saveStoredProducts(products);
      return NextResponse.json({ success: true, products });
    }

    if (action === "reset") {
      const defaults = resetStoredProducts();
      return NextResponse.json({ success: true, products: defaults });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("API products error:", error);
    return NextResponse.json(
      { success: false, error: "Server error handling products" },
      { status: 500 }
    );
  }
}

