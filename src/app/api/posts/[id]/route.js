import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import z from "zod";

const updateSchema = z.object({
  title: z.string().max(100).optional(),
  content: z.string().min(1, "Content tidak boleh kosong").optional(),
  mood: z.string().max(30).optional(),
  iamgeUrl: z.string().url().nullable().optional(),
});

export async function PATCH(request, { params }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
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

    const { title, content, mood, imageUrl } = result.data;

    const existingUser = await prisma.post.findFirst({
      where: {
        id,
        userId: currentUser.userId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Data post tidak ditemukan" },
        { status: 404 },
      );
    }

    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        mood,
        imageUrl,
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
