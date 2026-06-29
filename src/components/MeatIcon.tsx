import type { CutType } from "@/lib/types";

const SYMBOL_ID: Record<CutType, string> = {
  brisket: "m-brisket",
  pork_butt: "m-porkbutt",
  steak: "m-steak",
  chuck: "m-chuck",
  chicken: "m-chicken",
  turkey: "m-turkey",
  baby_back: "m-babyback",
  spare_rib: "m-spareribs",
  pork_belly: "m-porkbelly",
  salmon: "m-salmon",
};

interface MeatIconProps {
  cut: CutType;
  size?: number;
  className?: string;
}

/**
 * Renders one hand-drawn meat-cut icon by referencing the shared sprite.
 * <MeatIconSprite /> must be mounted once in the tree (it lives in the root
 * layout) for these references to resolve.
 */
export function MeatIcon({ cut, size = 40, className }: MeatIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      style={{ flex: "none" }}
      role="img"
      aria-label={cut.replace("_", " ")}
    >
      <use href={`#${SYMBOL_ID[cut]}`} />
    </svg>
  );
}
