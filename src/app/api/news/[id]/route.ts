import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/news/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.id) },
      include: { category: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/news/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const { title, description, content, isVisible } = data;

    const updated = await prisma.post.update({
      where: { id: Number(params.id) },
      data: { title, description, content, isVisible },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
