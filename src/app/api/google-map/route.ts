// src/app/api/google-map/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const setting = await prisma.googleMapSetting.findUnique({
      where: { id: 1 },
    });
    const embedCode = setting?.embed_code || `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096949339393!2d105.78009371542183!3d21.02882569288151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86cece2481%3A0x28024958f284e3a3!2sKeangnam%20Hanoi%20Landmark%20Tower!5e0!3m2!1sen!2svn!4v1668843180182!5m2!1sen!2svn" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    
    return NextResponse.json({ embedCode });
  } catch (error) {
    console.error("Failed to fetch Google Map setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { embedCode } = await req.json();

    if (typeof embedCode !== 'string') {
      return NextResponse.json({ error: "Invalid embed code provided" }, { status: 400 });
    }

    await prisma.googleMapSetting.upsert({
      where: { id: 1 },
      update: { embed_code: embedCode },
      create: { id: 1, embed_code: embedCode },
    });

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Failed to save Google Map setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}