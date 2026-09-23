import { z } from "zod";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import crypto from "crypto";

const registerSchema = z.object({
  username: z.string().min(3).max(25),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Data tidak valid" },
        { status: 400 },
      );
    }

    const { username, email, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username atau email sudah digunakan" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptionSalt = crypto.randomBytes(16).toString("base64");

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        encryptionSalt,
      },
    });

    return NextResponse.json(
      {
        message: "Registrasi Berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
