import React from "react";
import { BUSINESS } from "@/lib/constants";

/**
 * Clean Lucide-compatible Facebook icon.
 */
export function FacebookIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/**
 * Clean Lucide-compatible Instagram icon.
 */
export function InstagramIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface SocialLinksProps {
  className?: string;
  variant?: "circle" | "pill";
  size?: "sm" | "md" | "lg";
}

export function SocialLinks({
  className = "flex items-center gap-3",
  variant = "circle",
  size = "md",
}: SocialLinksProps) {
  const items = [
    {
      name: "Facebook",
      href: BUSINESS.social.facebook,
      icon: FacebookIcon,
      hoverClass: "hover:border-[#1877f2] hover:text-[#1877f2] hover:bg-[#1877f2]/15 hover:shadow-[0_0_12px_rgba(24,119,242,0.3)]",
    },
    {
      name: "Instagram",
      href: BUSINESS.social.instagram,
      icon: InstagramIcon,
      hoverClass: "hover:border-[#e4405f] hover:text-[#e4405f] hover:bg-[#e4405f]/15 hover:shadow-[0_0_12px_rgba(228,64,95,0.3)]",
    },
  ].filter((item) => Boolean(item.href));

  if (items.length === 0) return null;

  if (variant === "pill") {
    return (
      <div className={className} aria-label="Social media profiles">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-xs sm:text-sm transition-all duration-300 hover:scale-[1.03] active:scale-95 group shadow-sm ${item.hoverClass}`}
              aria-label={`Visit St George Electrical on ${item.name}`}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  // Circular icon buttons
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }[size];

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  return (
    <div className={className} aria-label="Social media profiles">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sizeClasses} rounded-full bg-white/5 border border-white/15 text-[#cbd5e1] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group shadow-sm ${item.hoverClass}`}
            aria-label={`Visit St George Electrical on ${item.name}`}
            title={`Follow St George Electrical on ${item.name}`}
          >
            <Icon className={`${iconSizes} shrink-0 transition-transform duration-300 group-hover:scale-110`} />
          </a>
        );
      })}
    </div>
  );
}
