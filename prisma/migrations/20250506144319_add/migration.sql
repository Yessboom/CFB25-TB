/*
  Warnings:

  - You are about to drop the `equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `initRoster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "equipment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "initRoster";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "roster";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Roster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dataRoster" JSONB NOT NULL,
    "dataVisual" JSONB NOT NULL,
    CONSTRAINT "Roster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Equipment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InitRoster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dataRoster" JSONB NOT NULL,
    "dataVisual" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "portrait" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "genericid" TEXT NOT NULL,
    "recipe" TEXT NOT NULL,
    "complexionId" TEXT NOT NULL,
    "imagelink" TEXT NOT NULL,
    "thumbnaillink" TEXT NOT NULL
);
