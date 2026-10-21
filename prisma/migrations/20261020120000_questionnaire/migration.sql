CREATE TABLE "QuestionnaireSubmission" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "firstName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "telegram" TEXT NOT NULL,
  "answers" JSONB NOT NULL,
  "result" JSONB NOT NULL,
  "priority" TEXT NOT NULL,
  "reviewPending" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "QuestionnaireSubmission_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "QuestionnaireSubmission_createdAt_idx" ON "QuestionnaireSubmission"("createdAt");
CREATE INDEX "QuestionnaireSubmission_priority_idx" ON "QuestionnaireSubmission"("priority");
