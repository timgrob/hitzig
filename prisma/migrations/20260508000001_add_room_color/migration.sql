ALTER TABLE "Room" ADD COLUMN "color" TEXT NOT NULL DEFAULT '#a1a1aa';

UPDATE "Room"
SET "color" = '#38bdf8'
WHERE "name" = 'Maiensäss';

UPDATE "Room"
SET "color" = '#a78bfa'
WHERE "name" = 'Churwalden';
