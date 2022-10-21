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
