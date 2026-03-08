import { argv } from "node:process";
import { setUser, readConfig } from "./config";
import type { Config } from "./config";
import type { CommandHandler, CommandsRegistry } from "./commands";
import {
  handlerAggregator,
  handlerFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  registerCommand,
  runCommand,
} from "./commands";
async function main() {
  const commands: CommandsRegistry = {};
  await registerCommand(commands, "login", handlerLogin);
  await registerCommand(commands, "register", handlerRegister);
  await registerCommand(commands, "reset", handlerReset);
  await registerCommand(commands, "users", handlerUsers);
  await registerCommand(commands, "agg", handlerAggregator);
  await registerCommand(commands, "addfeed", handlerFeed);
  await registerCommand(commands, "feeds", handlerFeeds);
  await registerCommand(commands, "follow", handlerFollow);
  await registerCommand(commands, "following", handlerFollowing);
  const args = argv.slice(2);
  if (args.length < 1) {
    console.log("Not enough arguments provided");
    process.exit(1);
  }
  await runCommand(commands, args[0], ...args);
  process.exit(0);
}
main();
