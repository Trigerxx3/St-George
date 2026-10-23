import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/catalogue-data";
import { Boxes, ExternalLink, Plus } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold text-navy"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Product Catalogue Inventory
          </h1>
          <p className="text-gray-500 text-sm">
            {PRODUCTS.length} live products across {CATEGORIES.length} categories.
          </p>
        </div>
        <Link href="/products" target="_blank" className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5">
          <span>View Public Storefront</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Efficiency / Capacity</th>
                <th className="p-4">Warranty</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {PRODUCTS.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/80">
                  <td className="p-4">
                    <div className="font-bold text-navy">{prod.name}</div>
                    <div className="text-[11px] text-gray-400">{prod.shortDesc.slice(0, 50)}...</div>
                  </td>
                  <td className="p-4 font-semibold text-navy">{prod.categoryName}</td>
                  <td className="p-4">{prod.efficiency || "Standard"}</td>
                  <td className="p-4 text-gray-500 truncate max-w-[200px]">{prod.warranty}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-green/10 text-green font-bold text-[10px]">
                      Published
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/products/${prod.categorySlug}/${prod.slug}`}
                      className="text-green hover:underline font-semibold"
                      target="_blank"
                    >
                      View Live
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
