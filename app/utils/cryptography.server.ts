import crypto from "crypto";

export function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
