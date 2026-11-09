import { NextResponse } from "next/server";
import {
  getStoredPackages,
  saveStoredPackages,
  resetStoredPackages,
} from "@/lib/packages-store";
import { PackageItem } from "@/types/catalogue";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const packages = getStoredPackages();
    return NextResponse.json({ success: true, packages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
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

    const body = await req.json();
    const { action, pkg, id, isActive } = body;
    let packages = [...getStoredPackages()];

    if (action === "toggle") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Package ID required" }, { status: 400 });
      }
      packages = packages.map((p) => {
        if (p.id === id) {
          const newActive = isActive !== undefined ? isActive : !(p.isActive !== false);
          return { ...p, isActive: newActive };
        }
        return p;
      });
      saveStoredPackages(packages);
      return NextResponse.json({ success: true, packages });
    }

    if (action === "add") {
      if (!pkg || !pkg.name) {
        return NextResponse.json({ success: false, error: "Valid package data required" }, { status: 400 });
      }
      const newPkg: PackageItem = {
        ...pkg,
        id: pkg.id || `pkg-custom-${Date.now()}`,
        slug:
          pkg.slug ||
          pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        isActive: pkg.isActive !== undefined ? pkg.isActive : true,
        includedItems: Array.isArray(pkg.includedItems) ? pkg.includedItems : [],
        features: Array.isArray(pkg.features) ? pkg.features : [],
        rebateEligible: pkg.rebateEligible !== undefined ? pkg.rebateEligible : true,
      };
      packages = [newPkg, ...packages];
      saveStoredPackages(packages);
      return NextResponse.json({ success: true, packages });
    }

    if (action === "edit") {
      if (!pkg || !pkg.id) {
        return NextResponse.json({ success: false, error: "Package ID required for edit" }, { status: 400 });
      }
      packages = packages.map((p) => (p.id === pkg.id ? { ...p, ...pkg } : p));
      saveStoredPackages(packages);
      return NextResponse.json({ success: true, packages });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "Package ID required for delete" }, { status: 400 });
      }
      packages = packages.filter((p) => p.id !== id);
      saveStoredPackages(packages);
      return NextResponse.json({ success: true, packages });
    }

    if (action === "reset") {
      const defaults = resetStoredPackages();
      return NextResponse.json({ success: true, packages: defaults });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("API packages error:", error);
    return NextResponse.json(
      { success: false, error: "Server error handling packages" },
      { status: 500 }
    );
  }
}

