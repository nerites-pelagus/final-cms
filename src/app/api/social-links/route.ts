import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const linksFromDb = await prisma.socialLink.findMany();

    const socialLinks = linksFromDb.reduce((acc, link) => {
      acc[link.platform] = link.url;
      return acc;
    }, {} as { [key: string]: string });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const socialLinks: { [key: string]: string } = await req.json();

    const updateOperations = Object.keys(socialLinks).map((platform) =>
      prisma.socialLink.upsert({
        where: { platform },
        update: { url: socialLinks[platform] },
        create: { platform, url: socialLinks[platform] },
      })
    );

    await prisma.$transaction(updateOperations);

    return NextResponse.json({ message: "Social links saved successfully" });
  } catch (error) {
    console.error("Failed to save social links:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}