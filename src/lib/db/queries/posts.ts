import { db } from "..";
import { eq, desc } from "drizzle-orm";
import { posts, feed_follows } from "src/schema";

export type Post = typeof posts.$inferSelect;

export async function createPost(post: {
  title: string;
  url: string;
  description?: string;
  publishedAt?: Date;
  feed_id: string;
}) {
  try {
    const [result] = await db.insert(posts).values(post).returning();
    return result;
  } catch (e: any) {
    if (e.code === "23505") return;
    throw e;
  }
}

export async function getPostsForUser(userId: string, limit: number) {
  return await db
    .select({
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .innerJoin(feed_follows, eq(feed_follows.feed_id, posts.feed_id))
    .where(eq(feed_follows.user_id, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}
