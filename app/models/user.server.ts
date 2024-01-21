import db from "~/db.server";

export function getUser(email: string) {
  return db.user.findUnique({ where: { email } });
}

export function getUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}

export function createUser(email: string, firstName: string, lastName: string) {
  return db.user.create({
    data: {
      email,
      firstName,
      lastName,
    },
  });
}
