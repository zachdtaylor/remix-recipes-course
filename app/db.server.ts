import { PrismaClient } from "@prisma/client";

interface CustomNodeJSGlobal extends NodeJS.Global {
  db: PrismaClient;
}

declare const global: CustomNodeJSGlobal;

const db = global.db || new PrismaClient();

if (process.env.NODE_ENV === "development") global.db = db;

export default db;
