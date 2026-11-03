import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** e.g. "03 — Our services" (rendered uppercase) */
  eyebrow?: string;
  /** First line, base text colour */
  line1: ReactNode;
  /** Second line, accent colour */
  line2?: ReactNode;
  /** Optional intro paragraph shown on the right on desktop */
  intro?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}

/** Eyebrow + two-line heading (second line accent) + optional right-hand intro. Inherits dark/light from the parent section. */
export default function SectionHeading({
  eyebrow,
  line1,
  line2,
  intro,
  as: Tag = "h2",
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 lg:mb-14 ${intro ? "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-end" : ""} ${className}`}
    >
      <div>
        {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
        <Tag className="text-3xl sm:text-4xl lg:text-5xl">
          {line1}
          {line2 && (
            <>
              <br />
              <span className="text-accent">{line2}</span>
            </>
          )}
        </Tag>
      </div>
      {intro && <p className="text-body-muted text-base leading-relaxed max-w-xl lg:justify-self-end">{intro}</p>}
    </div>
  );
}
