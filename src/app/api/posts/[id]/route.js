import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import z from "zod";
import { unlink } from "fs/promises";
import path from "path";

export async function PATCH(request, { params }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateSchema = z.object({
      title: z.string().max(100).optional(),
      content: z.string().min(1, "Content tidak boleh kosong").optional(),
      mood: z.string().max(30).optional(),
      imageUrls: z.array(z.string()).optional(),
      deletedImageIds: z.array(z.string()).optional(),
    });

    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Data posts tidak valid",
          error: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        userId: currentUser.userId,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Data post tidak ditemukan" },
        { status: 404 },
      );
    }

    const {
      title,
      content,
      mood,
      deletedImageIds = [],
      imageUrls = [],
    } = result.data;

    if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.postImage.findMany({
        where: {
          id: {
            in: deletedImageIds,
          },
          postId: id,
        },
      });

      await prisma.postImage.deleteMany({
        where: {
          id: {
            in: deletedImageIds,
          },
          postId: id,
        },
      });

      for (const image of imagesToDelete) {
        const fileName = path.basename(image.imageUrl);

        const filePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          fileName,
        );

        try {
          await unlink(filePath);
          console.log("File gambar dihapus:", filePath);
        } catch (error) {
          if (error.code === "ENOENT") {
            console.log("File gambar tidak ditemukan:", filePath);
          } else {
            console.error("Gagal menghapus file gambar:", error);
          }
        }
      }
    }

    if (imageUrls.length > 0) {
      await prisma.postImage.createMany({
        data: imageUrls.map((imageUrl) => ({
          postId: id,
          imageUrl,
        })),
      });
    }

    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        mood,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(
      { message: "Data post berhasil diperbarui", post },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan diserver ${error}` },
      { status: 500 },
    );
  }
}

export async function GET(request, { params }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const posts = await prisma.post.findFirst({
      where: {
        id,
        userId: currentUser.userId,
      },
      include: {
        images: true,
      },
    });

    if (!posts) {
      return NextResponse.json(
        { message: "Data posts tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: `Data posts ${id} berhasil diambil`, posts },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kelasahan diserver ${error}` },
      { status: "500" },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPost = await prisma.post.findFirst({
      where: { id, userId: currentUser.userId },
      include: {
        images: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Data post tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.post.delete({
      where: {
        id: existingPost.id,
      },
    });

    for (const image of existingPost.images) {
      const fileName = path.basename(image.imageUrl);

      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      try {
        await unlink(filePath);

        console.log("File gambar dihapus:", filePath);
      } catch (error) {
        if (error.code === "ENOENT") {
          console.log("File gambar tidak ditemukan:", filePath);
        } else {
          console.error("Gagal menghapus file gambar:", error);
        }
      }
    }

    return NextResponse.json(
      { message: "Data post berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan diserver ${error}` },
      { status: 500 },
    );
  }
}
