-- CreateTable
CREATE TABLE "SponsorJudging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judgingVerdict" TEXT,
    "sponsorId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "judgingSlotId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SponsorJudging_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SponsorJudging_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SponsorJudging_judgingSlotId_fkey" FOREIGN KEY ("judgingSlotId") REFERENCES "JudgingSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
