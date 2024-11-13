import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./envConfigs";

export function generateToken(payload: object, expiresIn: string = "1h") {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}
