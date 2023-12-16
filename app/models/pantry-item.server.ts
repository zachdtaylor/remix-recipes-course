import db from "~/db.server";

export function createShelfItem(shelfId: string, name: string) {
  return db.pantryItem.create({
    data: {
      shelfId,
      name,
    },
  });
}
