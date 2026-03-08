import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};
type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });
  const xml = await response.text();
  const parser = new XMLParser();
  const parsed = parser.parse(xml);
  if (!parsed.rss?.channel) {
    throw new Error("channel is undefined");
  }
  const channel = parsed.rss.channel;
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("invalid feed...");
  }

  let items: RSSItem[] = [];
  if (Array.isArray(channel.item)) {
    items = channel.item;
  } else if (typeof channel.item === "object") {
    items = [channel.item];
  }
  const feedItem: RSSItem[] = [];
  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }
    feedItem.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: feedItem,
    },
  };
}
