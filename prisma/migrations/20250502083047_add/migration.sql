/*
  Warnings:

  - You are about to drop the column `data` on the `roster` table. All the data in the column will be lost.
  - Added the required column `dataRoster` to the `roster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataVisual` to the `roster` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "initRoster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dataRoster" JSONB NOT NULL,
    "dataVisual" JSONB NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_roster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataRoster" JSONB NOT NULL,
    "dataVisual" JSONB NOT NULL,
    CONSTRAINT "roster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_roster" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "roster";
DROP TABLE "roster";
ALTER TABLE "new_roster" RENAME TO "roster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
