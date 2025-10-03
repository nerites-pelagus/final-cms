import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET ?category=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;

  const posts = await prisma.post.findMany({
    where: category ? { type: category } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

// POST
export async function POST(req: Request) {
  const data = await req.json();
  const newPost = await prisma.post.create({ data });
  return NextResponse.json(newPost);
}
