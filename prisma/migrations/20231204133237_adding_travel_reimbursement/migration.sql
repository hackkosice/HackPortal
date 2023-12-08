-- CreateTable
CREATE TABLE "TravelReimbursementRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hackerId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "proofOfTravelFileId" INTEGER,
    "countryOfTravel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TravelReimbursementRequest_hackerId_fkey" FOREIGN KEY ("hackerId") REFERENCES "Hacker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelReimbursementRequest_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TravelReimbursementRequestStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelReimbursementRequest_proofOfTravelFileId_fkey" FOREIGN KEY ("proofOfTravelFileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TravelReimbursementRequestStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TravelReimbursementRequest_hackerId_key" ON "TravelReimbursementRequest"("hackerId");

-- CreateIndex
CREATE UNIQUE INDEX "TravelReimbursementRequest_proofOfTravelFileId_key" ON "TravelReimbursementRequest"("proofOfTravelFileId");

-- CreateIndex
CREATE UNIQUE INDEX "TravelReimbursementRequestStatus_name_key" ON "TravelReimbursementRequestStatus"("name");
