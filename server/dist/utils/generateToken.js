import jwt from "jsonwebtoken";
export default function generateToken(userId, role) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ id: userId, role }, secret, {
        expiresIn: "7d",
    });
}
