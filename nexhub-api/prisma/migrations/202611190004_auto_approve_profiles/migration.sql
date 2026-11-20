UPDATE "nexhub"."Startup"
SET "status" = 'APPROVED',
    "moderationReason" = NULL
WHERE "status" <> 'APPROVED';

UPDATE "nexhub"."Investor"
SET "status" = 'APPROVED',
    "moderationReason" = NULL
WHERE "status" <> 'APPROVED';
