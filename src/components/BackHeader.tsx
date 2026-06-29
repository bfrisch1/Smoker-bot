import Link from "next/link";

interface BackHeaderProps {
  href: string;
  title: string;
  children?: React.ReactNode; // optional trailing content (icon, status, share)
  leading?: React.ReactNode; // optional element between back arrow and title
  closeGlyph?: boolean; // use ✕ instead of ‹
}

/** Screen header with a back/close affordance and an Ultra title. */
export function BackHeader({
  href,
  title,
  children,
  leading,
  closeGlyph = false,
}: BackHeaderProps) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 10,
        padding: "10px 16px 12px",
        borderBottom: "1px solid #cdb789",
      }}
    >
      <Link href={href} style={{ fontSize: closeGlyph ? 17 : 18, color: "#2B1D10", textDecoration: "none" }}>
        {closeGlyph ? "✕" : "‹"}
      </Link>
      {leading}
      <span className="font-display flex-1" style={{ fontSize: 16, color: "#2B1D10" }}>
        {title}
      </span>
      {children}
    </div>
  );
}
