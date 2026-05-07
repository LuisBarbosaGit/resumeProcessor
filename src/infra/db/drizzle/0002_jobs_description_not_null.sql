UPDATE "jobs" SET "description" = '' WHERE "description" IS NULL;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "description" SET NOT NULL;
