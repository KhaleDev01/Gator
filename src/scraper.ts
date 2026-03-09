import { log } from "node:console";
import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { fetchFeed } from "./feed";
import { createPost } from "./lib/db/queries/posts";

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("no feed to fetch.");
    return;
  }
  await markFeedFetched(feed.id);
  const rssFeed = await fetchFeed(feed.url);
  for (const item of rssFeed.channel.item) {
    let publishedAt: Date | undefined;
    try {
      publishedAt = item.pubDate ? new Date(item.pubDate) : undefined;
    } catch {
      publishedAt = undefined;
    }
    await createPost({
      title: item.title,
      url: item.link,
      description: item.description,
      publishedAt,
      feed_id: feed.id,
    });
  }
  console.log(`scraped ${rssFeed.channel.item.length} posts from ${feed.name}`);
}
