import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET belum diset di file .env");
}

export function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7D" });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch {
    return null;
  }
}
