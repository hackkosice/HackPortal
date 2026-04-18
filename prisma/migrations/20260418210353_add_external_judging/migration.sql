-- CreateTable
CREATE TABLE "ExternalJudge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    CONSTRAINT "ExternalJudge_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExternalTeamJudging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalJudgeId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "judgingSlotId" INTEGER NOT NULL,
    "judgingVerdict" TEXT,
    CONSTRAINT "ExternalTeamJudging_externalJudgeId_fkey" FOREIGN KEY ("externalJudgeId") REFERENCES "ExternalJudge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExternalTeamJudging_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExternalTeamJudging_judgingSlotId_fkey" FOREIGN KEY ("judgingSlotId") REFERENCES "JudgingSlot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalJudge_accessToken_key" ON "ExternalJudge"("accessToken");
