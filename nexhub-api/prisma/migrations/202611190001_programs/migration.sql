-- CreateTable
CREATE TABLE "nexhub"."Program" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "stage" TEXT NOT NULL DEFAULT '',
    "benefit" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "applicationsOpenAt" TIMESTAMP(3) NOT NULL,
    "applicationsCloseAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Fortaleza',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."ProgramSave" (
    "userId" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgramSave_pkey" PRIMARY KEY ("userId","programId")
);

CREATE TABLE "nexhub"."ProgramApplication" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startupId" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProgramApplication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."ProgramAlert" (
    "userId" UUID NOT NULL,
    "startupId" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProgramAlert_pkey" PRIMARY KEY ("startupId","programId")
);

CREATE INDEX "Program_active_applicationsCloseAt_idx"
ON "nexhub"."Program"("active", "applicationsCloseAt");
CREATE INDEX "ProgramApplication_userId_createdAt_idx"
ON "nexhub"."ProgramApplication"("userId", "createdAt");
CREATE UNIQUE INDEX "ProgramApplication_startupId_programId_key"
ON "nexhub"."ProgramApplication"("startupId","programId");

ALTER TABLE "nexhub"."ProgramSave"
ADD CONSTRAINT "ProgramSave_programId_fkey"
FOREIGN KEY ("programId") REFERENCES "nexhub"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."ProgramApplication"
ADD CONSTRAINT "ProgramApplication_programId_fkey"
FOREIGN KEY ("programId") REFERENCES "nexhub"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."ProgramAlert"
ADD CONSTRAINT "ProgramAlert_programId_fkey"
FOREIGN KEY ("programId") REFERENCES "nexhub"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
