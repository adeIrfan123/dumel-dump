import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().max(100).optional(),
  content: z.string().min(1, "Content tidak boleh kosong"),
  mood: z.string().max(30).optional(),
  imageUrl: z.string().url().optional(),
});

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Data post tidak valid" },
        { status: 400 },
      );
    }

    const { title, content, mood, imageUrl } = result.data;

    const posts = await prisma.post.create({
      data: {
        userId: currentUser.userId,
        title,
        content,
        mood,
        imageUrl,
      },
    });

    return NextResponse.json(
      {
        message: "Data posts berhasil dibuat",
        posts,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan dari server ${error}` },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: currentUser.userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        message: "Data posts berhasil diambil",
        posts,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Terjadi kesalahan di server ${error}` },
      { status: 500 },
    );
  }
}
