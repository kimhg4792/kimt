-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "user_pass" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_birth" INTEGER NOT NULL,
    "user_address" TEXT NOT NULL,
    "user_emailAddress" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "auth" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "chart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "xaxis" INTEGER NOT NULL,
    "yaxis" INTEGER NOT NULL,
    "zaxis" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "r" INTEGER NOT NULL,
    "g" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "a" REAL NOT NULL,
    "width" REAL NOT NULL,
    "opacity" REAL NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_id_key" ON "Users"("user_id");
