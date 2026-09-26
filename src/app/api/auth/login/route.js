import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createToken } from "../../../lib/auth";
import crypto from "crypto";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Email atau password tidak valid" },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse(
        { message: "Email atau password salah" },
        { status: 401 },
      );
    }

    let encryptionSalt = user.encryptionSalt;

    if (!encryptionSalt) {
      encryptionSalt = crypto.randomBytes(16).toString("base64");

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          encryptionSalt,
        },
      });
    }

    const token = createToken(user.id);

    const response = NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          encryptionSalt,
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server",
      },
      {
        status: 500,
      },
    );
  }
}
