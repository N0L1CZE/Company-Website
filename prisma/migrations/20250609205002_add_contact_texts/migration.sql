-- CreateTable
CREATE TABLE "ContactText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactText_key_key" ON "ContactText"("key");
