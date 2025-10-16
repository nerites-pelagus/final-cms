import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lấy danh sách bài viết (có lọc category)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id"); // 👈 cho phép GET 1 bài cụ thể

    // Nếu có id → trả về 1 bài
    if (id) {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { category: true },
      });

      if (!post)
        return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });

      return NextResponse.json(post);
    }

    // Nếu không có id → trả về danh sách
    const posts = await prisma.post.findMany({
      where: category
        ? {
            OR: [
              { category: { name: category } },
              { category: { slug: category } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        language: true,
        publishedAt: true,
        isVisible: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Thêm bài viết mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, content, category, isVisible } = body;

    let foundCategory = await prisma.category.findFirst({
      where: { OR: [{ name: category }, { slug: category }] },
    });

    if (!foundCategory) {
      foundCategory = await prisma.category.create({
        data: { name: category, slug: category },
      });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        content,
        slug,
        isVisible,
        category: { connect: { id: foundCategory.id } },
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// ✅ Cập nhật bài viết (cho trang Edit)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, content, category, isVisible } = body;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID bài viết" }, { status: 400 });
    }

    let foundCategory = await prisma.category.findFirst({
      where: { OR: [{ name: category }, { slug: category }] },
    });

    if (!foundCategory) {
      foundCategory = await prisma.category.create({
        data: { name: category, slug: category },
      });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        content,
        slug,
        isVisible,
        category: { connect: { id: foundCategory.id } },
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Xóa bài viết
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Thiếu ID" }, { status: 400 });
    }

    await prisma.post.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Đã xóa thành công" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Xóa thất bại" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
