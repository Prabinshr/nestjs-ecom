-- CreateTable
CREATE TABLE "ResetPassword" (
    "email" TEXT NOT NULL,
    "pass_reset_token" BIGINT NOT NULL,
    "pass_reset_token_expires" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPassword_email_key" ON "ResetPassword"("email");
