export interface ProductSpec {
  [key: string]: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  shortDesc: string;
  description: string;
  images: string[];
  specs: Record<string, string>;
  warranty: string;
  featured?: boolean;
  efficiency?: string;
  badge?: string;
  price?: string;
  isActive?: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  slug: string;
  systemSize: string;
  price?: string;
  badge?: string;
  shortDesc: string;
  description: string;
  includedItems: string[];
  features: string[];
  idealFor: string;
  estimatedOutput: string;
  rebateEligible: boolean;
  warrantySummary: string;
  featured?: boolean;
  image?: string;
  isActive?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "solar" | "ev" | "electrical" | "commercial" | "hvac" | "security";
  categoryLabel?: string;
  suburb: string;
  system?: string;
  description: string;
  results?: string[];
  image: string;
  clientQuote?: string;
  clientName?: string;
  sort_order: number;
  isActive: boolean;
  created_at?: string;
}
