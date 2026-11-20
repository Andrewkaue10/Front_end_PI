CREATE TABLE "nexhub"."AiAnalysis" (
 "id" UUID NOT NULL, "userId" UUID NOT NULL, "topic" TEXT NOT NULL, "mode" TEXT NOT NULL,
 "question" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'PENDING', "result" JSONB,
 "model" TEXT NOT NULL DEFAULT '', "promptVersion" TEXT NOT NULL,
 "inputTokens" INTEGER NOT NULL DEFAULT 0, "outputTokens" INTEGER NOT NULL DEFAULT 0,
 "durationMs" INTEGER NOT NULL DEFAULT 0, "hidden" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "AiAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "AiAnalysis_userId_createdAt_idx" ON "nexhub"."AiAnalysis"("userId", "createdAt");
CREATE INDEX "AiAnalysis_mode_createdAt_idx" ON "nexhub"."AiAnalysis"("mode", "createdAt");

ALTER TABLE "nexhub"."AiPreference" ADD COLUMN "externalProviderConsent" BOOLEAN NOT NULL DEFAULT false;
