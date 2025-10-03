import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const about = await prisma.aboutUs.findFirst();
    return NextResponse.json(about || {});
  } catch (error) {
    console.error("Error in GET /api/about:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const updated = await prisma.aboutUs.upsert({
      where: { id: 1 },
      update: {
        company_name: data.company_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        description: data.description,
        logo_url: data.logo_url,
        updated_at: new Date(),
      },
      create: {
        id: 1,
        company_name: data.company_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        description: data.description,
        logo_url: data.logo_url,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in POST /api/about:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
