-- CreateTable
CREATE TABLE "AboutUs" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "description" TEXT,
    "logo_url" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUs_pkey" PRIMARY KEY ("id")
);
