import fs from "fs";
import path from "path";
import { ProductItem } from "@/types/catalogue";
import { PRODUCTS } from "./catalogue-data";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "products.json");

// In-memory cache for fast access and fallback
let inMemoryProducts: ProductItem[] | null = null;

export function getStoredProducts(): ProductItem[] {
  if (inMemoryProducts) {
    return inMemoryProducts;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProducts = parsed;
        return inMemoryProducts;
      }
    }
  } catch (err) {
    console.warn("Failed to read products.json, falling back to default catalogue:", err);
  }

  // Ensure default products have isActive: true
  const defaults = PRODUCTS.map((p) => ({
    ...p,
    isActive: p.isActive ?? true,
  }));
  inMemoryProducts = defaults;
  return inMemoryProducts;
}

export function saveStoredProducts(products: ProductItem[]): boolean {
  inMemoryProducts = products;
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write products.json:", err);
    return false;
  }
}

export function resetStoredProducts(): ProductItem[] {
  const defaults = PRODUCTS.map((p) => ({
    ...p,
    isActive: true,
  }));
  inMemoryProducts = defaults;
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(defaults, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not reset products.json on disk:", err);
  }
  return defaults;
}

