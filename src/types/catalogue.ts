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
}

export interface PackageItem {
  id: string;
  name: string;
  slug: string;
  systemSize: string;
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
}
