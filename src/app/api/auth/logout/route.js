import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logout berhasi" },
      { status: 200 },
    );

    response.cookies.delete("token");

    return response;
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalaha di server" },
      { status: 500 },
    );
  }
}
