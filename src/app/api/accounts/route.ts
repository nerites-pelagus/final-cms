import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET all
export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(users);
}

// POST create
export async function POST(req: Request) {
  const { email, password, role } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  return NextResponse.json(newUser);
}

// PUT update
export async function PUT(req: Request) {
  const { id, email, role } = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data: { email, role },
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: Request) {
  const { id } = await req.json();

  // check user role
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Không tìm thấy user" }, { status: 404 });
  if (user.role === "Admin") {
    return NextResponse.json({ error: "Không thể xóa Admin" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
