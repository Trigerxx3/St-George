import fs from "fs";
import path from "path";
import { PackageItem } from "@/types/catalogue";
import { PACKAGES } from "./catalogue-data";

const DATA_FILE_PATH = path.join(process.cwd(), "data", "packages.json");

let inMemoryPackages: PackageItem[] | null = null;

export function getStoredPackages(): PackageItem[] {
  if (inMemoryPackages) {
    return inMemoryPackages;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryPackages = parsed;
        return inMemoryPackages;
      }
    }
  } catch (err) {
    console.warn("Failed to read packages.json, falling back to default packages:", err);
  }

  const defaults = PACKAGES.map((pkg) => ({
    ...pkg,
    isActive: pkg.isActive ?? true,
  }));
  inMemoryPackages = defaults;
  return inMemoryPackages;
}

export function saveStoredPackages(packages: PackageItem[]): boolean {
  inMemoryPackages = packages;
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(packages, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write packages.json:", err);
    return false;
  }
}

export function resetStoredPackages(): PackageItem[] {
  const defaults = PACKAGES.map((pkg) => ({
    ...pkg,
    isActive: true,
  }));
  inMemoryPackages = defaults;
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(defaults, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not reset packages.json on disk:", err);
  }
  return defaults;
}

