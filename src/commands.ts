import { log } from "console";
import { readConfig, setUser } from "./config";
import {
  createUser,
  getUser,
  getUserById,
  getUsers,
  resetDb,
} from "./lib/db/queries/users";
import { fetchFeed } from "./feed";
import { feeds, users } from "./schema";
import { createFeed, getFeedByUrl, getFeeds } from "./lib/db/queries/feeds";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "./lib/db/queries/feed_follow";
import { parseDuration } from "./utils";
import { scrapeFeeds } from "./scraper";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;
export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;
export type CommandsRegistry = {
  [commandName: string]: CommandHandler;
};

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args || typeof args[0] !== "string") {
    throw new Error("enter valid command");
  }
  const user = await getUser(args[1]);
  if (!user.name) {
    throw new Error("user unknown...");
    process.exit(1);
  }
  setUser(args[1]);
  console.log(args[1]);
  console.log("user has been set seccessfuly.");
}
export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args[1]) {
    throw new Error("enter a username");
  }
  const name = args[1];
  const user = await getUser(name);
  if (user) {
    throw new Error("user already exists...");
  }
  await createUser(name);
  setUser(args[1]);
  console.log(`user ${name} created successfully.`);
}
export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}
export async function handlerReset(cmdName: string, ...args: string[]) {
  await resetDb();
}
export async function handlerUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers();
  const config = readConfig();
  for (const user of users) {
    if (config.currentUserName === user.name) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}
export async function handlerAggregator(cmdName: string, ...args: string[]) {
  if (!args[1]) {
    throw new Error("please provide a time between requests e.g. 1s, 1m, 1h");
  }
  const timeBetweenRequests = parseDuration(args[1]);
  console.log(`Collecting feeds every ${args[1]}`);
  scrapeFeeds().catch(console.error);
  const interval = setInterval(() => {
    scrapeFeeds().catch(console.error);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });

  const res = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(res, null, 2));
}
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${handler}`);
  }
  await handler(cmdName, ...args);
}
export async function handlerFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  console.log(args[1]);

  console.log(args[2]);
  if (!args[1] || !args[2]) {
    console.log("please provide name and url.");
    process.exit(1);
  }
  const fullUser = await getUser(readConfig().currentUserName);
  const feed = await createFeed(args[1], args[2], fullUser.id);
  await createFeedFollow(fullUser.id, feed.id);
  console.log(user);
}
function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args[1]) {
    throw new Error("Please provide a url.");
  }
  await deleteFeedFollow(user.id, args[1]);
}
export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (!args[1]) {
    throw new Error("Please provide a url.");
  }
  const fullUser = await getUser(readConfig().currentUserName);
  const feed = await getFeedByUrl(args[1]);
  if (!feed) {
    throw new Error("feed not found");
  }
  const feedFollow = await createFeedFollow(fullUser.id, feed.id);
  console.log(`Feed: ${feed.name} has been followed by ${fullUser.name}`);
}
export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const feedsFollows = await getFeedFollowsForUser(
    readConfig().currentUserName,
  );
  for (const follow of feedsFollows) {
    console.log(`Feed: ${follow.feedName}`);
  }
}
export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const allFeeds = await getFeeds();
  for (const feed of allFeeds) {
    const user = await getUserById(feed.user_id);
    if (!user) {
      throw new Error(`Failed to find usr for feed ${feed.id}`);
    }
    printFeed(feed, user);
    console.log("=================================");
  }
}
