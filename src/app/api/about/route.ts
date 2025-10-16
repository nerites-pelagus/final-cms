import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

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
    const formData = await req.formData();

    const data: { [key: string]: any } = {
      company_name: formData.get("company_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
    };

    const logoFile = formData.get("logo_file") as File | null;
    let logoUrl = null;

    if (logoFile) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      
      const filename = `${Date.now()}-${logoFile.name.replace(/\s/g, "_")}`;
      
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      await fs.mkdir(uploadDir, { recursive: true });
      
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      
      logoUrl = `/uploads/${filename}`;
      data.logo_url = logoUrl;
    }

    const updated = await prisma.aboutUs.upsert({
      where: { id: 1 },
      update: {
        ...data,
        updated_at: new Date(),
      },
      create: {
        id: 1,
        company_name: data.company_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        description: data.description,
        logo_url: data.logo_url || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in POST /api/about:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}