import { argv } from "node:process";
import { setUser, readConfig } from "./config";
import type { Config } from "./config";
import type { CommandHandler, CommandsRegistry } from "./commands";
import {
  handlerAggregator,
  handlerBrowse,
  handlerFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUnfollow,
  handlerUsers,
  registerCommand,
  runCommand,
} from "./commands";
import { middlewareLoggedIn } from "./middleware";
async function main() {
  const commands: CommandsRegistry = {};
  await registerCommand(commands, "login", handlerLogin);
  await registerCommand(commands, "register", handlerRegister);
  await registerCommand(commands, "reset", handlerReset);
  await registerCommand(commands, "users", handlerUsers);
  await registerCommand(commands, "agg", handlerAggregator);
  await registerCommand(commands, "addfeed", middlewareLoggedIn(handlerFeed));
  await registerCommand(commands, "feeds", handlerFeeds);
  await registerCommand(commands, "follow", middlewareLoggedIn(handlerFollow));
  await registerCommand(commands, "browse", handlerBrowse);
  await registerCommand(
    commands,
    "unfollow",
    middlewareLoggedIn(handlerUnfollow),
  );
  await registerCommand(
    commands,
    "following",
    middlewareLoggedIn(handlerFollowing),
  );
  const args = argv.slice(2);
  if (args.length < 1) {
    console.log("Not enough arguments provided");
    process.exit(1);
  }
  await runCommand(commands, args[0], ...args);
  process.exit(0);
}
main();
