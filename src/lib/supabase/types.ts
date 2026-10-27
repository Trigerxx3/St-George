export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ServiceCategory = "solar_battery" | "ev_charger" | "electrical";
export type ServiceSector = "domestic" | "commercial" | "industrial";
export type EnquiryStatus = "new" | "contacted" | "quoted" | "closed";

export type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: ServiceCategory;
          description: string | null;
          sector: ServiceSector;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: ServiceCategory;
          description?: string | null;
          sector: ServiceSector;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: ServiceCategory;
          description?: string | null;
          sector?: ServiceSector;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      enquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          suburb: string | null;
          service_type: string | null;
          message: string;
          status: EnquiryStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          suburb?: string | null;
          service_type?: string | null;
          message: string;
          status?: EnquiryStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          suburb?: string | null;
          service_type?: string | null;
          message?: string;
          status?: EnquiryStatus;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          text: string;
          rating: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          text: string;
          rating?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          text?: string;
          rating?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      gallery: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
        };
        Relationships: GenericRelationship[];
      };
      admin_users: {
        Row: {
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      keepalive: {
        Row: {
          id: string;
          pinged_at: string;
        };
        Insert: {
          id?: string;
          pinged_at?: string;
        };
        Update: {
          id?: string;
          pinged_at?: string;
        };
        Relationships: GenericRelationship[];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
