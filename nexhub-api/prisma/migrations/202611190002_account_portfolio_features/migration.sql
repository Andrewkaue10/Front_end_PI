CREATE TYPE "nexhub"."InvestmentStatus" AS ENUM (
  'NEGOTIATING',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE "nexhub"."AccountDeletionStatus" AS ENUM (
  'REQUESTED',
  'CANCELLED',
  'COMPLETED'
);

CREATE TYPE "nexhub"."SessionStatus" AS ENUM (
  'ACTIVE',
  'REVOKED',
  'EXPIRED'
);

CREATE TABLE "nexhub"."Investment" (
  "id" UUID NOT NULL,
  "investorId" UUID NOT NULL,
  "startupId" UUID NOT NULL,
  "amount" DECIMAL(16,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'BRL',
  "equityPercent" DECIMAL(7,4),
  "status" "nexhub"."InvestmentStatus" NOT NULL DEFAULT 'NEGOTIATING',
  "investedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."InvestmentDocument" (
  "id" UUID NOT NULL,
  "investmentId" UUID NOT NULL,
  "storageKey" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InvestmentDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."PortfolioUpdate" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "investmentId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "updateText" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PortfolioUpdate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."MessageRead" (
  "messageId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageRead_pkey" PRIMARY KEY ("messageId","userId")
);

CREATE TABLE "nexhub"."MessageAttachment" (
  "id" UUID NOT NULL,
  "messageId" UUID NOT NULL,
  "uploaderId" UUID NOT NULL,
  "storageKey" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."MeetingProposal" (
  "id" UUID NOT NULL,
  "connectionId" UUID NOT NULL,
  "proposerId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "status" "nexhub"."MeetingStatus" NOT NULL DEFAULT 'PROPOSED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MeetingProposal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."AccountSession" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "deviceName" TEXT NOT NULL DEFAULT '',
  "ipAddress" TEXT NOT NULL DEFAULT '',
  "status" "nexhub"."SessionStatus" NOT NULL DEFAULT 'ACTIVE',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AccountSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."TwoFactorAuth" (
  "userId" UUID NOT NULL,
  "secretEncrypted" TEXT NOT NULL,
  "recoveryCodesHash" JSONB NOT NULL DEFAULT '[]',
  "enabledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TwoFactorAuth_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "nexhub"."NotificationPreference" (
  "userId" UUID NOT NULL,
  "appEnabled" BOOLEAN NOT NULL DEFAULT true,
  "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
  "connectionEnabled" BOOLEAN NOT NULL DEFAULT true,
  "meetingEnabled" BOOLEAN NOT NULL DEFAULT true,
  "opportunityEnabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "nexhub"."AiPreference" (
  "userId" UUID NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "profileAnalysisEnabled" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AiPreference_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE "nexhub"."AccountDeletionRequest" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "status" "nexhub"."AccountDeletionStatus" NOT NULL DEFAULT 'REQUESTED',
  "reason" TEXT NOT NULL DEFAULT '',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "AccountDeletionRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."Subscription" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "planCode" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'INACTIVE',
  "provider" TEXT NOT NULL DEFAULT '',
  "providerSubscriptionId" TEXT NOT NULL DEFAULT '',
  "currentPeriodStart" TIMESTAMP(3),
  "currentPeriodEnd" TIMESTAMP(3),
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Investment_investorId_startupId_key"
ON "nexhub"."Investment"("investorId","startupId");
CREATE INDEX "Investment_investorId_status_idx"
ON "nexhub"."Investment"("investorId","status");
CREATE INDEX "Investment_startupId_status_idx"
ON "nexhub"."Investment"("startupId","status");
CREATE INDEX "InvestmentDocument_investmentId_createdAt_idx"
ON "nexhub"."InvestmentDocument"("investmentId","createdAt");
CREATE INDEX "PortfolioUpdate_investmentId_createdAt_idx"
ON "nexhub"."PortfolioUpdate"("investmentId","createdAt");
CREATE INDEX "MessageRead_userId_readAt_idx"
ON "nexhub"."MessageRead"("userId","readAt");
CREATE INDEX "MessageAttachment_messageId_createdAt_idx"
ON "nexhub"."MessageAttachment"("messageId","createdAt");
CREATE INDEX "MeetingProposal_connectionId_startsAt_idx"
ON "nexhub"."MeetingProposal"("connectionId","startsAt");
CREATE UNIQUE INDEX "AccountSession_tokenHash_key"
ON "nexhub"."AccountSession"("tokenHash");
CREATE INDEX "AccountSession_userId_status_expiresAt_idx"
ON "nexhub"."AccountSession"("userId","status","expiresAt");
CREATE UNIQUE INDEX "AccountDeletionRequest_userId_key"
ON "nexhub"."AccountDeletionRequest"("userId");
CREATE INDEX "AccountDeletionRequest_status_scheduledFor_idx"
ON "nexhub"."AccountDeletionRequest"("status","scheduledFor");
CREATE UNIQUE INDEX "Subscription_userId_key"
ON "nexhub"."Subscription"("userId");
CREATE INDEX "Subscription_status_currentPeriodEnd_idx"
ON "nexhub"."Subscription"("status","currentPeriodEnd");

ALTER TABLE "nexhub"."Investment"
ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "nexhub"."Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "Investment_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "nexhub"."Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."InvestmentDocument"
ADD CONSTRAINT "InvestmentDocument_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "nexhub"."Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."PortfolioUpdate"
ADD CONSTRAINT "PortfolioUpdate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "PortfolioUpdate_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "nexhub"."Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."MessageRead"
ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "nexhub"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."MessageAttachment"
ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "nexhub"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "MessageAttachment_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."MeetingProposal"
ADD CONSTRAINT "MeetingProposal_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "nexhub"."Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "MeetingProposal_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."AccountSession"
ADD CONSTRAINT "AccountSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."TwoFactorAuth"
ADD CONSTRAINT "TwoFactorAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."NotificationPreference"
ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."AiPreference"
ADD CONSTRAINT "AiPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."AccountDeletionRequest"
ADD CONSTRAINT "AccountDeletionRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."Subscription"
ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
