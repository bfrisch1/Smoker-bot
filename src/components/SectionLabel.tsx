interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/** "▸ NOW SMOKING" style mono section header. */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`font-mono text-red-ink ${className}`}
      style={{ fontSize: 10, letterSpacing: "2px" }}
    >
      ▸ {children}
    </div>
  );
}
