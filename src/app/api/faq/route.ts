// src/app/api/faq/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export async function GET() {
  try {
    const [faqs, settings] = await Promise.all([
      prisma.faq.findMany(),
      prisma.faqSetting.findUnique({ where: { id: 1 } }),
    ]);

    const defaultCSS = `details { background: #f9fafb; padding: 10px; border-radius: 6px; }
summary { cursor: pointer; font-weight: bold; }
summary:hover { color: #2563eb; }
p { margin-top: 8px; }`;

    return NextResponse.json({
      faqs: faqs || [],
      customCSS: settings?.custom_css || defaultCSS,
    });
  } catch (error) {
    console.error("Failed to fetch FAQ data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { faqs, customCSS } = await req.json();

    if (!Array.isArray(faqs)) {
      return NextResponse.json(
        { error: "Invalid data format: 'faqs' must be an array." },
        { status: 400 }
      );
    }

    for (const faq of faqs) {
      if (typeof faq.question !== "string" || faq.question.trim() === "") {
        return NextResponse.json(
          {
            error:
              "Invalid data format: Each FAQ item must have a non-empty 'question' string.",
          },
          { status: 400 }
        );
      }
      if (typeof faq.answer !== "string" || faq.answer.trim() === "") {
        return NextResponse.json(
          {
            error:
              "Invalid data format: Each FAQ item must have a non-empty 'answer' string.",
          },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.faq.deleteMany({});

      if (faqs.length > 0) {
        await tx.faq.createMany({
          data: faqs.map((faq: { question: string; answer: string }) => ({
            question: faq.question.trim(), 
            answer: faq.answer.trim(), 
          })),
        });
      }

      await tx.faqSetting.upsert({
        where: { id: 1 },
        update: { custom_css: customCSS },
        create: { id: 1, custom_css: customCSS },
      });
    });

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Failed to save FAQ data:", error);
    return NextResponse.json(
      { error: "Internal Server Error during save operation." },
      { status: 500 }
    );
  }
}
