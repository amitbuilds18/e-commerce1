import jwt from "jsonwebtoken";

export default function generateToken(userId: number, role: string) {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
}
