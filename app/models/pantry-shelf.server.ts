import db from "~/db.server";
import { handleDelete } from "./utils";

export function getAllShelves(userId: string, query: string | null) {
  return db.pantryShelf.findMany({
    where: {
      userId,
      name: {
        contains: query ?? "",
        mode: "insensitive",
      },
    },
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function createShelf(userId: string) {
  return db.pantryShelf.create({
    data: {
      userId,
      name: "New Shelf",
    },
  });
}

export function deleteShelf(id: string) {
  return handleDelete(() => db.pantryShelf.delete({ where: { id } }));
}

export function saveShelfName(shelfId: string, shelfName: string) {
  return db.pantryShelf.update({
    where: {
      id: shelfId,
    },
    data: {
      name: shelfName,
    },
  });
}

export function getShelf(id: string) {
  return db.pantryShelf.findUnique({ where: { id } });
}
