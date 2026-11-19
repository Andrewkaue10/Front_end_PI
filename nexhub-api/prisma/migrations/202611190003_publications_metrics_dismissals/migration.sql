CREATE TYPE "nexhub"."PostStatus" AS ENUM ('PUBLISHED', 'DRAFT');

CREATE TABLE "nexhub"."Post" (
  "id" UUID NOT NULL,
  "authorId" UUID NOT NULL,
  "text" TEXT NOT NULL,
  "status" "nexhub"."PostStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."PostTag" (
  "postId" UUID NOT NULL,
  "tag" TEXT NOT NULL,
  CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tag")
);

CREATE TABLE "nexhub"."StartupMetric" (
  "id" UUID NOT NULL,
  "startupId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "unit" TEXT NOT NULL DEFAULT '',
  "period" TEXT NOT NULL DEFAULT '',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StartupMetric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."PostMetric" (
  "postId" UUID NOT NULL,
  "metricId" UUID NOT NULL,
  CONSTRAINT "PostMetric_pkey" PRIMARY KEY ("postId")
);

CREATE TABLE "nexhub"."Comment" (
  "id" UUID NOT NULL,
  "postId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "text" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "nexhub"."PostLike" (
  "postId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostLike_pkey" PRIMARY KEY ("postId", "userId")
);

CREATE TABLE "nexhub"."PostRepost" (
  "postId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostRepost_pkey" PRIMARY KEY ("postId", "userId")
);

CREATE TABLE "nexhub"."MatchDismissal" (
  "investorId" UUID NOT NULL,
  "startupId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MatchDismissal_pkey" PRIMARY KEY ("investorId", "startupId")
);

CREATE INDEX "Post_status_createdAt_idx" ON "nexhub"."Post"("status", "createdAt");
CREATE INDEX "Post_authorId_status_createdAt_idx" ON "nexhub"."Post"("authorId", "status", "createdAt");
CREATE INDEX "PostTag_tag_idx" ON "nexhub"."PostTag"("tag");
CREATE INDEX "StartupMetric_startupId_updatedAt_idx" ON "nexhub"."StartupMetric"("startupId", "updatedAt");
CREATE INDEX "Comment_postId_createdAt_idx" ON "nexhub"."Comment"("postId", "createdAt");
CREATE INDEX "MatchDismissal_startupId_idx" ON "nexhub"."MatchDismissal"("startupId");

ALTER TABLE "nexhub"."Post"
  ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "nexhub"."Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."PostTag"
  ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "nexhub"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."StartupMetric"
  ADD CONSTRAINT "StartupMetric_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "nexhub"."Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."PostMetric"
  ADD CONSTRAINT "PostMetric_postId_fkey" FOREIGN KEY ("postId") REFERENCES "nexhub"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "PostMetric_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "nexhub"."StartupMetric"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."Comment"
  ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "nexhub"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."PostLike"
  ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "nexhub"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."PostRepost"
  ADD CONSTRAINT "PostRepost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "nexhub"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "PostRepost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "nexhub"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "nexhub"."MatchDismissal"
  ADD CONSTRAINT "MatchDismissal_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "nexhub"."Investor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "MatchDismissal_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "nexhub"."Startup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
