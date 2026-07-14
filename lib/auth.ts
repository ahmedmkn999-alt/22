import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
) {
  return bcrypt.compare(password, hash);
}

export function createToken(data: any) {
  return jwt.sign(
    data,
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d"
    }
  );
}
