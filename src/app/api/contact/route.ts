import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy dữ liệu" }, { status: 500 });
  }
}
