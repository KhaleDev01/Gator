import { db } from "..";
import { eq, sql } from "drizzle-orm";
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

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}
export async function markFeedFetched(feedId: string) {
  await db
    .update(feeds)
    .set({ last_fetched_at: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId));
}
export async function getNextFeedToFetch() {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`)
    .limit(1);
  return result;
}
