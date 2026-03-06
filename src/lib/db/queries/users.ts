import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../../../schema";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}
export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return firstOrUndefined(result);
}
export async function resetDb() {
  await db.delete(users);
}
export async function getUsers() {
  return await db.select({ name: users.name }).from(users);
}
