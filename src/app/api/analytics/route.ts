// src/app/api/analytics/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const setting = await prisma.analyticsSetting.findUnique({
      where: { id: 1 },
    });
    
    const analyticsCode = setting?.tracking_code || "";
    
    return NextResponse.json({ analyticsCode });
  } catch (error) {
    console.error("Failed to fetch Analytics setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { analyticsCode } = await req.json();

    if (typeof analyticsCode !== 'string') {
      return NextResponse.json({ error: "Invalid code provided" }, { status: 400 });
    }

    await prisma.analyticsSetting.upsert({
      where: { id: 1 },
      update: { tracking_code: analyticsCode },
      create: { id: 1, tracking_code: analyticsCode },
    });

    return NextResponse.json({ message: "Saved successfully" });
  } catch (error) {
    console.error("Failed to save Analytics setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}