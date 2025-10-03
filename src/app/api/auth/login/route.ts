import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = "secret-key"; 

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Sai tài khoản" }, { status: 401 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

  const res = NextResponse.json({ message: "Đăng nhập thành công" });
  res.cookies.set("token", token, { httpOnly: true });
  return res;
}
