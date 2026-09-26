import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "Password wajib diisi" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.userId,
      },
      select: {
        id: true,
        password: true,
        encryptionSalt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Unlock berhasil",
      encryptionSalt: user.encryptionSalt,
    });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalan diserver" },
      { status: 500 },
    );
  }
}
