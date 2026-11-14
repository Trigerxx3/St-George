import fs from "fs";
import path from "path";
import { GalleryItem } from "@/types/catalogue";
import { DEFAULT_GALLERY } from "./gallery-data";

export { DEFAULT_GALLERY };

const DATA_FILE_PATH = path.join(process.cwd(), "data", "gallery.json");

let inMemoryGallery: GalleryItem[] | null = null;

export function getStoredGalleryItems(): GalleryItem[] {
  if (inMemoryGallery) {
    return inMemoryGallery;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryGallery = parsed.map((item, index) => ({
          ...item,
          isActive: item.isActive !== undefined ? item.isActive : true,
          sort_order: item.sort_order ?? index + 1,
        }));
        return inMemoryGallery;
      }
    }
  } catch (err) {
    console.warn("Failed to read gallery.json, falling back to defaults:", err);
  }

  inMemoryGallery = DEFAULT_GALLERY;
  // Write default to disk if not exists
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_GALLERY, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write initial gallery.json:", err);
  }

  return inMemoryGallery;
}

export function saveStoredGalleryItems(items: GalleryItem[]): boolean {
  inMemoryGallery = items;
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to write gallery.json:", err);
    return false;
  }
}

export function resetStoredGalleryItems(): GalleryItem[] {
  inMemoryGallery = DEFAULT_GALLERY;
  try {
    const dataDir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_GALLERY, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not reset gallery.json on disk:", err);
  }
  return DEFAULT_GALLERY;
}
