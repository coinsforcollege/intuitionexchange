/*
  Warnings:

  - You are about to drop the `p2p_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `p2p_transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "P2PPaymentMethodType" AS ENUM ('BANK_TRANSFER', 'UPI', 'PAYPAL', 'VENMO', 'ZELLE', 'CASH_APP', 'WISE', 'REVOLUT', 'OTHER');

-- CreateEnum
CREATE TYPE "P2PAdSide" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "P2PAdStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "P2PTradeStatus" AS ENUM ('CREATED', 'CANCELLED', 'PAID', 'DISPUTED', 'RELEASED', 'REFUNDED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "P2PEscrowStatus" AS ENUM ('LOCKED', 'RELEASED', 'UNLOCKED');

-- CreateEnum
CREATE TYPE "P2PDisputeStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "P2PDisputeOutcome" AS ENUM ('RELEASE_TO_BUYER', 'REFUND_TO_SELLER');

-- DropForeignKey
ALTER TABLE "p2p_orders" DROP CONSTRAINT "p2p_orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "p2p_transactions" DROP CONSTRAINT "p2p_transactions_orderId_fkey";

-- DropTable
DROP TABLE "p2p_orders";

-- DropTable
DROP TABLE "p2p_transactions";

-- DropEnum
DROP TYPE "P2POrderStatus";

-- CreateTable
CREATE TABLE "p2p_payment_methods" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "P2PPaymentMethodType" NOT NULL,
    "name" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "p2p_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_ads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "side" "P2PAdSide" NOT NULL,
    "asset" TEXT NOT NULL,
    "fiatCurrency" TEXT NOT NULL,
    "price" DECIMAL(20,8) NOT NULL,
    "totalQty" DECIMAL(20,8) NOT NULL,
    "remainingQty" DECIMAL(20,8) NOT NULL,
    "minQty" DECIMAL(20,8) NOT NULL,
    "maxQty" DECIMAL(20,8) NOT NULL,
    "status" "P2PAdStatus" NOT NULL DEFAULT 'ACTIVE',
    "terms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "p2p_ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_ad_payment_methods" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,

    CONSTRAINT "p2p_ad_payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_trades" (
    "id" TEXT NOT NULL,
    "tradeNumber" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "buyerUserId" TEXT NOT NULL,
    "sellerUserId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "fiatCurrency" TEXT NOT NULL,
    "qtyCrypto" DECIMAL(20,8) NOT NULL,
    "price" DECIMAL(20,8) NOT NULL,
    "notional" DECIMAL(20,8) NOT NULL,
    "paymentMethodType" "P2PPaymentMethodType" NOT NULL,
    "paymentDetails" JSONB,
    "paymentWindowSeconds" INTEGER NOT NULL DEFAULT 900,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "proofRequired" BOOLEAN NOT NULL DEFAULT true,
    "proofUrls" TEXT[],
    "status" "P2PTradeStatus" NOT NULL DEFAULT 'CREATED',
    "createIdempotencyKey" TEXT,
    "markPaidIdempotencyKey" TEXT,
    "releaseIdempotencyKey" TEXT,
    "cancelIdempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "releasedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "p2p_trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_escrows" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "qtyLocked" DECIMAL(20,8) NOT NULL,
    "status" "P2PEscrowStatus" NOT NULL DEFAULT 'LOCKED',
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),
    "unlockedAt" TIMESTAMP(3),

    CONSTRAINT "p2p_escrows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_disputes" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "openedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "evidence" TEXT[],
    "status" "P2PDisputeStatus" NOT NULL DEFAULT 'OPEN',
    "outcome" "P2PDisputeOutcome",
    "resolvedById" TEXT,
    "resolution" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "p2p_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_audit_logs" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "previousState" TEXT,
    "newState" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "p2p_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "p2p_user_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyVolumeUsd" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "dailyVolumeDate" DATE NOT NULL,
    "strikeCount" INTEGER NOT NULL DEFAULT 0,
    "lastStrikeAt" TIMESTAMP(3),
    "suspendedUntil" TIMESTAMP(3),
    "totalTradesCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalTradesCancelled" INTEGER NOT NULL DEFAULT 0,
    "totalVolumeBought" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "totalVolumeSold" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "p2p_user_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "p2p_ads_userId_idx" ON "p2p_ads"("userId");

-- CreateIndex
CREATE INDEX "p2p_ads_status_idx" ON "p2p_ads"("status");

-- CreateIndex
CREATE INDEX "p2p_ads_asset_fiatCurrency_idx" ON "p2p_ads"("asset", "fiatCurrency");

-- CreateIndex
CREATE INDEX "p2p_ads_side_status_idx" ON "p2p_ads"("side", "status");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_ad_payment_methods_adId_paymentMethodId_key" ON "p2p_ad_payment_methods"("adId", "paymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_trades_tradeNumber_key" ON "p2p_trades"("tradeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_trades_createIdempotencyKey_key" ON "p2p_trades"("createIdempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_trades_markPaidIdempotencyKey_key" ON "p2p_trades"("markPaidIdempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_trades_releaseIdempotencyKey_key" ON "p2p_trades"("releaseIdempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_trades_cancelIdempotencyKey_key" ON "p2p_trades"("cancelIdempotencyKey");

-- CreateIndex
CREATE INDEX "p2p_trades_buyerUserId_idx" ON "p2p_trades"("buyerUserId");

-- CreateIndex
CREATE INDEX "p2p_trades_sellerUserId_idx" ON "p2p_trades"("sellerUserId");

-- CreateIndex
CREATE INDEX "p2p_trades_status_idx" ON "p2p_trades"("status");

-- CreateIndex
CREATE INDEX "p2p_trades_adId_idx" ON "p2p_trades"("adId");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_escrows_tradeId_key" ON "p2p_escrows"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_disputes_tradeId_key" ON "p2p_disputes"("tradeId");

-- CreateIndex
CREATE INDEX "p2p_audit_logs_tradeId_idx" ON "p2p_audit_logs"("tradeId");

-- CreateIndex
CREATE INDEX "p2p_audit_logs_createdAt_idx" ON "p2p_audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "p2p_user_stats_userId_key" ON "p2p_user_stats"("userId");

-- AddForeignKey
ALTER TABLE "p2p_payment_methods" ADD CONSTRAINT "p2p_payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_ads" ADD CONSTRAINT "p2p_ads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_ad_payment_methods" ADD CONSTRAINT "p2p_ad_payment_methods_adId_fkey" FOREIGN KEY ("adId") REFERENCES "p2p_ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_ad_payment_methods" ADD CONSTRAINT "p2p_ad_payment_methods_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "p2p_payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_adId_fkey" FOREIGN KEY ("adId") REFERENCES "p2p_ads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_trades" ADD CONSTRAINT "p2p_trades_sellerUserId_fkey" FOREIGN KEY ("sellerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_escrows" ADD CONSTRAINT "p2p_escrows_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "p2p_trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_disputes" ADD CONSTRAINT "p2p_disputes_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "p2p_trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_disputes" ADD CONSTRAINT "p2p_disputes_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_disputes" ADD CONSTRAINT "p2p_disputes_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_audit_logs" ADD CONSTRAINT "p2p_audit_logs_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "p2p_trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2p_user_stats" ADD CONSTRAINT "p2p_user_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
