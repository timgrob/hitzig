ALTER TABLE "Room" ADD COLUMN "requiresCloseFriend" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Room"
SET "requiresCloseFriend" = true
WHERE "name" <> 'Maiensäss';
