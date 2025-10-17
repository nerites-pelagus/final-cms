// src/app/api/media/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const mediaId = Number(id);

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public/uploads", media.filename);
    try {
      await fs.unlink(filePath);
    } catch (fileError: unknown) {
      if (
        typeof fileError === "object" &&
        fileError !== null &&
        (fileError as { code?: string }).code !== "ENOENT"
      ) {
        throw fileError;
      }
      console.warn(
        `File not found, but proceeding to delete DB record: ${filePath}`
      );
    }

    await prisma.media.delete({
      where: { id: mediaId },
    });

    return NextResponse.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/media/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
