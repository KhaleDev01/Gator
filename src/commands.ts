import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = {
  [commandName: string]: CommandHandler;
};

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args || typeof args[0] !== "string") {
    throw new Error("enter valid command");
  }
  setUser(args[1]);
  console.log("user has been set seccessfuly.");
}
export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}
export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${handler}`);
  }
  handler(cmdName, ...args);
}
