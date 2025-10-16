import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    // Tìm user có id lớn nhất
    const lastUser = await prisma.user.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const nextId = lastUser ? lastUser.id + 1 : 1;

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { id: nextId, email, password: hashed, role },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Failed to create account:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { id, email, role, password } = await req.json();

  let dataToUpdate: { email: string; role: string; password?: string } = {
    email,
    role,
  };

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Không tìm thấy user" }, { status: 404 });
  if (user.role === "Admin") {
    return NextResponse.json({ error: "Không thể xóa Admin" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
