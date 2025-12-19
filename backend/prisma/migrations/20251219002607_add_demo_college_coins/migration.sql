-- CreateTable
CREATE TABLE "demo_college_coins" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "peggedToAsset" TEXT NOT NULL,
    "peggedPercentage" DECIMAL(10,4) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "website" TEXT,
    "whitepaper" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "categories" TEXT[],
    "genesisDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_college_coins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "demo_college_coins_ticker_key" ON "demo_college_coins"("ticker");
