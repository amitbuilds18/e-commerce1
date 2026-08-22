export function validateRegisterBody(body) {
    if (!body || typeof body !== "object") {
        return "Request body is required.";
    }
    const { name, email, password } = body;
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return "Name is required.";
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return "Valid email is required.";
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        return "Password is required and must be at least 6 characters.";
    }
    return null;
}
export function validateLoginBody(body) {
    if (!body || typeof body !== "object") {
        return "Request body is required.";
    }
    const { email, password } = body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return "Valid email is required.";
    }
    if (!password || typeof password !== "string" || password.length === 0) {
        return "Password is required.";
    }
    return null;
}
