-- CreateTable
CREATE TABLE "JudgingSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    CONSTRAINT "JudgingSlot_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamJudging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judgingVerdict" TEXT,
    "organizerId" INTEGER NOT NULL,
    "judgingSlotId" INTEGER NOT NULL,
    CONSTRAINT "TeamJudging_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamJudging_judgingSlotId_fkey" FOREIGN KEY ("judgingSlotId") REFERENCES "JudgingSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
