import { argv } from "node:process";
import { setUser, readConfig } from "./config";
import type { Config } from "./config";
import type { CommandHandler, CommandsRegistry } from "./commands";
import { handlerLogin, registerCommand, runCommand } from "./commands";
function main() {
  const commands: CommandsRegistry = {
    login: handlerLogin,
  };
  const args = argv.slice(2);
  if (args.length < 2) {
    console.log("Not enough arguments provided");
    process.exit(1);
  }
  runCommand(commands, "login", ...args);
}
main();
