// src/app/api/media/[id]/route.ts

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mediaId = Number(params.id);

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public/uploads", media.filename);
    try {
      await fs.unlink(filePath);
    } catch (fileError: any) {
      if (fileError.code !== 'ENOENT') {
        throw fileError;
      }
      console.warn(`File not found, but proceeding to delete DB record: ${filePath}`);
    }

    await prisma.media.delete({
      where: { id: mediaId },
    });

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error(`DELETE /api/media/${params.id} error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}