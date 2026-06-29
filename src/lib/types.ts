// Shared domain types and reference data for Butcher's Log.

export type CutType =
  | "brisket"
  | "pork_butt"
  | "steak"
  | "chuck"
  | "chicken"
  | "turkey"
  | "baby_back"
  | "spare_rib"
  | "pork_belly"
  | "salmon";

export type ProbeRole = "grate" | "meat";

export type SessionStatus = "active" | "done";

export type ReadingSource = "photo" | "manual";

export type EventType = "spritz" | "wrap" | "photo" | "custom";

export const CUT_TYPES: CutType[] = [
  "brisket",
  "pork_butt",
  "steak",
  "chuck",
  "chicken",
  "turkey",
  "baby_back",
  "spare_rib",
  "pork_belly",
  "salmon",
];

export const CUT_LABELS: Record<CutType, string> = {
  brisket: "BRISKET",
  pork_butt: "PORK BUTT",
  steak: "STEAK",
  chuck: "CHUCK",
  chicken: "CHICKEN",
  turkey: "TURKEY",
  baby_back: "BABY BACK",
  spare_rib: "SPARE RIB",
  pork_belly: "PORK BELLY",
  salmon: "SALMON",
};

// Typical pull / "done" internal temperature per cut (°F). Used for the
// graph's "done zone" band and as the default doneTargetTemp on a new cook.
export const DONE_TARGET_TEMPS: Record<CutType, number> = {
  brisket: 203,
  pork_butt: 203,
  steak: 130,
  chuck: 205,
  chicken: 165,
  turkey: 165,
  baby_back: 200,
  spare_rib: 200,
  pork_belly: 200,
  salmon: 145,
};

export const EVENT_LABELS: Record<EventType, string> = {
  spritz: "SPRITZ",
  wrap: "WRAP",
  photo: "PHOTO",
  custom: "NOTE",
};
