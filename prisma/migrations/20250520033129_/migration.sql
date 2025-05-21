/*
  Warnings:

  - You are about to drop the column `created_at` on the `punch_clocks` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_punch_clocks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "punch_clocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_punch_clocks" ("id", "timestamp", "type", "userId") SELECT "id", "timestamp", "type", "userId" FROM "punch_clocks";
DROP TABLE "punch_clocks";
ALTER TABLE "new_punch_clocks" RENAME TO "punch_clocks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
