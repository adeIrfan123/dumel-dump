import { NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { uploadToR2 } from "../../lib/r2";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    if (file.type !== "application/octet-stream") {
      return NextResponse.json(
        { message: "File terenkripsi tidak valid" },
        { status: 400 },
      );
    }

    // const extension = path.extname(file.name);
    const fileName = `${randomUUID()}.enc`;

    const key = `posts/${fileName}`;

    await uploadToR2(file, key);

    return NextResponse.json(
      {
        message: "Gambar berhasil diupload",
        imageUrl: key,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Gagal mengupload gambar" },
      { status: 500 },
    );
  }
}
