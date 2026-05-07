import {
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const resumeStatus = pgEnum("reservation_status", [
  "pending",
  "processed",
]);

export const jobStatus = pgEnum("job_status", ["pending", "processed"]);

export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email").unique(),
  filePath: varchar("filePath"),
  status: resumeStatus("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  metadata: jsonb(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title").notNull(),
  status: jobStatus("status").default("pending").notNull(),
  description: varchar("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export type ReservationStatus = (typeof resumeStatus.enumValues)[number];

export type JobStatus = (typeof jobStatus.enumValues)[number];
