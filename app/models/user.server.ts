import db from "~/db.server";

export function getUser(email: string) {
  return db.user.findUnique({ where: { email } });
}
