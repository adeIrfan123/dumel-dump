import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import z from "zod";
import { deleteFromR2, getR2SignUrl } from "../../../lib/r2";

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

      for (const image of imagesToDelete) {
        try {
          await deleteFromR2(image.imageUrl);
        } catch {
          return NextResponse.json(
            { message: "Gagal menghapus gambar" },
            { status: 401 },
          );
        }
      }

      await prisma.postImage.deleteMany({
        where: {
          id: {
            in: deletedImageIds,
          },
          postId: id,
        },
      });
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

    const post = await prisma.post.findFirst({
      where: {
        id,
        userId: currentUser.userId,
      },
      include: {
        images: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Data post tidak ditemukan" },
        { status: 404 },
      );
    }

    const images = await Promise.all(
      post.images.map(async (image) => {
        const signedurl = await getR2SignUrl(image.imageUrl);

        return {
          ...image,
          imageUrl: signedurl,
        };
      }),
    );

    const postWithSignedUrls = {
      ...post,
      images,
    };

    return NextResponse.json(
      {
        message: `Data post ${id} berhasil diambil`,
        posts: postWithSignedUrls,
      },
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

    for (const image of existingPost.images) {
      try {
        await deleteFromR2(image.imageUrl);
      } catch {
        return NextResponse.json(
          { message: "Gagal menghapus gambar" },
          { status: 401 },
        );
      }
    }

    await prisma.post.delete({
      where: {
        id: existingPost.id,
      },
    });

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
