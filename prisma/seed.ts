import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

function createUser() {
  return db.user.create({
    data: {
      email: "me@example.com",
      firstName: "Zach",
      lastName: "Taylor",
    },
  });
}

function getShelves(userId: string) {
  return [
    {
      userId,
      name: "Dairy",
      items: {
        create: [
          { userId, name: "Milk" },
          { userId, name: "Eggs" },
          { userId, name: "Cheese" },
        ],
      },
    },
    {
      userId,
      name: "Fruits",
      items: {
        create: [
          { userId, name: "Apples" },
          { userId, name: "Oranges" },
        ],
      },
    },
  ];
}

async function seed() {
  const user = await createUser();
  await Promise.all(
    getShelves(user.id).map((shelf) => db.pantryShelf.create({ data: shelf }))
  );
}

seed();
