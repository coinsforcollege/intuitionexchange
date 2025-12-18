-- CreateEnum
CREATE TYPE "AppMode" AS ENUM ('LEARNER', 'INVESTOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "appMode" "AppMode" NOT NULL DEFAULT 'LEARNER';
