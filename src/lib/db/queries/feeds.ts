import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds, users } from "src/schema";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id })
    .returning();
  return result;
}
export async function getFeeds() {
  const result = await db.select().from(feeds);
  return result;
}
