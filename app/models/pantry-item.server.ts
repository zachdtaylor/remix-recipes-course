import db from "~/db.server";
import { handleDelete } from "./utils";

export function createShelfItem(userId: string, shelfId: string, name: string) {
  return db.pantryItem.create({
    data: {
      userId,
      shelfId,
      name,
    },
  });
}

export function deleteShelfItem(id: string) {
  return handleDelete(() =>
    db.pantryItem.delete({
      where: {
        id,
      },
    })
  );
}

export function getShelfItem(id: string) {
  return db.pantryItem.findUnique({ where: { id } });
}
