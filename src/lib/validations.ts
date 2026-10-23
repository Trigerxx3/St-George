import { z } from "zod";

export const QuoteRequestSchema = z.object({
  serviceType: z.enum(["solar-battery", "ev-chargers", "electrical", "other"], {
    message: "Please select a service",
  }),
  propertyType: z.enum(["house", "townhouse", "unit", "commercial", "industrial"], {
    message: "Please select a property type",
  }),
  suburb: z.string().min(2, "Suburb is required"),
  postcode: z.string().regex(/^[0-9]{4}$/, "Please enter a valid 4-digit Australian postcode"),
  billAmount: z.string().optional(),
  systemSize: z.string().optional(),
  productId: z.string().optional(),
  packageId: z.string().optional(),
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid Australian phone number"),
  message: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>;

export const BookingRequestSchema = z.object({
  serviceType: z.string().min(2, "Please select or enter the required service"),
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid Australian phone number"),
  address: z.string().min(5, "Please enter your street address"),
  suburb: z.string().min(2, "Suburb is required"),
  postcode: z.string().regex(/^[0-9]{4}$/, "Please enter a valid 4-digit Australian postcode"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.enum(["morning", "afternoon", "anytime"], {
    message: "Please select a preferred time of day",
  }),
  urgency: z.enum(["urgent", "normal", "flexible"]).default("normal"),
  description: z.string().min(5, "Please describe the work required or issue"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type BookingRequestInput = z.infer<typeof BookingRequestSchema>;

export const ContactRequestSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid Australian phone number"),
  subject: z.string().min(2, "Please enter a subject"),
  message: z.string().min(10, "Please enter a message (at least 10 characters)"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ContactRequestInput = z.infer<typeof ContactRequestSchema>;
