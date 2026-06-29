import { pgTable, text, real, bigint, index } from "drizzle-orm/pg-core";

// A cook session — one smoke from light-the-fire to done.
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  cutType: text("cut_type").notNull(),
  probe1Role: text("probe1_role").notNull().default("grate"), // 'grate' | 'meat'
  probe2Role: text("probe2_role").notNull().default("meat"),
  probe1Label: text("probe1_label").notNull().default("Probe One"),
  probe2Label: text("probe2_label").notNull().default("Probe Two"),
  startedAt: bigint("started_at", { mode: "number" }).notNull(),
  endedAt: bigint("ended_at", { mode: "number" }),
  doneTargetTemp: real("done_target_temp"),
  status: text("status").notNull().default("active"), // 'active' | 'done'
  notes: text("notes"),
});

// A single plotted reading: the two temperatures read off the receiver at a
// moment in time (grate + meat, after probe roles are resolved).
export const readings = pgTable(
  "readings",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    grateTemp: real("grate_temp"),
    meatTemp: real("meat_temp"),
    source: text("source").notNull().default("photo"), // 'photo' | 'manual'
    photoUrl: text("photo_url"),
  },
  (t) => ({
    sessionIdx: index("readings_session_idx").on(t.sessionId),
  })
);

// A discrete logged event — spritz, wrap, photo — drawn as a pin on the graph.
export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    type: text("type").notNull(), // 'spritz' | 'wrap' | 'photo' | 'custom'
    note: text("note"),
    photoUrl: text("photo_url"),
  },
  (t) => ({
    sessionIdx: index("events_session_idx").on(t.sessionId),
  })
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Reading = typeof readings.$inferSelect;
export type NewReading = typeof readings.$inferInsert;
export type CookEvent = typeof events.$inferSelect;
export type NewCookEvent = typeof events.$inferInsert;
