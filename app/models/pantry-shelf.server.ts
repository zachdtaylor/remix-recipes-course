import db from "~/db.server";

export function getAllShelves() {
  return db.pantryShelf.findMany({
    include: {
      items: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });
}
