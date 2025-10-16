-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "custom_css" TEXT,

    CONSTRAINT "FaqSetting_pkey" PRIMARY KEY ("id")
);
