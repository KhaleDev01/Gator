import { db } from "..";
import { eq, and } from "drizzle-orm";
import { feed_follows, feeds, users } from "src/schema";
import { getUser } from "./users";
import { readConfig } from "src/config";
import { getFeedByUrl } from "./feeds";
export async function createFeedFollow(user_id: string, feed_id: string) {
  const [newFeedFollow] = await db
    .insert(feed_follows)
    .values({ user_id, feed_id })
    .returning();
  const [result] = await db
    .select({
      id: feed_follows.id,
      user_id: feed_follows.user_id,
      feed_id: feed_follows.feed_id,
      createdAt: feed_follows.createdAt,
      updatedAt: feed_follows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.id, newFeedFollow.id));
  return result;
}
export async function getFeedFollowsForUser(userName: string) {
  const fullUser = await getUser(readConfig().currentUserName);
  const result = await db
    .select({
      id: feed_follows.id,
      user_id: feed_follows.user_id,
      feed_id: feed_follows.feed_id,
      createdAt: feed_follows.createdAt,
      updatedAt: feed_follows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, fullUser.id));
  return result;
}
export async function deleteFeedFollow(user_id: string, url: string) {
  const feed = await getFeedByUrl(url);
  await db
    .delete(feed_follows)
    .where(
      and(eq(feed_follows.user_id, user_id), eq(feed_follows.feed_id, feed.id)),
    );
}
