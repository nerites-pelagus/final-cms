// src/app/api/media/route.ts

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const media = await prisma.media.findMany({
      where: type ? { type } : {},
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("GET /api/media error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;

    const newMedia = await prisma.media.create({
      data: {
        url,
        type,
        filename,
      },
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}