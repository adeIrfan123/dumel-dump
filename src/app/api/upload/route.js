import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "File harus berupa gambar" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = path.extname(file.name);
    const fileName = `${randomUUID()}${extension}`;

    const uploadPath = path.join("public", "uploads", fileName);

    await writeFile(uploadPath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json(
      {
        message: "Gambar berhasil diupload",
        imageUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { message: "Gagal mengupload gambar" },
      { status: 500 },
    );
  }
}
